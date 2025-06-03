import { create } from 'zustand';

interface GlobalState {
  isChatwindow: "allowed" | "idle" | "blocked" | "loading";
  changeChatWindow: (value: "allowed" | "idle" | "blocked" | "loading") => void;
  requestedFileId: string | null;
  changeRequestedFile: (value: string | null) => void;
  isClean : false | true ;
  setClean : (value : boolean) => void
}



export const useGlobalStore = create<GlobalState>((set) => ({
  isChatwindow: "idle", // default value
  changeChatWindow: (value) => set({ isChatwindow: value }),
  requestedFileId: null,
  changeRequestedFile: (value) => set({ requestedFileId: value }),
  isClean : true ,
  setClean :  (value) => set({ isClean: value }),
}));