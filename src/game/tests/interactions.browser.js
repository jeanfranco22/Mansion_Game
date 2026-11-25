(() => {
  if (window.__interactDiagInstalled) return console.info("[INTERACT] Already installed");
  window.__interactDiagInstalled = true;
 
  const start = performance.now();
  const log = (...args) =>
    console.log(`[INTERACT +${((performance.now() - start) / 1000).toFixed(3)}s]`, ...args);
 
  let repeatTriggers = 0;
  let stalePrompts = 0;
  let throughWallHits = 0;
  let doorLeaks = 0;
  let sequentialOk = false;
  let lastManualTarget = null;
  let lastManualTime = 0;
 
  const fmtHit = (h) => (h ? `${h.id}@${h.dist}m` : "none");
 
  function snap(label, extra = "") {
    if (typeof window.interactionState !== "function") {
      log(label, "| interaction helpers unavailable");
      return null;
    }
    const s = window.interactionState();
    log(
      `${label} | hovered=${s.hoveredId ?? "null"} | prompt=${s.prompt ? "YES" : "null"}`,
      `| sceneHit=${fmtHit(s.nearestSceneHit)} | intHit=${fmtHit(s.nearestInteractiveHit)}`,
      `| studyClosed=${s.studyDoorClosed} | room1Open=${s.room1Open} | collected=${s.collectedCount}`,
      extra,
    );
    return s;
  }
 
  function fireKey(type, repeat = false) {
    window.dispatchEvent(new KeyboardEvent(type, { code: "KeyE", key: "e", repeat }));
  }
 
  function unlockTargets() {
    const ctx = window.interactionScene?.();
    if (!ctx) return log("U: interactionScene unavailable");
    const st = ctx.store.getState();
    st.unlockStudyDoor();
    st.releaseStorageLatch();
    st.openStorage();
    st.setRoomLocked("room1", false);
    st.readStoryNote("note1");
    st.readStoryNote("note2");
    st.readStoryNote("note3");
    log("U: unlocked study-door, storage-door, room1, and spawned main-key");
  }
 
  function testHoldRepeat() {
    const before = snap("R start");
    if (!before?.hoveredId) return log("R: aim at study-door or an item first");
    const target = before.hoveredId;
    fireKey("keydown", false);
    let prev = snap(`R keydown repeat=false (${target})`);
    const afterInitial = prev;
    if (afterInitial.collectedCount > before.collectedCount && afterInitial.hoveredId === target) {
      stalePrompts += 1;
      log(`STALE PROMPT after collect | hovered=${afterInitial.hoveredId} | stalePrompts=${stalePrompts}`);
    }
    [30, 60, 90].forEach((delay, idx) => {
      setTimeout(() => {
        fireKey("keydown", true);
        const cur = snap(`R keydown repeat=true #${idx + 1} (${target})`);
        if (
          cur.studyDoorClosed !== prev.studyDoorClosed ||
          cur.room1Open !== prev.room1Open ||
          cur.collectedCount !== prev.collectedCount
        ) {
          repeatTriggers += 1;
          log(`REPEAT TRIGGER DETECTED | repeatTriggers=${repeatTriggers}`);
        }
        prev = cur;
      }, delay);
    });
    setTimeout(() => {
      fireKey("keyup", false);
      snap("R done", `| repeatTriggers=${repeatTriggers} | stalePrompts=${stalePrompts}`);
    }, 125);
  }
 
  function testOcclusion() {
    const before = snap("O check");
    if (!before) return;
    const occluded =
      before.nearestSceneHit?.id === "wall" &&
      before.nearestInteractiveHit &&
      before.nearestSceneHit.dist < before.nearestInteractiveHit.dist;
    if (!occluded) {
      return log("O: aim at the solid corridor wall just left of study-door");
    }
    fireKey("keydown", false);
    fireKey("keyup", false);
    const after = snap("O after KeyE");
    const doorChanged =
      after.studyDoorClosed !== before.studyDoorClosed || after.room1Open !== before.room1Open;
    if (before.hoveredId || doorChanged) {
      throughWallHits += 1;
      log(
        `THROUGH-WALL HIT DETECTED | wall=${fmtHit(before.nearestSceneHit)}`,
        `occluded=${fmtHit(before.nearestInteractiveHit)} | doorChanged=${doorChanged}`,
        `| throughWallHits=${throughWallHits}`,
      );
    } else {
      log(
        `OCCLUSION OK | wall=${fmtHit(before.nearestSceneHit)} blocked`,
        `${fmtHit(before.nearestInteractiveHit)} | hovered=null | doorChanged=false | throughWallHits=${throughWallHits}`,
      );
    }
  }
 
  function testItemInFrontOfDoor() {
    const ctx = window.interactionScene?.();
    const before = snap("L check");
    if (!ctx || before?.hoveredId !== "study-door") {
      return log("L: aim directly at study-door first (press U if locked)");
    }
    let keyGroup = null;
    ctx.scene.traverse((obj) => {
      if (obj.userData?.interactionId === "main-key") keyGroup = obj;
    });
    if (!keyGroup) {
      return log("L: main-key not found (press U or reload page if already collected)");
    }
    const pos = ctx.camera.position.clone();
    const dir = ctx.camera.position.clone();
    ctx.camera.getWorldDirection(dir);
    const target = pos.addScaledVector(dir, 0.95);
    keyGroup.position.set(target.x - 0.24, target.y, target.z);
    keyGroup.updateMatrixWorld(true);
    log("L: staged main-key 0.95m directly in front of study-door");
 
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const staged = snap("L staged");
        if (staged.hoveredId !== "main-key") {
          return log("L: crosshair did not lock onto main-key, try standing 1.5m from study-door");
        }
        const doorBefore = staged.studyDoorClosed;
        const countBefore = staged.collectedCount;
 
        // 1. Initial press collects main-key
        fireKey("keydown", false);
        const syncAfter = snap("L sync after press (before unmount)");
        if (syncAfter.hoveredId === "main-key" || syncAfter.prompt !== null) {
          stalePrompts += 1;
          log(`STALE PROMPT DETECTED before unmount | hovered=${syncAfter.hoveredId} | stalePrompts=${stalePrompts}`);
        } else {
          log(`PROMPT CLEARED immediately | hovered=null | prompt=null | stalePrompts=${stalePrompts}`);
        }
 
        // 2. Same-frame repeat while item is unmounting
        fireKey("keydown", true);
 
        // 3. Next frame after React unmounts main-key, study-door is exposed while E is still held
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            snap("L after unmount (door exposed)");
            fireKey("keydown", true);
            fireKey("keyup", false);
            const afterLeak = snap("L after held repeat");
            if (afterLeak.studyDoorClosed !== doorBefore) {
              doorLeaks += 1;
              log(`DOOR LEAK DETECTED | held E toggled study-door behind item | doorLeaks=${doorLeaks}`);
            } else {
              log(`NO DOOR LEAK | study-door stayed studyClosed=${afterLeak.studyDoorClosed} | doorLeaks=${doorLeaks}`);
            }
            log(`L collected delta=${afterLeak.collectedCount - countBefore}`);
          }),
        );
      }),
    );
  }
 
  window.addEventListener("keydown", (e) => {
    if (!e.isTrusted || e.repeat || e.target?.matches?.("input, textarea")) return;
    if (e.code === "KeyU") return unlockTargets();
    if (e.code === "KeyR") return testHoldRepeat();
    if (e.code === "KeyO") return testOcclusion();
    if (e.code === "KeyL") return testItemInFrontOfDoor();
    if (e.code === "KeyV") {
      return snap(
        "SUMMARY",
        `| repeatTriggers=${repeatTriggers} | stalePrompts=${stalePrompts} | throughWallHits=${throughWallHits} | doorLeaks=${doorLeaks} | sequentialOk=${sequentialOk}`,
      );
    }
    if (e.code === "KeyE") {
      const before = window.interactionState?.();
      if (!before?.hoveredId) return;
      const target = before.hoveredId;
      const now = performance.now();
      setTimeout(() => {
        const after = snap(`MANUAL KeyE (${target})`);
        const changed =
          after &&
          (after.studyDoorClosed !== before.studyDoorClosed ||
            after.room1Open !== before.room1Open ||
            after.collectedCount !== before.collectedCount);
        if (changed) {
          if (lastManualTarget && lastManualTarget !== target && now - lastManualTime < 2500) {
            sequentialOk = true;
            log(`SEQUENTIAL OK | ${lastManualTarget} -> ${target} in ${Math.round(now - lastManualTime)}ms`);
          }
          lastManualTarget = target;
          lastManualTime = now;
        }
      }, 0);
    }
  });
 
  log("ready | U unlock | R hold-repeat | O occlusion | L item-in-front-of-door | V summary");
})();
