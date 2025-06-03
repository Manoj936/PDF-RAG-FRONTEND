"use client";
import React  from "react";
import {  UploadCloudIcon } from "lucide-react";
import { useGlobalStore } from "@/store/globalStore";
function FileUploadComponent() {
  const { changeChatWindow , changeRequestedFile ,setClean } = useGlobalStore();

  const uploadPdf = () => {
    // Logic to upload PDF
   
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".pdf");
    el.setAttribute("multiple", "false");
    el.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log(file);
       
        const formData = new FormData();
        formData.append("pdf", file);
        //call the api to send file to the server 
        try {
          changeChatWindow('loading')
          const fileuploadRes = await fetch('http://localhost:8000/upload/pdf', {
            method: 'POST',
            body: formData,
          });

          if (!fileuploadRes.ok) {
            throw new Error(`HTTP error! status: ${fileuploadRes.status}`);
          }

          const responseData = await fileuploadRes.json(); // or .text() depending on your server response
          console.log('Response Data:', responseData);
          changeRequestedFile(responseData.fileId)
          checkProcessingStatus(responseData.fileId)
          setClean(true);
        } catch (error) {
          console.error('Upload failed:', error);
          changeChatWindow('blocked')
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
        const res = await fetch(`http://localhost:8000/status/${fileId}`, {
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Polling response:", data);

        // Assuming the backend sends something like: { status: "processing" | "done" | "error" }
        if (data.status === "processed") {
          console.log("File processing complete:", data);
          // handle completed processing
          changeChatWindow('allowed')
        
          clearTimeout(timerFunction);
          return;
        }

        if (data.status === "failed") {
          console.error("Processing failed:", data);
          changeChatWindow('blocked')
        
          clearTimeout(timerFunction);
          return;
        }

        // If still processing, schedule the next poll
        timerFunction = setTimeout(poll, interval);
      } catch (err) {
        console.error("Polling error:", err);
        changeChatWindow('blocked')
      }
    };
    poll()
  }

  return (
    <>

      <div
        onClick={uploadPdf}
        className="w-60 font-mono bg-blue-600 text-white rounded-xl  items-center justify-center  flex p-5 text-2xl cursor-pointer"
      >
        Upload PDF &nbsp; <UploadCloudIcon />
      </div>



    </>
  );
}

export default FileUploadComponent;
