"use client";

import { useEffect, useState } from "react";
import type { GraphicsQuality } from "../../store/gameStoreTypes";
import { useGameStore } from "../../store/useGameStore";
import { setFullscreenMode } from "../browserControls";
import { MenuButton } from "./MenuButton";

function SettingRange({
  label,
  max = 1,
  min = 0,
  onChange,
  step = 0.05,
  value,
}: {
  label: string;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-zinc-400">
        <span>{label}</span>
        <span className="text-zinc-200">{Math.round(value * 100)}%</span>
      </div>
      <input
        className="w-full accent-amber-200"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

function SettingSelect({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (quality: GraphicsQuality) => void;
  value: GraphicsQuality;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </div>
      <select
        className="w-full border border-zinc-100/15 bg-black/45 px-3 py-3 text-sm text-zinc-100 outline-none transition hover:border-amber-100/35 focus:border-amber-100/60"
        onChange={(event) => onChange(event.target.value as GraphicsQuality)}
        value={value}
      >
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>
    </label>
  );
}

export function SettingsMenu() {
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const closeSettings = useGameStore((state) => state.closeSettings);
  const [fullscreenActive, setFullscreenActive] = useState(false);

  useEffect(() => {
    const updateFullscreenActive = () =>
      setFullscreenActive(Boolean(document.fullscreenElement));

    updateFullscreenActive();
    document.addEventListener("fullscreenchange", updateFullscreenActive);

    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreenActive);
  }, []);

  async function handleFullscreenToggle() {
    const fullscreen = !fullscreenActive;

    updateSettings({ fullscreen });
    await setFullscreenMode(fullscreen).catch(() =>
      updateSettings({ fullscreen: false }),
    );
  }

  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center overflow-y-auto bg-black/72 p-4 backdrop-blur-sm">
      <section className="w-full max-w-xl border border-zinc-100/15 bg-zinc-950/88 p-5 shadow-2xl transition">
        <div className="mb-5">
          <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">
            Ajustes
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
            Sensación y rendimiento
          </h2>
        </div>

        <div className="space-y-5">
          <SettingRange
            label="Sensibilidad del mouse"
            max={1.8}
            min={0.45}
            onChange={(mouseSensitivity) => updateSettings({ mouseSensitivity })}
            step={0.05}
            value={settings.mouseSensitivity}
          />
          <SettingRange
            label="Volumen general"
            onChange={(masterVolume) => updateSettings({ masterVolume })}
            value={settings.masterVolume}
          />
          <SettingRange
            label="Música"
            onChange={(musicVolume) => updateSettings({ musicVolume })}
            value={settings.musicVolume}
          />
          <SettingRange
            label="Efectos"
            onChange={(sfxVolume) => updateSettings({ sfxVolume })}
            value={settings.sfxVolume}
          />

          <SettingSelect
            label="Calidad gráfica"
            onChange={(graphicsQuality) => updateSettings({ graphicsQuality })}
            value={settings.graphicsQuality}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <MenuButton onClick={() => void handleFullscreenToggle()}>
            {fullscreenActive ? "Salir de pantalla completa" : "Pantalla completa"}
          </MenuButton>
          <MenuButton onClick={closeSettings} variant="primary">
            Volver
          </MenuButton>
        </div>
      </section>
    </div>
  );
}
