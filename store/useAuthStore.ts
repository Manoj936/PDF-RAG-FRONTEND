// store/useAuthStore.js
import { create } from "zustand";
import { auth } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  googleLogin: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    set({ user: result.user });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

export default useAuthStore;
