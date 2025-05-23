import { create } from 'zustand';

interface GlobalState {
  isChatwindow: "allowed" | "idle" | "blocked" | "loading";
  changeChatWindow: (value: "allowed" | "idle" | "blocked" |  "loading") => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isChatwindow: "idle", // default value
  changeChatWindow: (value) => set({ isChatwindow: value }),
}));