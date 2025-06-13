"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import React, { useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import { useGlobalStore } from "@/store/globalStore";
import useAuthStore from "@/store/useAuthStore";
function FileUploadComponent() {
  const { changeChatWindow, changeRequestedFile, setClean } = useGlobalStore();
  const user = useAuthStore((s) => s.user);
  const [fileName, setFileName] = useState<string | null>(null);
  const uploadPdf = () => {
    // Logic to upload PDF
    console.log(user.email);
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".pdf");
    el.setAttribute("multiple", "false");
    el.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Check if the file is a PDF
        setFileName(file.name);
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("email", user.email); // Assuming you want to send the user's email with the file
        //call the api to send file to the server
        try {
          changeChatWindow("loading");
          const fileuploadRes :any = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}upload/pdf`,
            {
              method: "POST",
              body: formData,
            }
          );
          const responseData = await fileuploadRes.json(); // or .text() depending on your server response
          if (!fileuploadRes.ok) {
            changeChatWindow("blocked");
            throw new Error(`${responseData.message ? responseData.message : 'Unexpected error occured'}`);
            
          }
          changeRequestedFile(responseData.fileId);
          checkProcessingStatus(responseData.fileId);
          setClean(true);
        } catch (error) {
          console.error("Upload failed:", error);
          alert(error)
          changeChatWindow("blocked");
        }
      }
    });
    el.click();
  };

  const checkProcessingStatus = async (fileId: string) => {
    const interval = 2000;
    let timerFunction: ReturnType<typeof setTimeout> | null = null;
    const poll = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}status/${fileId}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Polling response:", data);

        // Assuming the backend sends something like: { status: "processing" | "done" | "error" }
        if (data.status === "processed") {
          console.log("File processing complete:", data);
          // handle completed processing
          changeChatWindow("allowed");

          clearTimeout(timerFunction);
          return;
        }

        if (data.status === "failed") {
          console.error("Processing failed:", data);
          changeChatWindow("blocked");

          clearTimeout(timerFunction);
          return;
        }

        // If still processing, schedule the next poll
        timerFunction = setTimeout(poll, interval);
      } catch (err) {
        console.error("Polling error:", err);
        changeChatWindow("blocked");
      }
    };
    poll();
  };

  return (
    <>
      <div
        onClick={uploadPdf}
        className="w-fit max-w-md font-mono bg-blue-600 text-white rounded-xl flex items-center justify-between px-5 py-4 text-sm sm:text-base cursor-pointer gap-3 shadow-md hover:bg-blue-700 transition"
      >
        <UploadCloudIcon className="w-5 h-5" />
        <span className="truncate">{fileName ? fileName : "Upload PDF"}</span>
      </div>
    </>
  );
}

export default FileUploadComponent;
