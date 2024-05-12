import React from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { AiOutlinePlus } from "react-icons/ai";
import { DashboardStats, TicketStatistics } from "../Components/DashboardStats";
import { DashboardPerformanceGraph } from "../Components/DashboardPerformanceGraph";
import { RecentTickets } from "../Components/RecentTickets";
import { useNavigate } from "react-router";
import { useAuth } from "../../api/useAuth";
export const Dashboard = () => {
  const { user } = useAuth();
  return (
    <section className=" w-full  p-4 lg:p-2 max-h-screen overflow-y-auto">
      <SearchPage heading={"CPD Dashboard"}>
        <TicketButton />
        <DashboardStats />
        <DashboardPerformanceGraph />
        <div className="flex  md:max-h-[60vh]  flex-wrap md:gap-0 ">
          <div className="md:w-[60%] w-full  h-full min-w-[320px]  max-h-full md:mt-0 mt-3 flex-grow ">
            <RecentTickets />
          </div>
          {!user.roles.includes("AIRLINE") && (
            <div className=" w-full md:w-[40%] lg:p-3 min-w-[320px] flex-grow  md:my-0 my-2 h-[45vh]   md:h-[300px]">
              <TicketStatistics />
            </div>
          )}
        </div>
      </SearchPage>
    </section>
  );
};

const TicketButton = () => {
  const { user } = useAuth();
  const Nav = useNavigate();
  if (!user.roles.includes("CPO") && !user.roles.includes("ADMIN"))
    return <></>;
  return (
    <div className="w-60 h-10 lg:w-72 lg:h-[3.6rem]  flex  justify-between items-center  bg-white  rounded-lg  shadow-md p-2">
      <p className="text-[1.2rem]  font-semibold ">Create Ticket</p>
      <button
        className="text-white rounded-full h-full aspect-square focus:bg-lightPink  bg-darkBlue grid  place-items-center  text-[1.2rem] hover:bg-lightPink transition-all hover:scale-110"
        onClick={() => {
          Nav("/CPD/New-Ticket");
        }}
      >
        <AiOutlinePlus />
      </button>
    </div>
  );
};
