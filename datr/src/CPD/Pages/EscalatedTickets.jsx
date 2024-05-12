import React from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { AiOutlineArrowDown } from "react-icons/ai";
import { EscalatedTicketsTable } from "../Components/DataTable";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useQuery } from "@tanstack/react-query";
import { NewTicketBtn } from "../../components/NewTicketBtn";
import { useAuth } from "../../api/useAuth";

export const EscalatedTickets = () => {
  const { axios } = useAxiosClient();
  const { user } = useAuth();
  const isAirline = user.roles.includes("AIRLINE");
  const ticketsQuery = useQuery({
    queryKey: ["tickets", "escalated"],
    queryFn: () =>
      axios(
        isAirline
          ? "tickets/airline/status?value=UNASSIGNED&page=0&size=10"
          : "tickets/status?value=ESCALATED",
        {
          method: "GET",
        }
      )
        .then((resp) => resp.data)
        .catch((err) => err),
  });
  return (
    <section className="w-full">
      <SearchPage heading={"Escalated Tickets"}>
        <div className="w-full  flex-wrap   flex">
          <div className="flex    gap-4   items-center">
            <ViewChangeBtn />
            <NewTicketBtn />
          </div>
          <div className="ml-auto flex    gap-3 md:my-0 my-2 flex-wrap">
            <FilterButton />
            <RangeSelectButton />
          </div>
        </div>
        <div className="w-full    max-h-[75vh]  mt-4 overflow-y-auto ">
          {ticketsQuery.isSuccess && (
            <EscalatedTicketsTable data={ticketsQuery.data.tickets} />
          )}
          {ticketsQuery.isError && (
            <div className="w-full h-full grid place-items-center  min-h-[60vh]">
              <p className="Font-semibold text-[2rem] text-neutral-500">
                {ticketsQuery.error.message ===
                "Request failed with status code 401"
                  ? "You don't have access to this resource!"
                  : ticketsQuery.error.message}
              </p>
            </div>
          )}
        </div>
      </SearchPage>
    </section>
  );
};

const ViewChangeBtn = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-[#EEEEEE] flex justify-center items-center  w-24 outline-none h-10    rounded-md  shadow-md  gap-3   font-semibold   text-[0.8275rem]">
        Views <AiOutlineArrowDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-white w-28   rounded-md     z-50 my-2">
        <DropdownMenuItem className="h-6">
          <p className="text-[0.8275rem] text-neutral-400    text-center">
            List
          </p>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-500" />
        <DropdownMenuItem className="h-6">
          <p className="text-[0.8275rem] text-neutral-400    text-center">
            Grid
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-[#EEEEEE] flex justify-center items-center  w-32   text-[0.8275rem]  outline-none h-10    rounded-md  shadow-md  gap-3   font-semibold   ">
        Filter by All <AiOutlineArrowDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-white w-28   rounded-md     z-50 my-2"></DropdownMenuContent>
    </DropdownMenu>
  );
};
const RangeSelectButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-darkBlue    border-2 flex justify-center items-center  w-56   text-[0.8275rem]  outline-none h-10    rounded-md  shadow-md  gap-3   font-semibold   ">
        Showing Last 90 days of Data <AiOutlineArrowDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-white w-28   rounded-md     z-50 my-2"></DropdownMenuContent>
    </DropdownMenu>
  );
};
