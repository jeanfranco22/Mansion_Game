"use client";

import { useGameStore } from "../../store/useGameStore";
import { activateGameView } from "../browserControls";
import { MenuButton } from "./MenuButton";
import { SettingsMenu } from "./SettingsMenu";

export function GameMenus() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const startGame = useGameStore((state) => state.startGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const restartGame = useGameStore((state) => state.restartGame);
  const openSettings = useGameStore((state) => state.openSettings);

  if (gameStatus === "settings") {
    return <SettingsMenu />;
  }

  if (gameStatus === "playing") {
    return null;
  }

  if (gameStatus === "victory") {
    return (
      <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/82 p-5 text-center backdrop-blur-sm">
        <section className="max-w-xl border border-zinc-100/15 bg-zinc-950/80 p-6 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-amber-200/80">
            Vale House
          </div>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-100">
            You escaped the mansion
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            The first section is complete. The house is quiet again, but the
            lower rooms are still awake.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <MenuButton
              onClick={() => {
                restartGame();
                activateGameView();
              }}
              variant="primary"
            >
              Restart chapter
            </MenuButton>
            <MenuButton onClick={openSettings}>Settings</MenuButton>
          </div>
        </section>
      </div>
    );
  }

  if (gameStatus === "paused") {
    return (
      <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/62 p-5 backdrop-blur-sm">
        <section className="w-full max-w-md border border-zinc-100/15 bg-zinc-950/88 p-5 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.22em] text-amber-200/80">
            Paused
          </div>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-100">
            Vale House
          </h2>
          <div className="mt-6 space-y-3">
            <MenuButton
              onClick={() => {
                resumeGame();
                activateGameView();
              }}
              variant="primary"
            >
              Resume
            </MenuButton>
            <MenuButton onClick={openSettings}>Settings</MenuButton>
            <MenuButton
              onClick={() => {
                restartGame();
                activateGameView();
              }}
              variant="danger"
            >
              Restart chapter
            </MenuButton>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center bg-black/35 p-5 backdrop-blur-[1px]">
      <section className="ml-0 w-full max-w-xl border border-zinc-100/15 bg-zinc-950/78 p-6 shadow-2xl md:ml-12">
        <div className="text-xs uppercase tracking-[0.24em] text-amber-200/80">
          Escape Room Chapter One
        </div>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-100 md:text-5xl">
          Vale House
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-zinc-300">
          Explore the mansion, restore power, solve the house mechanisms, and
          escape the first wing.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <MenuButton
            onClick={() => {
              startGame();
              activateGameView();
            }}
            variant="primary"
          >
            Start chapter
          </MenuButton>
          <MenuButton onClick={openSettings}>Settings</MenuButton>
        </div>
      </section>
    </div>
  );
}
