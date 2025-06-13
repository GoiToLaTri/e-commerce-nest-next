import Link from "next/link";
import React from "react";
import "@/styles/access-denied.style.css";

export function AccessDenied() {
  return (
    <div className="access-denied flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <span className="text-6xl text-red-500 mb-4">
          <i className="anticon anticon-stop" />
        </span>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-500 mb-6">
          Sorry, you do not have permission to view this page.
        </p>
        <Link href="/" className="ant-btn ant-btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
