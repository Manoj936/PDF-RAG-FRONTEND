import { create } from 'zustand';

interface GlobalState {
  isChatwindow: "allowed" | "idle" | "blocked" | "loading";
  changeChatWindow: (value: "allowed" | "idle" | "blocked" | "loading") => void;
  requestedFileId: string | null;
  requestedFileName: string | null;
  requestType: string | null;
  url: string | null;
  changeRequestedFile: (value: string | null) => void;
  changeRequestedFileName : (value: string | null) => void;
  changeRequestType: (value: string | null) => void;
  changeUrl: (value: string | null) => void;
  isClean : false | true ;
  setClean : (value : boolean) => void
}



export const useGlobalStore = create<GlobalState>((set) => ({
  isChatwindow: "idle", // default value
  changeChatWindow: (value) => set({ isChatwindow: value }),
  requestedFileId: null,
  requestedFileName : null,
  requestType: null,
  url:null,
  changeRequestedFile: (value) => set({ requestedFileId: value }),
  changeRequestedFileName : (value ) => set({ requestedFileName: value }),
  changeRequestType: (value) => set({ requestType: value }),
  changeUrl: (value) => set({ url: value }),
  isClean : true ,
  setClean :  (value) => set({ isClean: value }),
}));