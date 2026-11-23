(() => {
  let release, request = 0, instance = 0, doorStarts = 0;
  const stamp = (...parts) => console.log(
    "AUDIO", Math.round(performance.now()), window.audioState(), ...parts);
  const heldFile = location.search.includes("holdAmbient")
    ? "/ambient-room.wav" : "/door-open.wav";
  const fetchFile = window.fetch.bind(window);
  window.fetch = async (url, options) => {
    if (String(url).endsWith(heldFile) && options?.method === "HEAD") {
      stamp("HOLD", heldFile, "HEAD");
      await new Promise(resolve => { release = resolve; });
    }
    return fetchFile(url, options);
  };
  const play = HTMLMediaElement.prototype.play;
  const ids = new WeakMap();
  HTMLMediaElement.prototype.play = function () {
    const name = this.src.split("/").pop();
    if (["door-open.wav", "ambient-room.wav"].includes(name) && !ids.has(this)) {
      const id = ++instance;
      ids.set(this, id);
      for (const event of ["playing", "pause", "ended"]) {
        this.addEventListener(event, () => {
          if (event === "playing" && name === "door-open.wav") doorStarts++;
          stamp(id, name, event, this.currentTime.toFixed(2));
        });
      }
    }
    return play.call(this);
  };
  window.addEventListener("keydown", e => {
    if (e.repeat) return;
    if (e.code === "KeyJ") {
      stamp("request", ++request, "doorOpen");
      window.audioDoor();
    }
    if (e.code === "KeyG" && release) {
      stamp("release HEAD");
      release();
      release = undefined;
    }
    if (e.code === "KeyV") {
      stamp("door starts", doorStarts);
      console.assert(doorStarts === 0, "Expired door cue started");
    }
  });
})();