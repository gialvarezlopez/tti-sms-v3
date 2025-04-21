"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const InactivityRefresh = (): null => {
  const router = useRouter();
  const inactivityTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Verificar si estamos en el cliente
    if (typeof window === "undefined") return;

    const resetTimer = (): void => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      // 5 minutes = 300,000 milliseconds
      inactivityTimer.current = setTimeout(() => {
        window.location.reload(); // We use window.location instead of router.reload()
      }, 300000);
    };

    const events: Array<
      "mousedown" | "mousemove" | "keydown" | "scroll" | "touchstart"
    > = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []); // Eliminamos la dependencia del router

  return null;
};

export default InactivityRefresh;
