import { Metadata } from "next";
import ARCamera from "./ARCamera";

export const metadata: Metadata = {
  title: "AR Camera | ARtefact",
  description: "Experience augmented reality with location-based messaging",
};

export default function CameraPage() {
  return (
    <div className="min-h-screen bg-black">
      <ARCamera />
    </div>
  );
}
