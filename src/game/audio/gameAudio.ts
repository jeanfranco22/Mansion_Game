import { Instances } from "@react-three/drei";
import { audioFiles, type GameSound } from "./audioFiles";

const missingFiles = new Set<GameSound>();
const cache = new Map<GameSound, HTMLAudioElement>();
const availabilityChecks = new Map<GameSound, Promise<boolean>>();
const liveEffects = new Set<HTMLAudioElement>()

let effectsEnabled = true;
let effectEpoch = 0;
let ambientEpoch = 0

const audioMix = {
  masterVolume: 0.85,
  musicVolume: 0,
  sfxVolume: 0.85,
};

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

  const cachedAfterLoad = cache.get(sound)

  if(cachedAfterLoad){
    return cachedAfterLoad
  }

  const audio = new Audio(audioFiles[sound]);
  audio.preload = "auto";
  audio.addEventListener("error", () => missingFiles.add(sound), {
    once: true,
  });
  cache.set(sound, audio);
  return audio;
}

function stopLiveEffects(){
  effectEpoch += 1

  for ( const instance of liveEffects){
    instance.pause()
  }
  liveEffects.clear()
}

export function setEffectsEnabled(enabled: boolean){
  if(effectsEnabled === enabled) return;

  effectsEnabled = enabled

  if(!enabled){
    stopLiveEffects()
  }
}

export function playGameSound(sound: GameSound, volume = 0.45) {
  if(!effectsEnabled) return

  const requestEpoch = effectEpoch


  void createAudio(sound).then((audio) => {
    if (!audio || missingFiles.has(sound) || !effectsEnabled || requestEpoch !== effectEpoch) {
      return;
    }

    const instance = audio.cloneNode(true) as HTMLAudioElement;
    instance.volume = Math.min(1, volume * audioMix.masterVolume * 
    audioMix.sfxVolume);

    liveEffects.add(instance)


    instance.addEventListener(
      "ended",
      () => {
        liveEffects.delete(instance)
        instance.removeAttribute("src");
        instance.load();
      },
      { once: true },
    );

    instance.addEventListener("error", () => liveEffects.delete(instance), {
      once: true
    })


    void instance.play().catch(() => liveEffects.delete(instance));
  });
}

export function startAmbient() {
  const requestEpoch = ambientEpoch

  void createAudio("ambient").then((ambient) => {
    if (!ambient || missingFiles.has("ambient") || requestEpoch !== ambientEpoch || !ambient.paused) {
      return;
    }

    ambient.loop = true;
    ambient.volume = 0.18 * audioMix.masterVolume * audioMix.musicVolume;
    void ambient.play().catch(() => undefined);
  });
}

export function setAudioMix(settings: {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
}) {
  audioMix.masterVolume = settings.masterVolume;
  audioMix.musicVolume = settings.musicVolume;
  audioMix.sfxVolume = settings.sfxVolume;

  const ambient = cache.get("ambient");

  if (ambient) {
    ambient.volume = 0.18 * audioMix.masterVolume * audioMix.musicVolume;
  }
}

export function stopAmbient() {
  ambientEpoch += 1


  const ambient = cache.get("ambient");

  if (!ambient) return;
  

  ambient.pause();
  ambient.currentTime = 0;
}

export function stopAllAudio() {
  stopLiveEffects()
  ambientEpoch += 1


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
