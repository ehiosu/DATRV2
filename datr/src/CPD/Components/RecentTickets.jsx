import React from "react";
import { RecentTicketsTable } from "./DataTable";
import { useNavigate } from "react-router";
export const RecentTickets = () => {
  return (
    <div className="w-full h-full bg-white">
      <RecentTicketsTable />
    </div>
  );
};
