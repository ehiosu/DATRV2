import React from "react";
import { useAuth } from "../../api/useAuth";
import { Navigate } from "react-router";
import { SearchPage } from "../../Reusable/SearchPage";

export const AllUsers = () => {
  const { user, access } = useAuth();
  if (!access) return <Navigate to={"/"} />;
  if (!user.roles.includes("ADMIN")) return <Navigate to={"/CPD/Dashboard"} />;
  return (
    <section className=" w-full  p-4 lg:p-2 max-h-screen overflow-y-auto">
      <SearchPage heading={"All Users"}></SearchPage>
    </section>
  );
};
