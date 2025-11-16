"use client";

import { useEffect, useRef, useState } from "react";
import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
} from "@snap/camera-kit";

const SNAP_API_TOKEN = process.env.NEXT_PUBLIC_SNAP_CAMERA_KIT_API_TOKEN;
const LENS_ID = process.env.NEXT_PUBLIC_SNAP_LENS_ID;
const LENS_GROUP_ID = process.env.NEXT_PUBLIC_SNAP_LENS_GROUP_ID;

export default function ARCamera() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!SNAP_API_TOKEN || !LENS_ID || !LENS_GROUP_ID) {
      setError("Missing Snap Camera Kit configuration");
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function initializeCameraKit() {
      try {
        if (!canvasRef.current) return;

        const cameraKit = await bootstrapCameraKit({
          apiToken: SNAP_API_TOKEN!,
        });

        const session = await cameraKit.createSession({
          liveRenderTarget: canvasRef.current,
        });

        sessionRef.current = session;

        session.events.addEventListener("error", (event) => {
          console.error("Lens error:", event.detail.error);
          if (mounted) {
            setError(`Lens error: ${event.detail.error.message}`);
          }
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        mediaStreamRef.current = stream;

        const source = createMediaStreamSource(stream, {
          transform: Transform2D.MirrorX,
          cameraType: "user",
        });

        await session.setSource(source);

        console.log("Loading lens group:", LENS_GROUP_ID);
        await cameraKit.lensRepository.loadLensGroups([LENS_GROUP_ID!]);
        
        console.log("Loading lens:", LENS_ID);
        const lens = await cameraKit.lensRepository.loadLens(
          LENS_ID!,
          LENS_GROUP_ID!
        );
        
        console.log("Lens loaded successfully:", lens);
        console.log("Applying lens to session...");
        await session.applyLens(lens);
        
        console.log("Starting session play...");
        await session.play();

        if (mounted) {
          setIsLoading(false);
          setIsPlaying(true);
        }
      } catch (err) {
        console.error("Camera Kit initialization error:", err);
        if (mounted) {
          let errorMessage = "Failed to initialize camera";
          
          if (err instanceof Error) {
            errorMessage = err.message;
            
            if (errorMessage.includes("LocationRenderObjectProvider")) {
              errorMessage = "This lens requires location-based features that are not supported in web browsers. Please use a lens without Landmarkers or location AR features.";
            }
          }
          
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    }

    initializeCameraKit();

    return () => {
      mounted = false;
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        mediaStreamRef.current = null;
      }

      if (sessionRef.current) {
        sessionRef.current.pause?.();
        sessionRef.current.destroy?.();
        sessionRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Initializing AR Camera...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/90">
          <div className="text-center text-white max-w-md px-6">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Camera Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full"
        style={{
          objectFit: "contain",
        }}
      />

      {isPlaying && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
          <button
            onClick={() => {
              if (sessionRef.current) {
                sessionRef.current.pause();
                setIsPlaying(false);
              }
            }}
            className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full font-medium hover:bg-white/30 transition border border-white/30"
          >
            Pause
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition"
          >
            Exit AR
          </button>
        </div>
      )}

      {!isPlaying && !isLoading && !error && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
          <button
            onClick={() => {
              if (sessionRef.current) {
                sessionRef.current.play();
                setIsPlaying(true);
              }
            }}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition"
          >
            Resume
          </button>
        </div>
      )}
    </div>
  );
}
