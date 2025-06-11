// store/useAuthStore.ts
import { create } from "zustand";
import { User, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  initAuth: () => void;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },
  googleLogin: async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  },
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

export default useAuthStore;
