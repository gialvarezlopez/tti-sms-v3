"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

const InactivityRefreshWithWarning = (): JSX.Element => {
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const inactivityTimer = useRef<NodeJS.Timeout>();
  const warningTimer = useRef<NodeJS.Timeout>();

  const resetAllTimers = (): void => {
    // Limpiar todos los timers existentes
    clearTimeout(inactivityTimer.current);
    clearTimeout(warningTimer.current);

    // Set new inactivity timer (4:30 minutes)
    inactivityTimer.current = setTimeout(() => {
      setShowWarning(true);

      // Reload after 30 seconds of warning (total 5 minutes = 300,000 milliseconds )
      warningTimer.current = setTimeout(() => {
        window.location.reload();
      }, 30000);
    }, 270000);
  };

  const handleContinue = (): void => {
    setShowWarning(false);
    resetAllTimers(); // Completely reset all timers
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Events that restart the timer BUT DO NOT close the modal if it is visible
    const events: Array<
      "mousedown" | "mousemove" | "keydown" | "scroll" | "touchstart"
    > = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

    const handleActivity = () => {
      if (!showWarning) {
        resetAllTimers();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Start timers for the first time
    resetAllTimers();

    return () => {
      clearTimeout(inactivityTimer.current);
      clearTimeout(warningTimer.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [showWarning]);

  return (
    <>
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Are you still there?</h2>
            <p className="mb-4">
              The page will reload in 30 seconds due to inactivity.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleContinue} variant={"destructive"}>
                Continue browsing
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InactivityRefreshWithWarning;
