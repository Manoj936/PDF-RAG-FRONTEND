"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import React, { useState } from "react";
import { RssIcon, UploadCloudIcon } from "lucide-react";
import { useGlobalStore } from "@/store/globalStore";
import useAuthStore from "@/store/useAuthStore";
function FileUploadComponent() {
  const {
    changeChatWindow,
    changeRequestedFile,
    setClean,
    changeRequestedFileName,
    changeRequestType,
    changeUrl,
  } = useGlobalStore();
  const user = useAuthStore((s) => s.user);
  const [fileName, setFileName] = useState<string | null>(null);
  const [urlName , setUrlName] = useState<string | null>(null);
  const processWebsiteUrl = async () => {
    let url = prompt("Please enter the website URL or paste it here:");
    const clipboard = navigator.clipboard;

    try {
      const text = await clipboard.readText();

      if (!url || url.trim() === "") {
        const cleanedText = text.trim();
        if (
          cleanedText.startsWith("http://") ||
          cleanedText.startsWith("https://")
        ) {
          url = cleanedText;
        } else {
          alert("Enter a valid URL starting with http:// or https://");
          return;
        }
      }

      if (url && url.trim() !== "") {
        console.log("Final URL:", url);
        setUrlName(url)
        setFileName('');
        await processUrl(url); // Awaiting this now
      } else {
        setUrlName('')
        alert("URL cannot be empty.");
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      alert("Could not access clipboard. Please enter the URL manually.");
    }
  };

  const processUrl = async (url) => {
    try {
      changeChatWindow("loading");
      const UrlRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}scraper`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url , email: user.email }),
        }
      );
      const responseData = await UrlRes.json();
      if (!UrlRes.ok) {
        changeChatWindow("blocked");
        throw new Error(
          `${
            responseData.message
              ? responseData.message
              : "Unexpected error occured"
          }`
        );
      }
      if (responseData.status === false) {
        changeChatWindow("blocked");
        throw new Error(
          `${
            responseData.message
              ? responseData.message
              : "Unexpected error occured"
          }`
        );
      } else {
        changeChatWindow("allowed");
        console.log(responseData, "🌐🌐🌐🌐");
        changeRequestedFile(responseData.fileId);
        changeUrl(responseData.url);
        changeRequestedFileName("")
        changeRequestType(responseData.requestType);
        setClean(true);
      }
    } catch (error) {
      changeChatWindow("blocked");
      console.error("Error processing URL:", error);
      alert(error.message || "An error occurred while processing the URL.");
    }
  };
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
        ];

        if (!allowedTypes.includes(file.type)) {
          alert("Only PDF, DOCX files are allowed.");
          return;
        }
        // Check if the file is a PDF
        setFileName(file.name);
        setUrlName('')
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
            changeUrl("");
            changeRequestType(responseData.requestType);
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
      <div className="flex flex-col gap-4">
        <div
          onClick={uploadPdf}
          className="w-fit max-w-md font-mono bg-blue-600 text-white rounded-xl flex items-center justify-between px-5 py-4 text-sm sm:text-base cursor-pointer gap-3 shadow-md hover:bg-blue-700 transition"
        >
          <UploadCloudIcon className="w-5 h-5" />
          <span className="truncate">
            {fileName ? fileName : "Upload Your Document to chat"}
          </span>
        </div>

        <div
          onClick={processWebsiteUrl}
          className="w-fit max-w-md font-mono bg-blue-600 text-white rounded-xl flex items-center justify-between px-5 py-4 text-sm sm:text-base cursor-pointer gap-3 shadow-md hover:bg-blue-700 transition"
        >
          <RssIcon className="w-5 h-5" />
          <span className="truncate"> {urlName ? urlName : "Provide a Website URL to chat"} </span>
        </div>
      </div>
    </>
  );
}

export default FileUploadComponent;
