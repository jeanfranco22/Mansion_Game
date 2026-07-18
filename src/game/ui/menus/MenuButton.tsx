"use client";

import type { ReactNode } from "react";

type MenuButtonProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
};

export function MenuButton({
  children,
  onClick,
  variant = "secondary",
}: MenuButtonProps) {
  const variantClass =
    variant === "primary"
      ? "border-amber-200/50 bg-amber-200 text-zinc-950 hover:bg-amber-100"
      : variant === "danger"
        ? "border-red-300/35 bg-red-950/35 text-red-100 hover:bg-red-900/65"
        : "border-zinc-100/20 bg-zinc-950/55 text-zinc-100 hover:bg-zinc-100/12";

  return (
    <button
      className={`w-full border px-4 py-3 text-left text-sm outline-none transition duration-150 hover:translate-x-0.5 active:translate-x-0 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-amber-100/55 ${variantClass}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
