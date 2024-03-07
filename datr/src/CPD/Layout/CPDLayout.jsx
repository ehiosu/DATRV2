import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Outlet, Navigate } from "react-router";
import { AxiosClient } from "../../api/useAxiosClient";
import { useAuth } from "../../api/useAuth";
import { useVerified } from "../../api/useVerified";
export const CPDLayout = () => {
  const { access, user } = useAuth();
  const verified = useVerified();
  console.log(access);
  if (!access) return <Navigate to={"/"} />;
  if (!verified) return <Navigate to={"/Verify"} />;
  return (
    <main className="flex w-full bg-my-gray max-w-screen-2xl overflow-y-hidden">
      <Sidebar />
      <div className="xl:w-[75%] lg:w-[85%] w-full mx-auto min-h-screen overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </main>
  );
};
