import { audioFiles, type GameSound } from "./audioFiles";

const missingFiles = new Set<GameSound>();
const cache = new Map<GameSound, HTMLAudioElement>();
const availabilityChecks = new Map<GameSound, Promise<boolean>>();

function canUseAudio() {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

async function canLoadFile(sound: GameSound) {
  if (missingFiles.has(sound)) {
    return false;
  }

  const existing = availabilityChecks.get(sound);

  if (existing) {
    return existing;
  }

  const check = fetch(audioFiles[sound], { method: "HEAD" })
    .then((response) => {
      if (!response.ok) {
        missingFiles.add(sound);
        return false;
      }

      return true;
    })
    .catch(() => {
      missingFiles.add(sound);
      return false;
    });

  availabilityChecks.set(sound, check);
  return check;
}

async function createAudio(sound: GameSound) {
  if (!canUseAudio() || missingFiles.has(sound)) {
    return null;
  }

  const existing = cache.get(sound);

  if (existing) {
    return existing;
  }

  const available = await canLoadFile(sound);

  if (!available) {
    return null;
  }

  const audio = new Audio(audioFiles[sound]);
  audio.preload = "auto";
  audio.addEventListener("error", () => missingFiles.add(sound), {
    once: true,
  });
  cache.set(sound, audio);
  return audio;
}

export function playGameSound(sound: GameSound, volume = 0.45) {
  void createAudio(sound).then((audio) => {
    if (!audio || missingFiles.has(sound)) {
      return;
    }

    const instance = audio.cloneNode(true) as HTMLAudioElement;
    instance.volume = volume;
    void instance.play().catch(() => undefined);
  });
}

export function startAmbient() {
  void createAudio("ambient").then((ambient) => {
    if (!ambient || missingFiles.has("ambient")) {
      return;
    }

    ambient.loop = true;
    ambient.volume = 0.18;
    void ambient.play().catch(() => undefined);
  });
}

export function stopAmbient() {
  const ambient = cache.get("ambient");

  if (!ambient) {
    return;
  }

  ambient.pause();
  ambient.currentTime = 0;
}

export function stopAllAudio() {
  for (const audio of cache.values()) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export function getMissingAudioFiles() {
  return Object.entries(audioFiles)
    .filter(([sound]) => missingFiles.has(sound as GameSound))
    .map(([, path]) => path);
}
