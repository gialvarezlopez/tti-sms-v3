// AnimateMotion.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname(); // Obtiene la ruta actual

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Evita renderizar mientras se hace el montaje en el cliente
  }

  // Si la ruta actual es '/', no aplicamos la animación
  if (pathname === "/") {
    return <>{children}</>; // Sin animación
  }

  return (
    /*
    <motion.div
      initial={{ x: "-100%", opacity: 0 }} // Comienza fuera de la pantalla con opacidad 0
      animate={{ x: 0, opacity: 1 }} // Se mueve a su posición original y se desvanece
      transition={{ duration: 0.7, ease: "easeOut" }} // Suaviza la transición
    >
      {children}
    </motion.div>
    */
    /*
    <motion.div
      initial={{ x: "-100%", scale: 0.8 }} // Comienza fuera de la pantalla con un tamaño reducido
      animate={{ x: 0, scale: 1 }} // Se mueve a su posición original y se escala
      transition={{ duration: 0.7, ease: "easeOut" }} // Suaviza la transición
    >
      {children}
    </motion.div>
    */
    /*
    <motion.div
      initial={{ x: "-100%", y: 50, opacity: 0 }} // Comienza fuera de la pantalla y con opacidad 0
      animate={{ x: 0, y: 0, opacity: 1 }} // Se mueve a su posición original y aparece
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
    */
    /*
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }} // Comienza pequeño y con opacidad 0
      animate={{ scale: 1, opacity: 1 }} // Se expande y se hace completamente visible
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
    */
    /*
    <motion.div
      initial={{ x: "-100%", opacity: 0 }} // Comienza fuera de la pantalla
      animate={{ x: 0, opacity: 1 }} // Se mueve a su posición original
      transition={{
        duration: 0.7,
        ease: "easeOut",
        type: "spring", // Añade un rebote
        stiffness: 50,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
*/
    /*
    <motion.div
      initial={{ x: "-100%" }} // Comienza fuera de la pantalla
      animate={{ x: 0 }} // Se mueve a su posición original
      transition={{ duration: 1.2, ease: "easeInOut" }} // Suaviza la transición
    >
      {children}
    </motion.div>
  */
    <motion.div
      initial={{ y: 100, opacity: 0, filter: "blur(10px)" }} // Comienza fuera de la pantalla y desenfocado
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} // Se mueve a su posición y el desenfoque desaparece
      transition={{ duration: 0.8, ease: "easeInOut" }} // Transición suave con duración un poco mayor
    >
      {children}
    </motion.div>

    /*
    <motion.div
      initial={{ x: "-100%", opacity: 0 }} // Comienza fuera de la pantalla
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.1,
        ease: "easeOut",
        type: "spring",
        stiffness: 50,
        damping: 25,
      }}
    >
      {children}
    </motion.div>
    */
  );
};

export default PageWrapper;
