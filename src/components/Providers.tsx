"use client";
import { Toaster } from "react-hot-toast";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";

export default function Providers() {
  return (
    <>
      <FloatingWhatsAppButton />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: { fontFamily: "inherit", fontSize: "14px" },
        }}
      />
    </>
  );
}
