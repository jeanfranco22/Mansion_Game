"use client";

import { useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { triggerInteraction } from "../../interactions/interactionRegistry";
import { useGameStore } from "../../store/useGameStore";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";

type JoystickProps = {
  label: string;
  onChange: (x: number, y: number) => void;
  onRelease: () => void;
};

function Joystick({ label, onChange, onRelease }: JoystickProps) {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const valueRef = useRef({ x: 0, y: 0 });

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const radius = rect.width / 2;
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;
    const length = Math.min(1, Math.hypot(x, y) / radius);
    const angle = Math.atan2(y, x);
    const normalizedX = Math.cos(angle) * length;
    const normalizedY = Math.sin(angle) * length;

    if (
      Math.abs(valueRef.current.x - normalizedX) < 0.025 &&
      Math.abs(valueRef.current.y - normalizedY) < 0.025
    ) {
      return;
    }

    valueRef.current = { x: normalizedX, y: normalizedY };
    setKnob({ x: normalizedX, y: normalizedY });
    onChange(normalizedX, normalizedY);
  }

  function release() {
    valueRef.current = { x: 0, y: 0 };
    setKnob({ x: 0, y: 0 });
    onRelease();
  }

  return (
    <div
      aria-label={label}
      className="relative h-24 w-24 rounded-full border border-zinc-100/20 bg-black/35 shadow-xl backdrop-blur touch-none sm:h-28 sm:w-28"
      onPointerCancel={release}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        updatePointer(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          updatePointer(event);
        }
      }}
      onPointerUp={release}
      role="application"
    >
      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/35 bg-amber-100/15" />
      <div
        className="absolute left-1/2 top-1/2 h-10 w-10 rounded-full bg-zinc-100/75 shadow-lg transition-transform duration-75 sm:h-11 sm:w-11"
        style={{
          transform: `translate(calc(-50% + ${knob.x * 34}px), calc(-50% + ${knob.y * 34}px))`,
        }}
      />
    </div>
  );
}

function TouchButton({
  children,
  onClick,
  onPointerDown,
  onPointerUp,
}: {
  children: ReactNode;
  onClick?: () => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}) {
  return (
    <button
      className="h-12 min-w-12 border border-zinc-100/20 bg-black/45 px-3 text-xs font-medium text-zinc-100 shadow-lg backdrop-blur transition active:scale-95 active:bg-amber-200/25 sm:h-14 sm:min-w-14 sm:px-4 sm:text-sm"
      onClick={onClick}
      onPointerCancel={onPointerUp}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      type="button"
    >
      {children}
    </button>
  );
}

export function MobileControls() {
  const isTouch = useIsTouchDevice();
  const gameStatus = useGameStore((state) => state.gameStatus);
  const documentContent = useGameStore((state) => state.documentContent);
  const activeInteractionId = useGameStore(
    (state) => state.interaction.activeInteractionId,
  );
  const setMobileMove = useGameStore((state) => state.setMobileMove);
  const setMobileLook = useGameStore((state) => state.setMobileLook);
  const setMobileSprint = useGameStore((state) => state.setMobileSprint);
  const resetMobileInput = useGameStore((state) => state.resetMobileInput);
  const toggleFlashlight = useGameStore((state) => state.toggleFlashlight);
  const pauseGame = useGameStore((state) => state.pauseGame);

  if (!isTouch || gameStatus !== "playing" || documentContent) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      <div className="pointer-events-auto absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))]">
        <Joystick
          label="Mover"
          onChange={(x, y) => setMobileMove(x, -y)}
          onRelease={() => setMobileMove(0, 0)}
        />
      </div>
      <div className="pointer-events-auto absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]">
        <Joystick
          label="Mirar"
          onChange={(x, y) => setMobileLook(x, y)}
          onRelease={() => setMobileLook(0, 0)}
        />
      </div>
      <div className="pointer-events-auto absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] flex gap-2">
        <TouchButton onClick={pauseGame}>Pausa</TouchButton>
        <TouchButton onClick={toggleFlashlight}>Luz</TouchButton>
      </div>
      <div className="pointer-events-auto absolute bottom-[calc(max(1rem,env(safe-area-inset-bottom))+6.75rem)] right-[max(1rem,env(safe-area-inset-right))] flex gap-2 sm:bottom-[calc(max(1rem,env(safe-area-inset-bottom))+8rem)]">
        <TouchButton
          onPointerDown={() => setMobileSprint(true)}
          onPointerUp={() => setMobileSprint(false)}
        >
          Correr
        </TouchButton>
        <TouchButton onClick={() => triggerInteraction(activeInteractionId)}>
          Usar
        </TouchButton>
      </div>
      <button
        className="pointer-events-auto absolute left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] border border-zinc-100/15 bg-black/40 px-3 py-2 text-xs text-zinc-200 backdrop-blur transition active:scale-95"
        onClick={resetMobileInput}
        type="button"
      >
        Reiniciar toque
      </button>
    </div>
  );
}
