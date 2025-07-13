import Link from "next/link";
import React from "react";
import "@/styles/access-denied.style.css";
import { PurpleButton, ZwindLogo } from "../ui";

export function GoneError({ message }: { message: string }) {
  return (
    <div className="access-denied absolute top-0 left-0 z-[9999] min-w-full flex flex-col items-center justify-center min-h-screen">
      <div className="access-denied-card w-full max-w-md py-8 px-16 rounded-[24px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white mx-auto select-none">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-12">
            <ZwindLogo />
          </div>
          <h1 className="text-8xl tracking-wider font-bold text-white mb-2 ml-4 font-mono">
            410
          </h1>
          <h2 className="text-2xl font-semibold tracking-wider text-white mb-4">
            Gone
          </h2>
          <p className="text-center text-white mb-6">{message}</p>
          <Link href="/">
            <PurpleButton>Go Home</PurpleButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
