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

  /*
  const removeQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    params.delete("sortBy");
    params.delete("sortOrder");

    // Updates the URL without the removed parameters
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (type) {
      removeQueryParams();
    }
  }, [type]);
  */
  return (
    <div>
      <div className="flex gap-6 justify-between">
        <h1 className="font-bold text-2xl md:text-4xl">Settings</h1>
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

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Setting />
    </Suspense>
  );
};

export default Page;
