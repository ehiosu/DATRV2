import React, { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiOutlineArrowDown } from "react-icons/ai";

import { redirect, useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "@/api/useAuth";
import {
  DraftMessagesColumnDefinition,
  GenericDataTable,
  InboxColumnDef,
  OutboxMessageColumnDef,
} from "@/CPD/Components/DataTable.tsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
export const AllMessages = () => {
  const query = new URLSearchParams(useLocation().search);
  const location = query.get("location");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(5);
  const [activeIndex, setActiveIndex] = useState(() => {
    switch (location) {
      case "inbox":
        return 0;
      case "sent":
        return 1;
      case "drafts":
        return 2;
      default:
        return 0;
    }
  });
  const nav = useNavigate();
  const { user } = useAuth();
  const home_pages = {
    CPO: "/CPD/Tickets",
    DGO: "/CPD/Dashboard",
    SHIFT_SUPERVISOR: "/CPD/Dashboard",
    TERMINAL_SUPERVISOR: "/CPD/Dashboard",
    AIRLINE: "/CPD/Tickets",
    ADMIN: "/CPD/Dashboard",
  };

  useEffect(() => {
    console.log("re render", location);
    switch (location) {
      case "inbox":
        setActiveIndex(0);
        break;
      case "sent":
        setActiveIndex(1);
        break;
      case "drafts":
        setActiveIndex(2);
        break;
      default:
        setActiveIndex(0);
    }
  }, [location, query]);
  return (
    <section className="w-full   ">
      <div className="flex flex-wrap items-center">
        <p className="text-2xl font-semibold text-ncBlue">Messages</p>
      </div>
      <div className="md:w-[60%] lg:w-[40%] w-full bg-ncBlue rounded-md py-1.5 px-2 flex h-12       gap-3  my-2">
        <button
          className={`flex-1   h-full  border-darkBlue   border-2    rounded-md ${
            location == "inbox"||activeIndex===0
              ? "bg-darkBlue text-white"
              : "bg-white text-darkBlue"
          }   transition-colors duration-700`}
          onClick={() => nav(`/CPD/Messages?location=inbox`, { replace: true })}
        >
          Inbox
        </button>
        <button
          className={`flex-1   h-full  border-darkBlue   border-2    rounded-md ${
            location === "sent"
              ? "bg-darkBlue text-white"
              : "bg-white text-darkBlue"
          }   transition-colors duration-700`}
          onClick={() => nav(`/CPD/Messages?location=sent`, { replace: true })}
        >
          Sent Items
        </button>
        <button
          className={`flex-1   h-full  border-darkBlue   border-2    rounded-md ${
            activeIndex == 2
              ? "bg-darkBlue text-white"
              : "bg-white text-darkBlue"
          }   transition-colors duration-700`}
          onClick={() =>
            nav(`/CPD/Messages?location=drafts`, { replace: true })
          }
        >
          Drafts
        </button>
      </div>
      <div className=" relative   mt-4 overflow-y-auto    w-[90%] mx-auto overflow-hidden  ">
        <div
          style={{ left: `-${activeIndex * 100}%` }}
          className=" relative w-[300%]   max-h-[60vh] h-auto    flex transition-all  duration-1000   "
        >
          <Inbox />
          <Outbox />
          <Drafts />
        </div>
        <div className="flex items-center mt-2 justify-between">
            <button disabled className="flex items-center gap-x-2 border-[1px] disabled:bg-slate-200 disabled:cursor-not-allowed disabled:hover:font-normal disabled:hover:bg-slate-200 border-[#D0D5DD] rounded-md text-sm px-3 py-1.5 hover:bg-slate-200 hover:font-semibold transition-all">
                <ArrowLeft className="w-4 h-4 shrink"/>
                Previous
            </button>
            <button className="flex items-center gap-x-2 border-[1px] border-[#D0D5DD] rounded-md text-sm px-3 py-1.5 hover:bg-slate-200 hover:font-semibold transition-all bg-ncBlue hover:text-black duration-300 text-white">
                Next
                <ArrowRight className="w-4 h-4 shrink"/>
            </button>
        </div>
      </div>
    </section>
  );
};
const Inbox = () => {
  const nav = useNavigate();

  return (
    <div className="max-h-[60vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg pb-2 mt-4 scroll-smooth w-[100%] mx-4">
      <GenericDataTable
      headerClassname=""
        columns={InboxColumnDef}
        data={[{ from: "Mayowa", complaintType: "test", status: "NEW",date:format(new Date(),'dd-MM-yyyy, p') }]}
      />
    </div>
  );
};
const Outbox = () => {
  const nav = useNavigate();
  return (
    <div className="max-h-[60vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg pb-2 mt-4 scroll-smooth w-[100%] mx-4">
    <GenericDataTable
    headerClassname=""
      columns={OutboxMessageColumnDef}
      data={[{ to: "Mayowa", complaintType: "test", status: "NEW",date:format(new Date(),'dd-MM-yyyy, p') }]}
    />
  </div>
  );
};

const Drafts = () => {
  const nav = useNavigate();
  return (
    <div className="max-h-[60vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg pb-2 mt-4 scroll-smooth w-[100%] mx-4">
    <GenericDataTable
    headerClassname=""
      columns={DraftMessagesColumnDefinition}
      data={[{ to: "Mayowa", complaintType: "test", status: "NEW",date:format(new Date(),'dd-MM-yyyy, p') }]}
    />
  </div>
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
      <DropdownMenuTrigger className="border-darkBlue    border-2 flex justify-center items-center  px-4   text-[0.8275rem]  outline-none h-10    rounded-md  shadow-md  gap-3   font-semibold   ">
        Showing Last 90 days of Data <AiOutlineArrowDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-white w-28   rounded-md     z-50 my-2"></DropdownMenuContent>
    </DropdownMenu>
  );
};
