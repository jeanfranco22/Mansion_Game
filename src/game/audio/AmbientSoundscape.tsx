"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useGameStore } from "../store/useGameStore";

type AmbientEmitter = {
  baseGain: number;
  filterHz: number;
  frequency: number;
  position: Vector3;
};

type ActiveEmitter = AmbientEmitter & {
  gain: GainNode;
  oscillator: OscillatorNode;
  panner: StereoPannerNode;
};

const emitterDefinitions: AmbientEmitter[] = [
  {
    baseGain: 0.018,
    filterHz: 190,
    frequency: 51,
    position: new Vector3(-7, 1.2, -6),
  },
  {
    baseGain: 0.012,
    filterHz: 120,
    frequency: 37,
    position: new Vector3(0, 1.8, 5.8),
  },
  {
    baseGain: 0.016,
    filterHz: 260,
    frequency: 64,
    position: new Vector3(2.6, 1.1, -18.4),
  },
];

const cameraPosition = new Vector3();

export function AmbientSoundscape() {
  const { camera } = useThree();
  const pointerLocked = useGameStore((state) => state.pointerLocked);
  const gameCompleted = useGameStore((state) => state.progression.gameCompleted);
  const audioContextRef = useRef<AudioContext | null>(null);
  const emittersRef = useRef<ActiveEmitter[]>([]);

  useEffect(() => {
    if (!pointerLocked || gameCompleted || audioContextRef.current) {
      return;
    }

    const AudioContextClass =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const emitters = emitterDefinitions.map((definition) => {
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      const panner = context.createStereoPanner();

      oscillator.type = "sine";
      oscillator.frequency.value = definition.frequency;
      filter.type = "lowpass";
      filter.frequency.value = definition.filterHz;
      gain.gain.value = 0;

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(context.destination);
      oscillator.start();

      return { ...definition, gain, oscillator, panner };
    });

    audioContextRef.current = context;
    emittersRef.current = emitters;

    return () => {
      for (const emitter of emitters) {
        emitter.oscillator.stop();
        emitter.oscillator.disconnect();
      }
      void context.close();
      emittersRef.current = [];
      audioContextRef.current = null;
    };
  }, [gameCompleted, pointerLocked]);

  useFrame((state) => {
    const context = audioContextRef.current;

    if (!context) {
      return;
    }

    camera.getWorldPosition(cameraPosition);

    for (const emitter of emittersRef.current) {
      const distance = cameraPosition.distanceTo(emitter.position);
      const attenuation = Math.max(0, 1 - distance / 10);
      const flutter = 0.75 + Math.sin(state.clock.elapsedTime * 0.7 + distance) * 0.25;
      const pan = Math.max(-1, Math.min(1, (emitter.position.x - cameraPosition.x) / 6));

      emitter.gain.gain.setTargetAtTime(
        emitter.baseGain * attenuation * flutter,
        context.currentTime,
        0.08,
      );
      emitter.panner.pan.setTargetAtTime(pan, context.currentTime, 0.08);
    }
  });

  return null;
}
