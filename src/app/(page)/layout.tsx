"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import SideBar from "@/components/commons/sidebar/Sidebar";
import { Loader2 } from "lucide-react";

const checkSessionCookie = () => {
  const sessionToken = Cookies.get("session-token");
  return !!sessionToken; // Convertir a booleano
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSessionValid, setIsSessionValid] = useState<boolean>(true); // Estado inicial
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAndSetSession = () => {
      const sessionValid = checkSessionCookie();
      setIsSessionValid(sessionValid); // Actualizar estado basado en la cookie
      if (!sessionValid) {
        redirect("/login");
      }
    };

    checkAndSetSession(); // Llamar la función inicialmente

    // Suscribirse a cambios en la cookie o a eventos relevantes
    const interval = setInterval(checkAndSetSession, 9000); // Verificar cada 9 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [router]);

  if (status === "loading") {
    return (
      <p className="text-center py-6 flex gap-2 justify-center items-center">
        Loading <Loader2 className="spin" size={"14px"} />
      </p>
    ); // Muestra un mensaje de carga
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="bg-[#141414] relative">
      <SideBar setIsSidebarOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 px-3 md:px-6 py-7 rounded-tl-[20px] min-h-[100vh]  bg-[#F9F9F9] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-[227px]" : "ml-[60px]"
        } z-auto relative`}
        id="container_message"
      >
        {children}
      </div>
    </div>
  );
}
