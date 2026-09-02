// Shared helper for the scripts that drive the locally installed Chrome over the
// DevTools Protocol (screenshots.mjs, brand-assets.mjs). Zero dependencies: Node 22+
// ships fetch + WebSocket. Override the binary with CHROME=/path/to/chrome.
import { spawn } from 'node:child_process';

const CHROME_DEFAULTS = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  linux: 'google-chrome',
};
export const CHROME = process.env.CHROME ?? CHROME_DEFAULTS[process.platform] ?? 'google-chrome';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.listeners = [];
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id);
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
      } else if (m.method) for (const l of [...this.listeners]) l(m);
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => { this.pending.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  once(method) {
    return new Promise((res) => {
      const l = (m) => { if (m.method === method) { this.listeners = this.listeners.filter((x) => x !== l); res(m.params); } };
      this.listeners.push(l);
    });
  }
  /** Evaluate an expression in the page; `await` inside it is fine. Returns the JSON value. */
  async eval(expression) {
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (exceptionDetails) throw new Error(exceptionDetails.text ?? 'evaluation failed');
    return result.value;
  }
}

/** Start headless Chrome with a remote-debugging port. Returns { open, kill }. */
export async function launchChrome({ port = 9333, userDataDir }) {
  const chrome = spawn(
    CHROME,
    ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', `--user-data-dir=${userDataDir}`, `--remote-debugging-port=${port}`, 'about:blank'],
    { stdio: 'ignore' },
  );
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); up = r.ok; } catch {}
    if (!up) await sleep(250);
  }
  if (!up) { chrome.kill(); throw new Error(`Chrome did not start (${CHROME})`); }

  return {
    kill: () => chrome.kill(),
    /** Open a tab at `url` with an emulated viewport. Resolves after the load event. */
    async open(url, { width, height, mobile = false, scale = 1 } = {}) {
      const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
      const ws = new WebSocket(target.webSocketDebuggerUrl);
      await new Promise((r) => (ws.onopen = r));
      const cdp = new CDP(ws);
      await cdp.send('Page.enable');
      await cdp.send('Runtime.enable');
      if (width && height) await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile });
      if (mobile) await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
      const loaded = cdp.once('Page.loadEventFired');
      await cdp.send('Page.navigate', { url });
      await loaded;
      return {
        cdp,
        close: async () => { ws.close(); await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`); },
      };
    },
  };
}
