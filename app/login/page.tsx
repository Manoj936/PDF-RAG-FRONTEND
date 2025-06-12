"use client"
import { useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Login() {
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const initAuth = useAuthStore((s) => s.initAuth);
  const router = useRouter();

  useEffect(() => {
    
    initAuth();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Welcome to MindFile 🧠
        </h1>
        <button
          onClick={googleLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="h-5 w-5 mr-3"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
