"use client";
import React, { Suspense, useState } from "react";
//import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
//import Filter from "./Filters";
import UsersList from "./users/UsersList";
import BranchesList from "./branch/BranchesList";
import { BranchProps, UserProps } from "@/types/types";
import AlertDelete from "./shared/AlertDelete";
import { SETTINGS_PARAMETER_URL } from "@/lib/constants";
import dynamic from "next/dynamic";
const Filter = dynamic(() => import("./Filters"), {
  ssr: false,
});

const Setting = () => {
  const searchParams = useSearchParams();

  const [clearRowsSelected, setClearRowsSelected] = useState(false);
  const [usersSelected, setUsersSelected] = useState<UserProps[]>([]);
  const [branchesSelected, setBranchesSelected] = useState<BranchProps[]>([]);

  const type = searchParams ? searchParams.get("type") : null;
  return (
    <div>
      {" "}
      {/* Envolvemos con Suspense */}
      <div className="flex gap-6 justify-between">
        <h1 className="font-bold text-4xl">Settings</h1>
      </div>
      <div className="rounded-lg bg-white my-6 p-4">
        <p className="py-2">
          <Filter
            //setUserSelected={setUsersSelected}
            //setBranchesSelected={setBranchesSelected}
            usersSelected={usersSelected}
            //setDeleteUsers={setDeleteUsers}
            branchesSelected={branchesSelected}
          />
        </p>
        {type === SETTINGS_PARAMETER_URL.BRANCH ? (
          <BranchesList
            setBranchesSelected={setBranchesSelected}
            clearRowsSelected={clearRowsSelected}
            setClearRowsSelected={setClearRowsSelected}
          />
        ) : (
          <UsersList
            setUsersSelected={setUsersSelected}
            clearRowsSelected={clearRowsSelected}
            setClearRowsSelected={setClearRowsSelected}
          />
        )}
      </div>
      <AlertDelete
        setClearRowsSelected={setClearRowsSelected}
        //branchesSelected={branchesSelected}
        //usersSelected={usersSelected}
      />
    </div>
  );
};

// Aquí envolvemos el componente completo en Suspense
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Setting />
    </Suspense>
  );
};

export default Page;

//export default Home;
