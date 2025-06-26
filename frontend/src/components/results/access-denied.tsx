import Link from "next/link";
import React from "react";
import "@/styles/access-denied.style.css";
import { PrupleButton, ZwindLogo } from "../ui";

export function AccessDenied() {
  return (
    <div className="access-denied flex flex-col items-center justify-center min-h-screen">
      <div className="access-deneid-card w-full max-w-md py-8 px-16 rounded-[24px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white mx-auto select-none">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-12">
            <ZwindLogo />
          </div>
          <h1 className="text-8xl tracking-wider font-bold text-white mb-2 ml-4 font-mono">
            403
          </h1>
          <h2 className="text-2xl font-semibold tracking-wider text-white mb-4">
            Access Denied
          </h2>
          <p className="text-center text-white mb-6">
            Sorry, you do not have permission to view this page.
          </p>
          <Link href="/">
            <PrupleButton>Go Home</PrupleButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
