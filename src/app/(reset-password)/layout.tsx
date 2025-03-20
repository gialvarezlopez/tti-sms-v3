"use client";
import AnimateMotion from "@/wrappers/AnimateMotion";
import { useEffect, useState } from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    const element = document.querySelector(".container-login");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div
      className={`container-login min-h-screen flex items-center justify-center ${
        isInView ? "bg-loaded" : "bg-placeholder"
      }`}
    >
      <main className="w-full">
        <div className="pt-6 px-4 w-full">
          <div className="flex items-center justify-center w-full h-full">
            <AnimateMotion>{children}</AnimateMotion>
          </div>
        </div>
      </main>
    </div>
  );
}
