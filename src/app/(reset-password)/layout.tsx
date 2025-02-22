"use client";
import AnimateMotion from "@/wrappers/AnimateMotion";
import { useEffect, useState } from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estado para determinar si el contenedor está visible en la pantalla
  const [isInView, setIsInView] = useState(false);

  // Usamos Intersection Observer para detectar cuando el contenedor entra en la vista
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true); // Si es visible, cargamos la imagen
          }
        });
      },
      {
        threshold: 0.5, // Configura que el contenedor se considera visible cuando el 50% está en la pantalla
      }
    );

    // Seleccionamos el contenedor
    const element = document.querySelector(".container-login");
    if (element) {
      observer.observe(element); // Empezamos a observar el contenedor
    }

    // Limpieza del observer cuando el componente se desmonte
    return () => {
      if (element) {
        observer.unobserve(element); // Dejamos de observar al desmontarse
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
