import React, { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { TopNav } from "./TopNav";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/api/useAuth";

export const CPDLayout = () => {
  const nav = useNavigate();
  const { access, verified } = useAuth();
  const location = useLocation();
  const isAccessValid = access !== "access" && access;

  useEffect(() => {
    if (!isAccessValid && location.pathname !== "/CPD/New-Ticket") {
      sessionStorage.setItem("referrer", location.pathname);
      console.log(`${location.pathname} and ${location.search}`);
      nav("/Auth");
    } else if (!verified && location.pathname !== "/CPD/New-Ticket") {
      console.log("not verified");
      nav("/Verify");
    }
  }, [isAccessValid, verified, location, nav]);
  return (
    <div className="flex  w-full  relative overflow-hidden">
      <Sidebar />
      <div className="  w-[70vw] flex flex-col  flex-1 h-screen">
        <TopNav />

        <div className="bg-[#F7F7F7] flex-1  overflow-y-auto  p-2 ">
          {isAccessValid && (
            <button
              onClick={() => {
                nav(-1);
              }}
              className="w-max text-xs px-3 h-max py-1.5 my-2 bg-ncBlue rounded-md text-white flex items-center"
            >
              <ArrowLeft className="w-4 h-4 shrink" /> Back
            </button>
          )}
          <Outlet />
          {/* <div className="w-full h-[20vh] bg-ncBlue px-6 py-3">

    </div> */}
        </div>
      </div>
    </div>
  );
};
