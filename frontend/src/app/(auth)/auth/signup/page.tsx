import { SignupForm } from "@/components/forms";
import { ZwindLogoXXL } from "@/components/ui/logo/zwind-logo-xxl";
import Link from "next/link";
import React from "react";

export default function Signup() {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 mx-[8rem] my-[2.4rem] rounded-[24px] g-gradient-to-br from-white/10 to-white/5 backdrop-blur-0 border border-purple-200/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex items-center"
      >
        <div className="mx-auto">
          <div className="flex justify-center mb-8">
            <Link href={"/"}>
              <ZwindLogoXXL />
            </Link>
          </div>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
