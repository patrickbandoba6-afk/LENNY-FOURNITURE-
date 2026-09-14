import { create } from "zustand";
import type { ChildProfile } from "@/types";

interface ChildState {
  children: ChildProfile[];
  activeChildId: string | null;
  setChildren: (children: ChildProfile[]) => void;
  setActiveChild: (id: string) => void;
  activeChild: () => ChildProfile | null;
}

export const useChildStore = create<ChildState>((set, get) => ({
  children: [],
  activeChildId: null,
  setChildren: (children) =>
    set({
      children,
      activeChildId: children[0]?.id ?? null,
    }),
  setActiveChild: (id) => set({ activeChildId: id }),
  activeChild: () =>
    get().children.find((c) => c.id === get().activeChildId) ?? null,
}));
