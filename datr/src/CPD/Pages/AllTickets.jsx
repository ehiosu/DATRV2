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
import { GeneralTicketsTable } from "../Components/DataTable";

export const AllTickets = () => {
  return (
    <section className="w-full">
      <SearchPage heading={"All Tickets"}>
        <div className="w-full  flex-wrap   flex justify-between md:gap-0 ">
          <div className="flex    gap-4   items-center">
            <ViewChangeBtn />
            <button className="w-44 bg-darkBlue rounded-md  text-white  h-10">
              New Application
            </button>
          </div>
          <div className="md:ml-auto flex    gap-3  flex-wrap md:my-0 my-2">
            <FilterButton />
            <RangeSelectButton />
          </div>
        </div>
        <div className="w-full  flex-1  ">
          <GeneralTicketsTable />
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
      <DropdownMenuTrigger className="border-darkBlue    border-2 flex justify-center items-center  w-60 md:w-56   text-[0.8275rem]  outline-none h-10    rounded-md  shadow-md  gap-3   font-semibold   ">
        Showing Last 90 days of Data <AiOutlineArrowDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-white w-28   rounded-md     z-50 my-2"></DropdownMenuContent>
    </DropdownMenu>
  );
};
