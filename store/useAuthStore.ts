// store/useAuthStore.ts
import { create } from "zustand";
import {
  User,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";
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
    // Listen for user state
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });

    // Check if there's a redirect result after login
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        set({ user: result.user });
      }
    });
  },

  googleLogin: async () => {
    const provider = new GoogleAuthProvider();

    try {
      // ✅ Must be the first action in a click handler
      const result = await signInWithPopup(auth, provider);
      set({ user: result.user });
    } catch (error: any) {
      console.error("Google login error:", error);

      // 👇 Handle popup blocked gracefully
      if (error.code === "auth/popup-blocked") {
        await signInWithRedirect(auth, provider);
      }
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

export default useAuthStore;
