"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import UsersList from "./users/UsersList";
import BranchesList from "./branch/BranchesList";
import { BranchProps, UserProps } from "@/types/types";
import AlertDelete from "./shared/AlertDelete";
import { SETTINGS_PARAMETER_URL } from "@/lib/constants";
import dynamic from "next/dynamic";
import withAdminProtection from "@/components/hoc/withAdminProtection";
const Filter = dynamic(() => import("./Filters"), {
  ssr: false,
});

const Setting = () => {
  const searchParams = useSearchParams();

  const [clearRowsSelected, setClearRowsSelected] = useState(false);
  const [usersSelected, setUsersSelected] = useState<UserProps[]>([]);
  const [branchesSelected, setBranchesSelected] = useState<BranchProps[]>([]);

  const type = searchParams ? searchParams.get("type") : null;
  const limit = searchParams ? searchParams.get("limit") : null;

  let limitByDefault = type === SETTINGS_PARAMETER_URL.BRANCH ? 10 : 25;
  if (limit && limit !== null) {
    limitByDefault = +limit;
  }
  //const limitByDefault = type === SETTINGS_PARAMETER_URL.BRANCH ? 10 : 25;

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
            limitByDefault={limitByDefault}
          />
        </p>
        {type === SETTINGS_PARAMETER_URL.BRANCH ? (
          <BranchesList
            setBranchesSelected={setBranchesSelected}
            clearRowsSelected={clearRowsSelected}
            setClearRowsSelected={setClearRowsSelected}
            limitByDefault={limitByDefault}
          />
        ) : (
          <UsersList
            setUsersSelected={setUsersSelected}
            clearRowsSelected={clearRowsSelected}
            setClearRowsSelected={setClearRowsSelected}
            limitByDefault={limitByDefault}
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

export default withAdminProtection(Page);
