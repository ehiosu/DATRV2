import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { AiOutlinePlus } from "react-icons/ai";
import { DashboardStats, TicketStatistics } from "../Components/DashboardStats";
import { DashboardPerformanceGraph } from "../Components/DashboardPerformanceGraph";
import { RecentTickets } from "../Components/RecentTickets";
import { useNavigate } from "react-router";
import { useAuth } from "../../api/useAuth";
import { DGAirlinePerformance } from "../Components/DGairlinePerformance";
import { DGFlightReports } from "../Components/DGFlightReports";
import { DonutChart } from "../Components/DonutChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useQuery } from "@tanstack/react-query";
import { TicketBacklog } from "../../components/ui/TicketBacklog";
import { DisruptionLeaders } from "../../components/ui/DisruptionLeaders";
export const Dashboard = () => {
  const { user } = useAuth();
  if (user.roles[user.roles.length - 1] === "DGO") return <DGDashboard />;
  return (
    <section className=" w-full  p-4 lg:p-2 max-h-screen overflow-y-auto">
      <SearchPage heading={"CPD Dashboard"}>
        <TicketButton />
        <FDRButton />
        <DashboardStats />
        <DashboardPerformanceGraph />
        <div className="flex  flex-wrap md:gap-0 ">
          <div className="md:w-[60%] w-full   min-w-[320px]  max-h-full md:mt-0 mt-3 flex-grow   ">
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

const FDRButton = () => {
  const { user } = useAuth();
  const Nav = useNavigate();
  if (user.roles[user.roles.length - 1] !== "AIRLINE") return <></>;
  return (
    <div className="w-60 h-10 lg:w-80 lg:h-[3.6rem]  flex  justify-between items-center  bg-white  rounded-lg  shadow-md p-2">
      {}
      <p className="text-[1.2rem]  font-semibold ">Flight Disruption Report</p>
      <button
        className="text-white rounded-full h-full aspect-square focus:bg-lightPink  bg-darkBlue grid  place-items-center  text-[1.2rem] hover:bg-lightPink transition-all hover:scale-110"
        onClick={() => {
          Nav("/CPD/New-FDR");
        }}
      >
        <AiOutlinePlus />
      </button>
    </div>
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
import { Skeleton } from "../../components/ui/skeleton";
import { OnTimePerformanceMetric } from "../../components/ui/OnTimePerformanceMetric";
import { ResolutionLeaders } from "../../components/ui/MostResponsiveAirlines";
import { getRanHex } from "../../lib/utils";
const DGDashboard = () => {
  const { axios } = useAxiosClient();
  const activeAirlinesQuery = useQuery({
    queryKey: ["airlines", "all"],
    queryFn: () =>
      axios("airlines/active", {
        method: "GET",
      }).then((resp) => resp.data),
  });

  const activeTerminalsQuery = useQuery({
    queryKey: ["terminals", "all"],
    queryFn: () =>
      axios("terminals/active", {
        method: "GET",
      }).then((resp) => resp.data),
  });
  return (
    <section className=" w-full  p-4 lg:p-2 max-h-screen overflow-y-auto">
      <SearchPage heading={"Dashboard"}>
        <DashboardStats />
        {activeAirlinesQuery.isFetching && activeTerminalsQuery.isFetching ? (
          <>
            <Skeleton className="w-full h-[50vh] my-2" />
            <Skeleton className="w-full h-[50vh] my-2" />
            <div className="flex items-center">
              <Skeleton className="w-[45%] mx-auto h-[20vh] my-2" />
              <Skeleton className="w-[45%] mx-auto h-[20vh] my-2" />
            </div>
            <Skeleton className="w-full h-[30vh] " />
          </>
        ) : (
          activeAirlinesQuery.isSuccess &&
          activeTerminalsQuery.isSuccess && (
            <>
              {" "}
              <div className="flex flex-wrap gap-x-2">
                <DGAirlinePerformance
                  airlines={activeAirlinesQuery.data}
                  terminals={activeTerminalsQuery.data}
                />
                <DGFlightReports
                  airlines={activeAirlinesQuery.data}
                  terminals={activeTerminalsQuery.data}
                />
              </div>
              <div className="flex flex-wrap gap-x-4 flex-row gap-y-4">
                <div className="w-full    md:w-[60%] bg-white shadow-sm rounded-lg  oveflow-y-auto">
                  <TicketBacklog terminals={activeTerminalsQuery.data} />
                </div>

                <div className="w-[48%] lg:w-[38%] min-w-[400px] rounded-lg lg:h-[50vh] bg-white p-2 shadow-md">
                  <p className="md:text-xl text-lg font-semibold">
                    Disruption Breakdown by Terminal
                  </p>
                  <Select>
                    <SelectTrigger className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none ml-auto">
                      <SelectValue placeholder="Select A Terminal" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTerminalsQuery.data.map((terminal) => (
                        <SelectItem value={terminal.name}>
                          {terminal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <DonutChart
                    className={
                      "w-full h-full bg-transparent shadow-none md:w-full min-h-[30vh]"
                    }
                    data={[279, 121, 40]}
                    labels={[
                      "On Time Flights",
                      "Delayed Flights",
                      "Cacncelled Flights",
                    ]}
                    colors={["#1768ac", "#ff99c8", "#8093f1"]}
                  />
                </div>

                <div className="w-[48%] min-w-[400px] rounded-lg h-[44vh]   p-2 ">
                  <ComplaintTypePie terminals={activeTerminalsQuery.data} />
                </div>
                <div className="w-full h-[42vh]   md:w-[50%] bg-white shadow-sm rounded-lg  oveflow-y-auto">
                  <OnTimePerformanceMetric />
                </div>
                <div className="w-[48%] min-w-[400px] h-[50vh] bg-white rounded-md shadow-sm p-2">
                  <DisruptionLeaders terminals={activeTerminalsQuery.data} />
                </div>
                <div className="min-w-[400px] md:w-[48%] md:ml-auto h-[50vh] bg-white rounded-md shadow-sm p-2">
                  <ResolutionLeaders terminals={activeTerminalsQuery.data} />
                </div>
              </div>
            </>
          )
        )}
      </SearchPage>
    </section>
  );
};

const ComplaintTypePie = ({ terminals = [] }) => {
  const { axios } = useAxiosClient();
  const airlineComplaintTypeCountQuery = useQuery({
    queryKey: ["complaint", "count"],
    queryFn: () =>
      axios("tickets/counts/by-complaint-types").then((resp) => ({
        labels: Object.keys(resp.data),
        dataset: Object.values(resp.data),
      })),
  });
  if (airlineComplaintTypeCountQuery.isFetching)
    return <Skeleton className="w-full h-full" />;
  if (airlineComplaintTypeCountQuery.isSuccess)
    //todo add table
    return (
      <div className="w-full h-full bg-white p-2 shadow-sm rounded-lg">
        <p className="md:text-xl text-lg font-semibold">Complaint Breakdown</p>
        <Select defaultValue="All">
          <SelectTrigger
            disabled={!terminals}
            className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
          >
            <SelectValue placeholder="Select A Terminal" />
          </SelectTrigger>
          {terminals.length > 0 && (
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {terminals.map((terminal) => (
                <SelectItem value={terminal.name}>{terminal.name}</SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>

        <DonutChart
          className={"w-full  bg-transparent shadow-none md:w-full "}
          data={airlineComplaintTypeCountQuery.data.dataset}
          labels={airlineComplaintTypeCountQuery.data.labels}
          colors={airlineComplaintTypeCountQuery.data.labels.map((label) =>
            getRanHex()
          )}
        />
      </div>
    );
  return <></>;
};
