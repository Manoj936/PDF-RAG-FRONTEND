"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import React, { useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import { useGlobalStore } from "@/store/globalStore";
import useAuthStore from "@/store/useAuthStore";
function FileUploadComponent() {
  const {
    changeChatWindow,
    changeRequestedFile,
    setClean,
    changeRequestedFileName,
  } = useGlobalStore();
  const user = useAuthStore((s) => s.user);
  const [fileName, setFileName] = useState<string | null>(null);
  const uploadPdf = () => {
    // Logic to upload PDF
    console.log(user.email);
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".pdf,.docx");
    el.setAttribute("multiple", "false");
    el.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      console.log(file.type);
      if (file) {
        const allowedTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/kswps", // .docx
        ];

        if (!allowedTypes.includes(file.type)) {
          alert("Only PDF, DOC, and DOCX files are allowed.");
          return;
        }
        // Check if the file is a PDF
        setFileName(file.name);
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("email", user.email); // Assuming you want to send the user's email with the file
        //call the api to send file to the server
        try {
          changeChatWindow("loading");
          const fileuploadRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}upload/pdf`,
            {
              method: "POST",
              body: formData,
            }
          );
          const responseData = await fileuploadRes.json(); // or .text() depending on your server response
          if (!fileuploadRes.ok) {
            changeChatWindow("blocked");
            throw new Error(
              `${
                responseData.message
                  ? responseData.message
                  : "Unexpected error occured"
              }`
            );
          }
          console.log(responseData, "🗃️🗃️🗃️🗃️");
          if (responseData.status) {
            changeChatWindow("allowed");
            changeRequestedFile(responseData.fileId);
            changeRequestedFileName(responseData.filename);
            setClean(true);
          } else {
            changeChatWindow("blocked");
            throw new Error(
              `${
                responseData.message
                  ? responseData.message
                  : "Unexpected error occured"
              }`
            );
          }
        } catch (error) {
          console.error("Upload failed:", error);
          alert(error);
          changeChatWindow("blocked");
        }
      }
    });
    el.click();
  };

  return (
    <>
      <div
        onClick={uploadPdf}
        className="w-fit max-w-md font-mono bg-blue-600 text-white rounded-xl flex items-center justify-between px-5 py-4 text-sm sm:text-base cursor-pointer gap-3 shadow-md hover:bg-blue-700 transition"
      >
        <UploadCloudIcon className="w-5 h-5" />
        <span className="truncate">
          {fileName ? fileName : "Upload PDF  / DOCX"}
        </span>
      </div>
    </>
  );
}

export default FileUploadComponent;
