import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import {  CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FileWatcher({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<"pending" | "completed" | "failed">("pending");

  useEffect(() => {
    if (!jobId) return;
    setStatus("pending");
    const socket = getSocket();
    const channel = `job:${jobId}`;
    const handler = (data:
       {
       status: "completed" | "failed";
       error?: string;
       }) => {
      setStatus(data.status);
      if (data.status === "completed") {
        toast.success("Embedding completed");
      } else if (data.status === "failed") {
        toast.error("Embedding failed");
      }
    };
    socket.on(channel, handler);
    return () => {
      socket.off(channel, handler);
    };
  }, [jobId]);

  if (!jobId) return null;

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      {status === "pending" && (
        <div className="flex items-center gap-3 text-slate-700">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          <div>
            <p className="text-sm font-medium">File Embedding in Progress…</p>
            <p className="text-xs text-slate-500">Job ID: {jobId}</p>
          </div>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center gap-3 text-slate-700">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">Embedding completed</p>
            <p className="text-xs text-slate-500">You can start querying now.</p>
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="flex items-center gap-3 text-slate-700">
          <XCircle className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-medium">Embedding failed</p>
            <p className="text-xs text-slate-500">Please try again.</p>
          </div>
        </div>
      )}
    </div>
  );
}