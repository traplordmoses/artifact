"use client";

import dynamic from "next/dynamic";

const ARCamera = dynamic(() => import("./ARCamera"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-lg">Loading AR Camera...</div>
    </div>
  ),
});

export default function CameraPage() {
  return (
    <div className="min-h-screen bg-black">
      <ARCamera />
    </div>
  );
}
