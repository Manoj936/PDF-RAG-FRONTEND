
import ChatComponent from "./components/ChatComponent";
import FileUploadComponent from "./components/FileUploadComponent";

export default function Home() {
  return (
    <>

      <div className="min-h-screen min-w-screen flex overflow-hidden">
        <div className="w-[40vw] min-h-screen p-4 flex justify-center items-center">
          <FileUploadComponent />
        </div>
        <div className="w-[60vw] min-h-screen border-l-3 border">
          <ChatComponent />
        </div>
      </div>
    </>
  );
}
