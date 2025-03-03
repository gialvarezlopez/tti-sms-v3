"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clearRowsSelected, setClearRowsSelected] = useState(false);
  const [usersSelected, setUsersSelected] = useState<UserProps[]>([]);
  const [branchesSelected, setBranchesSelected] = useState<BranchProps[]>([]);

  const type = searchParams ? searchParams.get("type") : null;

  return (
    <div>
      <div className="flex gap-6 justify-between">
        <h1 className="font-bold text-2xl md:text-4xl">Settings</h1>
      </div>
      <div className="rounded-lg bg-white my-6 p-4">
        <p className="py-2">
          <Filter
            usersSelected={usersSelected}
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
      <AlertDelete setClearRowsSelected={setClearRowsSelected} />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Setting />
    </Suspense>
  );
};

export default Page;
