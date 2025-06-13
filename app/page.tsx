"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";

import ChatComponent from "./components/ChatComponent";

import { useGlobalStore } from "@/store/globalStore";
import FileUploadComponent from "./components/FileUploadComponent";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const initAuth = useAuthStore((s) => s.initAuth);
  const logout = useAuthStore((s) => s.logout);
  const { setClean } = useGlobalStore();
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const signOut = () => {
    logout();
    setClean(true);
  };
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user)
    return <p className="p-4">Checking authentication...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
          <span className="text-indigo-600">MindFile</span>
          <span className="text-xl">🧠</span>
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Hi &nbsp;
            {user.displayName}
          </p>
          <button
            onClick={signOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[40vw] p-4 flex justify-center items-center">
          <FileUploadComponent />
        </div>
        <div className="w-[60vw] border-l-4 border-gray-200">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}
