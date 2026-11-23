"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform } from "@/data/products";
import { browserStorage } from "./cart";

interface ConsoleState {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
}

/**
 * Console escolhido pelo visitante (PS4 ou PS5). Vale para o site
 * inteiro: todos os preços seguem essa escolha, e ela fica salva.
 */
export const useConsole = create<ConsoleState>()(
  persist(
    (set) => ({
      platform: "ps5",
      setPlatform: (platform) => set({ platform }),
    }),
    {
      name: "freitas-modder-console",
      storage: browserStorage,
      skipHydration: true,
    },
  ),
);
