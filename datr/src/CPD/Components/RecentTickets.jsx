import React from "react";
import { RecentTicketsTable } from "./DataTable";
import { useNavigate } from "react-router";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useAuth } from "../../api/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton.tsx";
export const RecentTickets = () => {
  const { axios } = useAxiosClient();
  const { user } = useAuth();
  const isAirline = user.roles.includes("AIRLINE");

  const ticketsQuery = useQuery({
    queryKey: ["tickets", "new"],
    queryFn: () =>
      axios(
        isAirline
          ? "tickets/airline/status?value=NEW&page=0&size=10"
          : "tickets/status?value=NEW"
      ).then((resp) => resp.data.tickets),
  });
  return (
    <div className="w-full h-full bg-white">
      {ticketsQuery.isSuccess ? (
        <RecentTicketsTable data={ticketsQuery.data} />
      ) : (
        <>
          <Skeleton className="w-full h-8 my-2" />
          <Skeleton className="w-full h-8 my-2" />
          <Skeleton className="w-full h-8 my-2" />
          <Skeleton className="w-full h-8 my-2" />
          <Skeleton className="w-full h-8 my-2" />
        </>
      )}
    </div>
  );
};
