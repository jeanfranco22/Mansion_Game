"use client";

import { createContext, createElement, useContext, type ReactNode } from "react";

const DebugModeContext = createContext(false);

type DebugModeProviderProps = {
  children: ReactNode;
  enabled: boolean;
};

export function DebugModeProvider({
  children,
  enabled,
}: DebugModeProviderProps) {
  return createElement(
    DebugModeContext.Provider,
    { value: enabled },
    children,
  );
}

export function useDebugMode() {
  return useContext(DebugModeContext);
}
