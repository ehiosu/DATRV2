import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Outlet } from "react-router";
export const CPDLayout = () => {
  return (
    <main className="flex w-full bg-my-gray max-w-screen-2xl overflow-y-hidden">
      <Sidebar />
      <div className="xl:w-[75%] lg:w-[85%] w-full mx-auto min-h-screen overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </main>
  );
};
