import React, { useEffect, useState } from "react";
import { USER_ROLE } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const withAdminProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper = (props: P) => {
    const { data: session, status } = useSession();

    const [isClient, setIsClient] = useState(false);

    // Set isClient to true once component is mounted on the client
    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (status === "loading" || !isClient) return; // Don't redirect while loading or on SSR

      if (!session || session.user.primaryRole !== USER_ROLE.ADMIN) {
        // Redirect to another page if not admin
        redirect("/");
      }
    }, [session, status, isClient]);

    if (
      status === "loading" ||
      !isClient ||
      !session ||
      session.user.primaryRole !== USER_ROLE.ADMIN
    ) {
      return <div>Loading...</div>; // O puedes mostrar un "Access Denied" o loader
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAdminProtection;
