import React from "react";
import { statData } from "../data/data";
import { PiWarningCircle } from "react-icons/pi";
import ReactApexChart from "react-apexcharts";
import { cn } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import { Skeleton } from "../../components/ui/skeleton";
import { useNavigate } from "react-router";
import { useAuth } from "../../api/useAuth";
const colors = ["#00CCF2", "#FF007C"];
export const DashboardStats = () => {
  const { axios } = useAxiosClient();
  const { user } = useAuth();
  const isAirline = user.roles.includes("AIRLINE");
  const nav = useNavigate();
  const newTicketQuery = useQuery({
    queryKey: ["dashboard", "tickets", "new"],
    queryFn: () =>
      axios(
        isAirline
          ? "tickets/airline/status?value=NEW&page=0&size=10"
          : "tickets/status?value=NEW"
      ).then((resp) => resp.data.totalElements),
  });
  const resolvedTickets = useQuery({
    queryKey: ["dashboard", "tickets", "resolved"],
    queryFn: () =>
      axios(
        isAirline
          ? "tickets/airline/status?value=RESOLVED&page=0&size=10"
          : "tickets/status?value=RESOLVED"
      ).then((resp) => resp.data.totalElements),
  });
  const openTickets = useQuery({
    queryKey: ["dashboard", "tickets", "open"],
    queryFn: () =>
      axios(
        isAirline
          ? "tickets/airline/status?value=OPENED&page=0&size=10"
          : "tickets/status?value=OPENED"
      ).then((resp) => resp.data.totalElements),
  });
  return (
    <div className="flex  gap-4 justify-evenly  my-2  items-center  flex-wrap">
      {!newTicketQuery.isError && newTicketQuery.isSuccess ? (
        <StatCard
          title={"New Tickets"}
          figure={newTicketQuery.data}
          onClick={() => {
            nav("/CPD/Tickets/All");
          }}
        />
      ) : (
        <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
      )}
      {!resolvedTickets.isError && resolvedTickets.isSuccess ? (
        <StatCard
          title={"Resolved Tickets"}
          figure={resolvedTickets.data}
          onClick={() => {
            nav("/CPD/Tickets/Resolved");
          }}
        />
      ) : (
        <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
      )}
      {!openTickets.isError && openTickets.isSuccess ? (
        <StatCard
          title={"Open Tickets"}
          figure={openTickets.data}
          onClick={() => {
            nav("/CPD/Tickets/Open");
          }}
        />
      ) : (
        <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
      )}
    </div>
  );
};

export const StatCard = ({
  figure,
  title,
  className,
  onClick = () => {},
  showTotal = true,
}) => {
  const nav = useNavigate();
  return (
    <div
      role={showTotal ? "button" : ""}
      className={cn(
        "md:w-40 w-32 aspect-square  rounded-lg   flex    flex-col    items-center bg-white   shadow-md p-2      ",
        className
      )}
      onClick={() => {
        onClick();
      }}
    >
      <div className="h-full  flex flex-col justify-center items-center w-full ">
        <p className=" text-[1.2rem]  md:text-[1.6rem]  font-semibold ">
          {figure}
        </p>
        <p className="font-thin  text-neutral-600  text-[0.75rem] md:text-[0.8275rem] text-center">
          {title}
        </p>
      </div>
    </div>
  );
};

export const TicketStatistics = () => {
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "40%",
        barWidht: "20%",
      },
    },
    xaxis: {
      categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],

      axisTicks: {
        show: false, // Set to false to hide x-axis ticks
      },
      axisBorder: {
        show: false, // Set to false to hide x-axis border
      },
      tooltip: {
        enabled: false, // Set to false to hide x-axis tooltip
      },
      grid: {
        show: false, // Set to false to hide x-axis grid lines
      },
    },
    yaxis: {
      axisTicks: {
        show: false, // Set to false to hide x-axis ticks
      },
      axisBorder: {
        show: false, // Set to false to hide x-axis border
      },
      tooltip: {
        enabled: false, // Set to false to hide x-axis tooltip
      },
      grid: {
        show: false, // Set to false to hide x-axis grid lines
      },
    },
    grid: {
      show: false, // Set to false to hide x-axis grid lines
    },
    colors,

    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const colors = ["#00CCF2", "#FF007C"];
        // TODO:fix hover tooltip
        // console.log(w.config.colors[seriesIndex]);
        const dataName = w.globals.seriesNames[seriesIndex];
        return `<div class="w-36 text-center h-8 p-1 aspect-square text-white bg-[\`${w.config.colors[seriesIndex]}\`]" ><p className='w-max h-max'>${dataName}: ${series[seriesIndex][dataPointIndex]}</p></div>`;
      },
    },
  };

  const chartSeries = [
    {
      name: "Assigned",
      data: [44, 55, 41, 64, 32],
    },
    {
      name: "Unassigned",
      data: [53, 32, 33, 52, 69],
    },
  ];
  return (
    <div className="w-full h-full   bg-white   rounded-md   shadow-md   p-3">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={"95%"}
      />
    </div>
  );
};
