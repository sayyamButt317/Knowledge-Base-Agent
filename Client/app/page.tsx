"use client";
import ChatComponent from "@/app/component/chat";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import FileWatcher from "./component/fileWatcher";

const Chat = () => {
  const [loading, setloading] = useState(false);
  const [jobId, setJobId] = useState("");
  
  const uploadfile = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute(
      "accept",
      "application/pdf,application/json,application/x-ndjson,text/plain,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          try {
            setloading(true);
            const response = await fetch("http://localhost:8000/upload/file", {
              method: "POST",
              body: formData,
            });
            const data = await response.json();
            setJobId(data.jobId);
            if (!response.ok) {
              throw new Error("❌ Upload failed");
            }

            toast.success(" File uploaded for Processing!");
          } catch (err) {
            toast.error("❌ Upload failed for Processing!");
            console.error(err);
          } finally {
            setloading(false);
          }
        }
      }
    });
    el.click();
  };

  const uploadfolder = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute(
      "accept",
      "application/pdf,application/json,application/x-ndjson,text/plain,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    el.setAttribute("multiple", "true");
    el.setAttribute("webkitdirectory", "true");
    el.setAttribute("directory", "true");
    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const files = Array.from(el.files);
        if (files.length > 0) {
          const formData = new FormData();
          for (const file of files) {
            formData.append("files", file);
          }
          try {
            setloading(true);
            const response = await fetch(
              "http://localhost:8000/upload/folder",
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await response.json();
            setJobId(data.jobId);
            if (!response.ok) {
              throw new Error("❌ Upload failed");
            }

            toast.success(" Folder uploaded for Processing!");
          } catch (err) {
            toast.error("❌ Upload failed for Processing!");
            console.error(err);
          } finally {
            setloading(false);
          }
        }
      }
    });
    el.click();
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="grid grid-cols-12">
        <aside className="hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3 h-screen sticky top-0 border-r border-slate-200 bg-white/70 backdrop-blur">
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="relative h-10 w-10 rounded-xl ring-1 ring-slate-200 overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
              <Image
                src="/assets/doc.png"
                alt="Company logo"
                fill
                className="object-contain p-1"
                sizes="40px"
              />
            </div>
            <div>
              <p className="text-base font-semibold">Your Knowledge Base</p>
              <p className="text-sm text-slate-500">
                AI Knowledge Base Chat Bot
              </p>
            </div>
          </div>
          <div className="px-6">
            <div className="mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-600">
                Chat with your docs, ask questions, and get instant answers.
              </p>
            </div>
          </div>
          <div className="px-6 gap-2 flex flex-row mt-4">
            <button
              className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
              onClick={uploadfile}
              disabled={loading}
            >
               {loading ? "Uploading..." : "Upload File"}
            
            </button>
            <button
              className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
              onClick={uploadfolder}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Folder"}
            </button>
          </div>
          <FileWatcher jobId={jobId} />
        </aside>
        <main className="col-span-12 md:col-span-9 min-h-screen">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-8 md:py-12">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Ask anything about your files or folder
              </h1>
              <p className="mt-1 text-slate-600">
                Upload a file or folder and start chatting. We’ll highlight
                sources and keep context as you go.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl "></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-4 sm:p-6 shadow-xl">
                <ChatComponent />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
