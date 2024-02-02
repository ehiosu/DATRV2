import React from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { Outlet, redirect, useNavigate, useParams } from "react-router";

export const CpdConfigurationLayout = () => {
  //   const { location } = useParams();
  //   if (!location) return redirect("/CPD/Dashboard");
  return (
    <section className="w-full min-h-screen overflow-y-hidden">
      <SearchPage heading={"Configuration"}>
        <>
          <div className="w-max px-3 border-b-2 border-neutral-200 flex items-center gap-3">
            <NavItem name={"General"} to={"/CPD/Configuration/General"} />
            <NavItem name={"Sla"} to={"/CPD/Configuration/Sla"} />
            <NavItem name={"Tickets"} to={"/CPD/Configuration/Tickets"} />
            <NavItem name={"User Groups"} to={"/CPD/Configuration/Groups"} />
            <NavItem
              name={"Conversations"}
              to={"/CPD/Configuration/Conversations"}
            />
          </div>
          <Outlet />
        </>
      </SearchPage>
    </section>
  );
};

const NavItem = ({ to, name }) => {
  const nav = useNavigate();
  return (
    <div
      onClick={() => {
        nav(to);
      }}
      className={`flex items-center ${
        window.location.pathname === to || window.location.pathname.includes(to)
          ? "text-blue-400 border-b-2 border-blue-400"
          : "text-neutral-600"
      } h-10 hover:cursor-pointer w-max px-3 font-semibold`}
    >
      <p className="text-[0.8275rem]">{name}</p>
    </div>
  );
};
