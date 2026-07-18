"use client";

import { useGameStore } from "../../store/useGameStore";
import { prepareGameViewFromUserAction } from "../browserControls";
import { MenuButton } from "./MenuButton";
import { SettingsMenu } from "./SettingsMenu";

export function GameMenus() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const loading = useGameStore((state) => state.loading);
  const startGame = useGameStore((state) => state.startGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const restartGame = useGameStore((state) => state.restartGame);
  const openSettings = useGameStore((state) => state.openSettings);
  const enterGame = (action: () => void) => {
    action();
    prepareGameViewFromUserAction();
  };

  if (gameStatus === "settings") {
    return <SettingsMenu />;
  }

  if (gameStatus === "loading") {
    return (
      <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black p-5 text-center">
        <section className="w-full max-w-md border border-zinc-100/15 bg-zinc-950/88 p-5 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-amber-200/80">
            Vale House
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-100">
            {loading.fatalError ? "No se pudo iniciar" : "Cargando"}
          </h1>
          {loading.fatalError ? (
            <p className="mt-4 text-sm leading-6 text-red-100">
              {loading.fatalError}
            </p>
          ) : (
            <div className="mt-6 h-2 overflow-hidden border border-zinc-100/15 bg-zinc-900">
              <div
                className="h-full bg-amber-200 transition-[width] duration-300"
                style={{
                  width: `${
                    ([
                      loading.assetsReady,
                      loading.playerReady,
                      loading.rendererReady,
                      loading.settingsHydrated,
                      loading.worldReady,
                    ].filter(Boolean).length /
                      5) *
                    100
                  }%`,
                }}
              />
            </div>
          )}
          {!loading.fatalError && loading.assetErrors > 0 ? (
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Algunos recursos opcionales no se cargaron. El capítulo
              continuará con los recursos disponibles.
            </p>
          ) : null}
        </section>
      </div>
    );
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
            Escapaste de la mansión
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            El primer capítulo está completo. La casa vuelve a guardar silencio.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <MenuButton
              onClick={() => enterGame(restartGame)}
              variant="primary"
            >
              Reiniciar capítulo
            </MenuButton>
            <MenuButton onClick={openSettings}>Ajustes</MenuButton>
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
            Pausa
          </div>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-100">
            Vale House
          </h2>
          <div className="mt-6 space-y-3">
            <MenuButton
              onClick={() => enterGame(resumeGame)}
              variant="primary"
            >
              Continuar
            </MenuButton>
            <MenuButton onClick={openSettings}>Ajustes</MenuButton>
            <MenuButton
              onClick={() => enterGame(restartGame)}
              variant="danger"
            >
              Reiniciar capítulo
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
          Primer capítulo
        </div>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-100 md:text-5xl">
          Vale House
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-zinc-300">
          Explora la mansión, sigue las notas y encuentra la llave de la
          primera habitación.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <MenuButton
            onClick={() => enterGame(startGame)}
            variant="primary"
          >
            Iniciar capítulo
          </MenuButton>
          <MenuButton onClick={openSettings}>Ajustes</MenuButton>
        </div>
      </section>
    </div>
  );
}
