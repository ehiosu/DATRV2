import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Outlet, Navigate } from "react-router";
import { AxiosClient } from "../../api/useAxiosClient";
import { useAuth } from "../../api/useAuth";
export const CPDLayout = () => {
  const { access, user } = useAuth();
  if (!access || user.roles.includes("USER")) return <Navigate to={"/"} />;
  return (
    <main className="flex w-full bg-my-gray max-w-screen-2xl overflow-y-hidden">
      <Sidebar />
      <div className="xl:w-[75%] lg:w-[85%] w-full mx-auto min-h-screen overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </main>
  );
};
