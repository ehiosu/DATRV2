import React, { useEffect, useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { AiOutlineArrowDown } from "react-icons/ai";
import {
  DraftDataTable,
  InboxDataTable,
  OutboxDataTable,
} from "../Components/DataTable";
import { redirect, useNavigate, useParams } from "react-router";

export const AllMessages = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { section } = useParams();
  const nav = useNavigate();
  if (!section) {
    redirect("/CPD/Dashboard");
  }
  useEffect(() => {
    switch (section) {
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
        console.log("wrong");
        nav("/CPD/Dashboard");
    }
  }, [section]);
  return (
    <section className="w-full   ">
      <SearchPage heading={"All Messages"}>
        <div className="w-full  flex-wrap   flex">
          <div className="flex    gap-4   items-center">
            <ViewChangeBtn />
            <button className="w-44 bg-darkBlue rounded-md  text-white  h-10">
              New Application
            </button>
          </div>
          <div className="ml-auto flex    gap-3 md:my-0 my-2 flex-wrap">
            <FilterButton />
            <RangeSelectButton />
          </div>
        </div>
        <div className="md:w-[60%] w-full mx-auto flex h-12       gap-3  my-2">
          <button
            className={`flex-1   h-full  border-darkBlue   border-2    rounded-md ${
              activeIndex == 0
                ? "bg-darkBlue text-white"
                : "bg-white text-darkBlue"
            }   transition-colors duration-700`}
            onClick={() => setActiveIndex(0)}
          >
            Inbox
          </button>
          <button
            className={`flex-1   h-full  border-darkBlue   border-2    rounded-md ${
              activeIndex == 1
                ? "bg-darkBlue text-white"
                : "bg-white text-darkBlue"
            }   transition-colors duration-700`}
            onClick={() => setActiveIndex(1)}
          >
            Sent Items
          </button>
          <button
            className={`flex-1   h-full  border-darkBlue   border-2    rounded-md ${
              activeIndex == 2
                ? "bg-darkBlue text-white"
                : "bg-white text-darkBlue"
            }   transition-colors duration-700`}
            onClick={() => setActiveIndex(2)}
          >
            Drafts
          </button>
        </div>
        <div className=" relative   mt-4 overflow-y-auto    w-[100%]    overflow-x-hidden">
          <div
            style={{ left: `-${activeIndex * 100}%` }}
            className=" relative w-[300%]   max-h-[60vh] h-auto   overflow-hidden flex transition-all gap-3 justify-center duration-1000   "
          >
            <Inbox />
            <Outbox />
            <Drafts />
          </div>
        </div>
      </SearchPage>
    </section>
  );
};
const Inbox = () => {
  const nav = useNavigate();
  return <InboxDataTable nav={nav} />;
};
const Outbox = () => {
  const nav = useNavigate();
  return <OutboxDataTable nav={nav} />;
};

const Drafts = () => {
  const nav = useNavigate();
  return <DraftDataTable nav={nav} />;
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
