"use client";

import { Download } from "lucide-react";
import { useState } from "react";

export default function InvoiceDownloadButton({ invoiceUrl, filename }: { invoiceUrl: string; filename: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function downloadInvoice() {
    if (status === "loading") return;
    setStatus("loading");

    try {
      const response = await fetch(invoiceUrl, { credentials: "same-origin" });
      if (!response.ok) throw new Error("Invoice request failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch (error) {
      console.error("Invoice download failed:", error);
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={downloadInvoice}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-[#bf4800] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d3b00] disabled:cursor-wait disabled:opacity-70"
      >
        <Download size={17} />
        {status === "loading" ? "Generating invoice..." : "Download Invoice"}
      </button>
      {status === "error" ? (
        <p className="mt-2 text-sm text-red-600">Unable to generate invoice. Please try again.</p>
      ) : null}
    </div>
  );
}
