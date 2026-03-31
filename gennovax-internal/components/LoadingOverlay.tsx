"use client";

import React, { useEffect, useRef, useState } from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

const MIN_LOADING_MS = 500;

export default function LoadingOverlay({
  isLoading,
  text = "Dang xu ly...",
}: LoadingOverlayProps) {
  const [visible, setVisible] = useState(isLoading);
  const startedAtRef = useRef<number | null>(isLoading ? Date.now() : null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (isLoading) {
      startedAtRef.current = Date.now();
      setVisible(true);
      return;
    }

    if (!visible) return;

    const startedAt = startedAtRef.current;
    if (!startedAt) {
      setVisible(false);
      return;
    }

    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      startedAtRef.current = null;
      hideTimerRef.current = null;
    }, remaining);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-[2px] animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-white px-8 py-6 shadow-xl animate-in zoom-in-90 duration-500">
        <div className="relative h-12 w-12 animate-[spin_2.5s_linear_infinite]">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 flex justify-center"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
            >
              <div
                className="h-3.5 w-1.5 rounded-full bg-blue-600"
                style={{
                  opacity: 1 - i * 0.075,
                }}
              />
            </div>
          ))}
        </div>

        {/* <p className="text-gray-700 font-medium animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
          {text}
        </p> */}
      </div>
    </div>
  );
}
