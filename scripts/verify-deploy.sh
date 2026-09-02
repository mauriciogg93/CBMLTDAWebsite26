#!/usr/bin/env bash
# Post-deploy verification. Run by hand after every deploy —
# CI never runs it (Workers Builds runs nothing after deploying; the sftp workflow only
# smoke-tests). Reads the site URL from src/site.config.ts unless one is passed:
#   npm run verify                                   # the production URL from site.config.ts
#   npm run verify -- https://<name>.<account>.workers.dev   # a preview / workers.dev URL
# Exit code 1 if any hard check fails; "warn" lines are things to decide, not defects.
# The www→apex redirect is a warning on workers.dev URLs. On Cloudflare the first run after
# the first deploy is expected to fail exactly the https and www checks until the zone
# settings R-step (Always Use HTTPS + Redirect Rule) is done.
set -u

DEFAULT_URL="$(grep -m1 -E "^\s*url:\s*['\"]https?://" src/site.config.ts 2>/dev/null | sed -E "s/.*['\"](https?:\/\/[^'\"]+)['\"].*/\1/")"
BASE="${1:-${DEFAULT_URL:-}}"
if [ -z "$BASE" ]; then echo "usage: npm run verify -- https://your-domain.tld"; exit 2; fi
BASE="${BASE%/}"
HOST="${BASE#https://}"
HOST="${HOST#http://}"
APEX=1
case "$HOST" in *.workers.dev) APEX=0 ;; esac

pass=0; fail=0; warn=0
ok()   { echo "  ok    $1"; pass=$((pass + 1)); }
bad()  { echo "  FAIL  $1 — $2"; fail=$((fail + 1)); }
note() { echo "  warn  $1 — $2"; warn=$((warn + 1)); }

status()   { curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$@" 2>/dev/null || echo "000"; }
location() { curl -sS -o /dev/null -D - --max-time 20 "$@" 2>/dev/null | tr -d '\r' | awk 'tolower($1)=="location:"{print $2}' | tail -1; }
header()   { curl -sS -o /dev/null -D - --max-time 20 "$1" 2>/dev/null | tr -d '\r' | awk -v h="$2" 'tolower($1)==tolower(h)":"{sub(/^[^:]+: */,""); print}' | tail -1; }
body()     { curl -sS --max-time 20 "$1" 2>/dev/null; }

echo "Verifying $BASE"

# 1. Homepage
home="$(body "$BASE/")"
code="$(status "$BASE/")"
if [ "$code" = "200" ] && printf '%s' "$home" | grep -q '<title>'; then ok "homepage 200 with <title>"; else bad "homepage" "status $code"; fi

# 2. http → https
if [ "$APEX" = "1" ]; then
  loc="$(location "http://$HOST/")"
  case "$loc" in https://*) ok "http → https redirect ($loc)" ;; *) bad "http → https redirect" "got '${loc:-none}' — enable SSL/TLS → Edge Certificates → Always Use HTTPS (cloudflare) or check .htaccess (sftp)" ;; esac
fi

# 3. www → apex
if [ "$APEX" = "1" ]; then
  loc="$(location "https://www.$HOST/")"
  if [ "$loc" = "$BASE/" ]; then ok "www → apex redirect"; else note "www → apex redirect" "got '${loc:-none}' — create the dashboard Redirect Rule (cloudflare) or check .htaccess (sftp)"; fi
fi

# 4. Trailing slash — probed on the first nav entry of site.config.ts (the template used /about)
page="$(grep -oE "href: '/[^/']+/'" src/site.config.ts 2>/dev/null | head -1 | sed -E "s/.*'\/([^/']+)\/'.*/\1/")"
page="${page:-about}"
loc="$(location "$BASE/$page")"
if [ "$loc" = "/$page/" ] || [ "$loc" = "$BASE/$page/" ]; then ok "trailing-slash redirect (/$page → /$page/)"; else bad "trailing-slash redirect" "got '${loc:-none}'"; fi

# 5. Custom 404 (status 404 AND our own page — a platform default 404 has no <title>)
code="$(status "$BASE/this-page-does-not-exist/")"
if [ "$code" = "404" ] && body "$BASE/this-page-does-not-exist/" | grep -q '<title>'; then ok "custom 404 page"; else bad "custom 404 page" "status $code"; fi

# 6. robots.txt + sitemap
if body "$BASE/robots.txt" | grep -q '^Sitemap: '; then ok "robots.txt with Sitemap:"; else bad "robots.txt" "missing or no Sitemap line"; fi
code="$(status "$BASE/sitemap-index.xml")"
if [ "$code" = "200" ]; then ok "sitemap-index.xml 200"; else bad "sitemap-index.xml" "status $code"; fi

# 7. Immutable cache on a hashed asset
asset="$(printf '%s' "$home" | grep -o '/_astro/[^"'"'"' ]*\.css' | head -1)"
if [ -n "$asset" ]; then
  cc="$(header "$BASE$asset" cache-control)"
  case "$cc" in *immutable*) ok "immutable cache on $asset" ;; *) bad "immutable cache" "cache-control: '${cc:-none}' on $asset" ;; esac
else
  note "immutable cache" "no /_astro/*.css found in the homepage"
fi

# 8. Primary CTA on the homepage: WhatsApp (follow the wa.me redirect), else tel:, else mailto:
wa="$(printf '%s' "$home" | grep -o 'href="https://wa.me/[^"]*' | head -1 | sed 's/href="//;s/&amp;/\&/g')"
if [ -n "$wa" ]; then
  loc="$(location -A 'Mozilla/5.0' "$wa")"
  case "$loc" in https://api.whatsapp.com/send/*) ok "WhatsApp CTA ($wa → api.whatsapp.com)" ;; *) bad "WhatsApp CTA" "wa.me did not redirect to api.whatsapp.com (got '${loc:-none}')" ;; esac
elif printf '%s' "$home" | grep -q 'href="tel:'; then ok "phone CTA (tel: link) present on the homepage"
elif printf '%s' "$home" | grep -q 'href="mailto:'; then ok "email CTA (mailto: link) present on the homepage"
elif printf '%s' "$home" | grep -q -i 'web3forms\|<form'; then ok "contact form present on the homepage"
else bad "primary CTA" "no wa.me / tel: / mailto: link or form on the homepage"
fi

# 9. Server config files must not be public. Workers serves every file in dist/ — including
#    dotfiles — unless public/.assetsignore excludes it; Apache answers 403 for .ht* itself.
code="$(status "$BASE/.htaccess")"
case "$code" in 403|404) ok ".htaccess not served ($code)" ;; *) bad ".htaccess exposed" "status $code — add it to public/.assetsignore (cloudflare)" ;; esac

# 10. Link-preview image and touch icon (generated by `npm run brand`)
og="$(printf '%s' "$home" | grep -o 'property="og:image" content="[^"]*' | sed 's/.*content="//')"
if [ -n "$og" ]; then
  code="$(status "$og")"
  if [ "$code" = "200" ]; then ok "og:image 200 ($og)"; else bad "og:image" "status $code for $og"; fi
else
  note "og:image" "no og:image tag on the homepage — links shared on WhatsApp/LinkedIn/Slack show no image (npm run brand + ogImage in site.config.ts)"
fi
icon="$(printf '%s' "$home" | grep -o 'rel="apple-touch-icon"[^>]*href="[^"]*' | sed 's/.*href="//')"
if [ -n "$icon" ]; then
  code="$(status "$BASE$icon")"
  if [ "$code" = "200" ]; then ok "apple-touch-icon 200 ($icon)"; else bad "apple-touch-icon" "status $code for $icon"; fi
else
  note "apple-touch-icon" "no <link rel=\"apple-touch-icon\"> — iOS/Android home-screen icons ignore favicon.svg"
fi

# 11. Security headers (public/_headers on cloudflare, .htaccess on sftp)
for h in x-content-type-options referrer-policy x-frame-options content-security-policy permissions-policy cross-origin-opener-policy; do
  v="$(header "$BASE/" "$h")"
  if [ -n "$v" ]; then ok "header $h: $v"; else bad "header $h" "missing — check public/_headers (cloudflare) or public/.htaccess (sftp)"; fi
done

# 12. Scripts the build did not emit = injected by the platform (Cloudflare zone features such
#     as Bot Fight Mode's JavaScript Detections or the Web Analytics beacon). They cost
#     Lighthouse Best Practices points and contradict any "no trackers" claim on the site.
if [ -f dist/index.html ]; then
  expected="$(grep -o '<script' dist/index.html | wc -l | tr -d ' ')"
  n="$(printf '%s' "$home" | grep -o '<script' | wc -l | tr -d ' ')"
  if [ "$n" -le "$expected" ]; then ok "no injected scripts ($n script tags, build has $expected)"; else note "injected scripts" "$n <script> tags live vs $expected in dist/ — cloudflare: Security → Bots → JavaScript Detections; Analytics & Logs → Web Analytics"; fi
else
  note "injected scripts" "dist/ not built locally — run npm run build to compare script counts"
fi

# 13. External links on the homepage answer (LinkedIn returns 999 to non-browsers: accepted)
for u in $(printf '%s' "$home" | grep -o 'href="https://[^"]*' | sed 's/href="//;s/&amp;/\&/g' | grep -v "wa.me\|$HOST" | sort -u); do
  code="$(status -A 'Mozilla/5.0' "$u")"
  case "$code" in 2*|3*|999) ok "external link $u ($code)" ;; *) note "external link $u" "status $code" ;; esac
done

echo
echo "$pass ok, $warn warnings, $fail failed"
[ "$fail" -eq 0 ]
