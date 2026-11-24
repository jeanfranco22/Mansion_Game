(() => {
  if (window.__ctrlDiagInstalled) return console.info("[CTRL] Already installed");
  window.__ctrlDiagInstalled = true;

  const start = performance.now();
  const log = (...args) =>
    console.log(`[CTRL +${((performance.now() - start) / 1000).toFixed(3)}s]`, ...args);

  const status = () => window.controlState();
  const locked = () => Boolean(document.pointerLockElement);
  let next = null, pending = null, virtualTarget = null;
  let requestId = 0, desyncs = 0, staleResumes = 0, sawWD = false;
  const held = new Set();
  const dropKeyup = new Set();

  function snapshot(label) {
    if (![window.controlState, window.pointerLockedState, window.activeControls]
      .every(fn => typeof fn === "function")) {
      return log(label, "| game helpers unavailable");
    }
    const keys = window.activeControls();
    log(`${label} | ${status()} active controls ${keys.length} (${keys.join(", ")})`,
      `| storePointerLocked ${window.pointerLockedState()} | pointerLockElement ${locked()}`,
      `| desync ${desyncs} | stale resumes ${staleResumes} | W+D observed ${sawWD}`);
  }

  const nativeRequest = Element.prototype.requestPointerLock;
  const nativeExit = document.exitPointerLock.bind(document);
  const nativeLock = Object.getOwnPropertyDescriptor(Document.prototype, "pointerLockElement").get;
  Object.defineProperty(document, "pointerLockElement", {
    configurable: true,
    get: () => virtualTarget ?? nativeLock.call(document),
  });

  const lockEvent = type => document.dispatchEvent(new Event(type));
  document.exitPointerLock = function () {
    if (!virtualTarget) return nativeExit();
    virtualTarget = null;
    log("exitPointerLock (delayed lock cleared)");
    lockEvent("pointerlockchange");
  };

  Element.prototype.requestPointerLock = function (...args) {
    const id = ++requestId;
    const mode = next;
    next = null;
    log(`request ${id} requestPointerLock ${mode ?? "native"}`);
    if (mode === "rejected") {
      queueMicrotask(() => lockEvent("pointerlockerror"));
      setTimeout(() => {
        if (status() === "playing" && !locked()) desyncs++;
        snapshot(`after rejected request ${id}`);
      }, 80);
      return Promise.reject(new DOMException("Simulated lock rejection", "SecurityError"));
    }
    if (mode === "held") {
      return new Promise(resolve => { pending = { id, target: this, resolve }; });
    }
    return nativeRequest.apply(this, args);
  };

  function release() {
    if (!pending) return log("G: no held request");
    const { id, target, resolve } = pending;
    pending = null;
    const before = status();
    log(`release request ${id} | gameStatus ${before}`);
    virtualTarget = target;
    resolve();
    lockEvent("pointerlockchange");
    setTimeout(() => {
      if (before === "paused" && status() === "playing") staleResumes++;
      snapshot(`after release request ${id}`);
    }, 80);
  }

  window.addEventListener("keyup", e => {
    if (!e.isTrusted) return; // Let the game's synthetic reset reach KeyboardControls.
    held.delete(e.code);
    if (dropKeyup.delete(e.code)) {
      e.stopImmediatePropagation();
      log(`dropped trusted keyup ${e.code}`);
    }
  }, true);

  window.addEventListener("keydown", e => {
    if (!e.isTrusted || e.repeat || e.target?.matches?.("input, textarea")) return;
    switch (e.code) {
      case "KeyH": next = "rejected"; return log("next lock will be rejected");
      case "KeyL": next = "held"; return log("next lock will be held");
      case "KeyG": return release();
      case "KeyV": return snapshot("SUMMARY");
      case "KeyB":
        for (const code of held) dropKeyup.add(code);
        log("synthetic blur | held keys", [...held].join(", "));
        window.dispatchEvent(new Event("blur"));
        return;
    }
    held.add(e.code);
    if (e.code === "KeyW" || e.code === "KeyD") {
      setTimeout(() => {
        const keys = window.activeControls();
        if (!sawWD && status() === "playing" && keys.includes("forward") && keys.includes("right")) {
          sawWD = true;
          snapshot("multi-key active during playing");
        }
      }, 0);
    }
  });

  for (const [target, type] of [[window, "blur"], [document, "pointerlockchange"],
                                 [document, "pointerlockerror"]]) {
    target.addEventListener(type, () => setTimeout(() => snapshot(type), 20));
  }
  log("ready | B blur | H reject | L hold | G release | V summary");
})();