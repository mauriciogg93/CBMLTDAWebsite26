// Environment check for the machine where the assistant (or the developer) runs: the tools,
// access and configuration this repo needs to change the site and publish it. Zero
// dependencies, cross-platform (macOS, Windows, Linux). It modifies nothing and pushes
// nothing: the write-access check is a `git push --dry-run`.
//   npm run doctor
// Exit code 1 if any hard check fails; "warn" lines are things to look at, not blockers.
// Operation mode (AGENTS.md) runs it when a tool, an access or the publishing fails and
// pastes the output in the note for the developer; the R8 runbook in PLAN.md runs it on the
// owner's computer before the end-to-end test.
import { spawnSync } from 'node:child_process';
import { accessSync, constants, existsSync, lstatSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { homedir, release, tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHROME, launchChrome, sleep } from './lib/chrome.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '');
process.chdir(root);
const win = process.platform === 'win32';
const mac = process.platform === 'darwin';

let pass = 0, fail = 0, warn = 0;
const ok = (msg) => { console.log(`  ok    ${msg}`); pass++; };
const bad = (what, why) => { console.log(`  FAIL  ${what} — ${why}`); fail++; };
const note = (what, why) => { console.log(`  warn  ${what} — ${why}`); warn++; };
const section = (title) => console.log(`\n${title}`);

// Child processes: no interactive prompts (a missing credential must fail, not hang) and a
// timeout so a network call cannot stall the report.
const quietEnv = { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never', LC_ALL: 'C' };
function run(cmd, args, { timeout = 20_000 } = {}) {
  // Windows cannot spawn a .cmd/.bat shim (npm, and maybe agy) directly: go through cmd.exe.
  const shim = win && /\.(cmd|bat)$/i.test(cmd);
  const r = shim
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', `"${cmd}" ${args.join(' ')}`], { encoding: 'utf8', timeout, env: quietEnv, windowsHide: true, windowsVerbatimArguments: true })
    : spawnSync(cmd, args, { encoding: 'utf8', timeout, env: quietEnv, windowsHide: true });
  const out = (r.stdout ?? '').trim();
  const err = (r.stderr ?? '').trim();
  const timedOut = r.error?.code === 'ETIMEDOUT' || r.signal === 'SIGTERM';
  return { ok: r.status === 0 && !r.error, out, err, timedOut, missing: r.error?.code === 'ENOENT' };
}
const lastLine = (s) => s.split('\n').filter(Boolean).pop() ?? '';
const maskUrl = (u) => u.replace(/\/\/[^@/]+@/, '//***@');

// Find an executable on PATH (plus ~/.local/bin, where the launchers look for agy). No
// subprocess: `which` is not everywhere and `where` prints in the console code page.
function resolveCommand(name) {
  if (/[\\/]/.test(name)) return existsSync(name) ? name : null;
  const dirs = [join(homedir(), '.local', 'bin'), ...(process.env.PATH ?? '').split(delimiter)].filter(Boolean);
  const exts = win ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';').map((e) => e.toLowerCase()) : [];
  for (const dir of dirs) {
    const candidates = [name, ...exts.map((e) => name + e)];
    for (const c of candidates) {
      const p = join(dir, c);
      try { accessSync(p, constants.X_OK); if (!lstatSync(p).isDirectory()) return p; } catch {}
    }
  }
  return null;
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const versionOf = (s) => (s.match(/(\d+)\.(\d+)\.(\d+)/) ?? []).slice(1, 4).map(Number);
const atLeast = (v, min) => v[0] !== min[0] ? v[0] > min[0] : v[1] !== min[1] ? v[1] > min[1] : v[2] >= min[2];

console.log(`Doctor for ${root}`);
console.log(`${process.platform} ${release()} · ${win ? 'PowerShell/cmd' : process.env.SHELL ?? 'sh'}`);

// ---- 1. Tools --------------------------------------------------------------------------
section('Tools');

const node = versionOf(process.version);
const engines = versionOf(pkg.engines?.node ?? '22.12.0');
const brandMin = [22, 18, 0]; // brand-assets.mjs imports site.config.ts directly (type stripping)
const wanted = Number(readFileSync('.node-version', 'utf8').trim());
if (!atLeast(node, engines)) bad(`node ${process.version}`, `package.json requires >= ${engines.join('.')} — install Node ${wanted}`);
else if (!atLeast(node, brandMin)) note(`node ${process.version}`, `npm run brand needs >= ${brandMin.join('.')} — install Node ${wanted}`);
else if (node[0] !== wanted) note(`node ${process.version}`, `.node-version says ${wanted}: Workers Builds uses that major, keep the same one locally`);
else ok(`node ${process.version} (matches .node-version ${wanted})`);

const npmPath = resolveCommand('npm');
const npm = npmPath ? run(npmPath, ['--version']) : { ok: false };
if (npm.ok) ok(`npm ${npm.out}`); else bad('npm', 'not found — it ships with the Node installer');

const git = run('git', ['--version']);
if (git.ok) ok(git.out); else bad('git', win ? 'not found — install Git for Windows' : 'not found — install git');

if (win) {
  if (resolveCommand('bash')) ok('bash available (npm run verify needs it)');
  else note('bash not found', 'npm run verify runs from Git Bash; check, build and publishing do not need it');
}

const chromePath = resolveCommand(CHROME);
if (!chromePath) {
  note('Chrome not found', `looked for ${CHROME} — install Google Chrome or set CHROME=<path to the binary>; without it npm run shots and npm run brand do not work (check + build remain the gate)`);
} else {
  const udd = mkdtempSync(join(tmpdir(), 'cbm-doctor-'));
  try {
    const chrome = await launchChrome({ port: 9334, userDataDir: udd });
    try {
      const v = await (await fetch('http://127.0.0.1:9334/json/version')).json();
      ok(`Chrome starts headless (${v.Browser}, ${chromePath})`);
    } finally { chrome.kill(); }
  } catch (e) {
    note('Chrome does not start headless', `${e.message} — npm run shots and npm run brand will fail`);
  } finally {
    await sleep(300);
    try { rmSync(udd, { recursive: true, force: true }); } catch {}
  }
}

const agy = resolveCommand('agy');
const claude = resolveCommand('claude');
if (agy) {
  const v = run(agy, ['--version'], { timeout: 10_000 });
  ok(`agy ${v.ok ? lastLine(v.out) : '(version unknown)'} at ${agy}`);
}
if (claude) ok(`claude at ${claude}`);
if (!agy && !claude) note('no assistant CLI found', 'agy (Antigravity CLI) or claude (Claude Code); the launchers look in ~/.local/bin and PATH');

if (mac) {
  try { accessSync('asistente.command', constants.X_OK); ok('asistente.command is executable'); }
  catch { note('asistente.command is not executable', 'double click will not open it: chmod +x asistente.command'); }
}
if (win && !readFileSync('asistente.cmd', 'utf8').includes('\r\n')) {
  note('asistente.cmd has LF line endings', 'cmd.exe wants CRLF: delete asistente.cmd and run git checkout -- asistente.cmd (.gitattributes restores CRLF)');
}

// ---- 2. Repository ---------------------------------------------------------------------
section('Repository');

const inRepo = git.ok && run('git', ['rev-parse', '--is-inside-work-tree']).ok;
if (git.ok && !inRepo) bad('not a git repository', 'clone the repo instead of copying the folder');

const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
const missing = deps.filter((d) => !existsSync(join('node_modules', d, 'package.json')));
if (!existsSync('node_modules')) bad('node_modules missing', 'run npm install');
else if (missing.length) bad(`${missing.length} package(s) missing in node_modules`, `${missing.join(', ')} — run npm install`);
else ok(`node_modules has the ${deps.length} packages of package.json`);

try { await import('sharp'); ok('sharp loads (images in the build and shrink-image.mjs)'); }
catch (e) { bad('sharp does not load', `${lastLine(e.message)} — reinstall for this platform: delete node_modules and run npm install`); }

if (readFileSync('package-lock.json', 'utf8').includes('"node_modules/@emnapi/runtime"')) ok('package-lock.json keeps the @emnapi entries that npm ci needs on Linux');
else note('package-lock.json lost the @emnapi entries', 'Workers Builds (npm ci on Linux) will fail: delete node_modules and package-lock.json, npm install, validate with npm ci');

try {
  if (lstatSync('CLAUDE.md').isSymbolicLink()) ok('CLAUDE.md is a symlink to AGENTS.md');
  else if (readFileSync('CLAUDE.md', 'utf8').trim() === 'AGENTS.md') note('CLAUDE.md was checked out as a text file (core.symlinks off)', 'Claude Code will not load the rules; agy is unaffected. Fix: git config core.symlinks true (Windows: Developer Mode or an admin console), delete CLAUDE.md, git checkout -- CLAUDE.md');
  else ok('CLAUDE.md is a regular file with the rules');
} catch { bad('CLAUDE.md missing', 'git checkout -- CLAUDE.md'); }

if (inRepo) {
  const name = run('git', ['config', 'user.name']).out;
  const email = run('git', ['config', 'user.email']).out;
  if (name && email) ok(`git identity: ${name} <${email}>`);
  else bad('git identity not set', 'commits fail without it: git config --global user.name "…" and git config --global user.email "…"');

  const origin = run('git', ['remote', 'get-url', 'origin']);
  if (origin.ok) ok(`origin ${maskUrl(origin.out)}`); else bad('no origin remote', 'git remote add origin <url of the GitHub repo>');
  const helper = run('git', ['config', 'credential.helper']).out;
  if (origin.ok && origin.out.startsWith('https://') && !helper) note('no credential.helper for HTTPS', 'git will ask for a password on every push (Windows: Git Credential Manager comes with Git for Windows)');

  const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']).out;
  if (branch === 'main') ok('on branch main'); else note(`on branch ${branch || '(detached)'}`, 'operation mode publishes from main: git switch main');
  const dirty = run('git', ['status', '--porcelain']).out;
  if (!dirty) ok('working tree clean'); else note(`${dirty.split('\n').length} uncommitted change(s)`, 'a previous request may be half done: git status');
}

// ---- 3. Access -------------------------------------------------------------------------
section('Access');

async function reachable(url) {
  try { await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8_000), redirect: 'manual' }); return true; } catch { return false; }
}
if (await reachable('https://registry.npmjs.org/')) ok('registry.npmjs.org reachable (npm install)');
else note('registry.npmjs.org not reachable', 'npm install needs it; check, build and publishing do not');
if (await reachable('https://github.com/')) ok('github.com reachable (publishing)'); else bad('github.com not reachable', 'no internet or a proxy: nothing can be published');

if (inRepo) {
  const read = run('git', ['ls-remote', '--heads', 'origin', 'main']);
  if (read.ok && read.out) ok('read access to origin (main exists)');
  else if (read.timedOut) bad('read access to origin', 'no answer in 20 s — an interactive prompt (password, SSH passphrase) or no network');
  else bad('read access to origin', lastLine(read.err) || 'main not found on origin');

  const push = run('git', ['push', '--dry-run', 'origin', 'main']);
  if (push.ok) ok('write access to origin (git push --dry-run)');
  else if (push.timedOut) bad('write access to origin', 'no answer in 20 s — an interactive prompt (password, SSH passphrase) or no network');
  else if (/denied|permission|authentication|could not read username|403|401|publickey/i.test(push.err)) bad('write access to origin', `${lastLine(push.err)} — the owner as a collaborator with write access (HTTPS + Git Credential Manager on Windows) or this machine's SSH key as a deploy key with write access`);
  else if (/fetch first|non-fast-forward|rejected/i.test(push.err)) note('local main is behind origin', 'git pull --rebase origin main before publishing');
  else note('write access to origin unclear', lastLine(push.err) || lastLine(push.out));
}

// ---- 4. Ports --------------------------------------------------------------------------
section('Ports');
await new Promise((done) => {
  const server = createServer();
  server.once('error', () => { note('port 4321 in use', 'astro preview/dev will move to 4322: read the port from its output before taking screenshots'); done(); });
  server.listen(4321, '127.0.0.1', () => server.close(() => { ok('port 4321 free (astro preview / dev)'); done(); }));
});

console.log(`\n${pass} ok, ${warn} warnings, ${fail} failed`);
process.exit(fail ? 1 : 0);
