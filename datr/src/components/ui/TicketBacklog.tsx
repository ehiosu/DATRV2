import React, { useEffect, useState } from "react";
import { ViewChanger, view } from "./ViewChanger";
import {
  GenericDataTable,
  ticketBacklogColumnDef,
} from "@/CPD/Components/DataTable";
import { Select, SelectTrigger, SelectValue,SelectContent,SelectItem } from "./select";
import { Bar } from "react-chartjs-2";

export const TicketBacklog = ({terminals}:{terminals:any[]}) => {
  const [view, setView] = useState<view>("Table");
  return (
    <section className="w-full h-full  p-3 overflow-y-auto">
      <div className="flex ">
        <p className="font-semibold">Ticket Backlog</p>
        <ViewChanger
          className="ml-auto rounded-sm w-7 h-7"
          view="Table"
          currentView={view}
          setView={setView}
        />
        <ViewChanger
          className="ml-2 rounded-sm w-7 h-7"
          view="Bar"
          currentView={view}
          setView={setView}
        />
       
      </div>
      <Select  >
          <SelectTrigger
            disabled={!terminals}
            className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
          >
            <SelectValue placeholder="Select A Terminal" />
          </SelectTrigger>
          {terminals.length>0 && (
            <SelectContent>
              <SelectItem value="All">
                All
              </SelectItem>
              {terminals.map((terminal: any) => (
                <SelectItem value={terminal.name}>
                  {terminal.name}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>
      {view === "Table" && (
        <div className="flex-1">
          <GenericDataTable
            columns={ticketBacklogColumnDef}
            data={[
              {
                airline: "Air Peace",
                activeTickets: "20",
                unresolvedTickets: "3",
                total: "39",
              },
              {
                airline: "Dana Air",
                activeTickets: "32",
                unresolvedTickets: "12",
                total: "39",
              },
              {
                airline: "Max Air",
                activeTickets: "12",
                unresolvedTickets: "7",
                total: "39",
              },
              {
                airline: "Arik Air",
                activeTickets: "47",
                unresolvedTickets: "17",
                total: "39",
              },
            ]}
          />
        </div>
      )}
      {view === "Bar" && (
        <BarChart
          data={[
            {
              airline: "Air Peace",
              activeTickets: "20",
              unresolvedTickets: "3",
              total: "39",
            },
            {
              airline: "Dana Air",
              activeTickets: "32",
              unresolvedTickets: "12",
              total: "39",
            },
            {
              airline: "Max Air",
              activeTickets: "12",
              unresolvedTickets: "7",
              total: "39",
            },
            {
              airline: "Arik Air",
              activeTickets: "47",
              unresolvedTickets: "17",
              total: "39",
            },
          ]}
        />
      )}
    </section>
  );
};
import {
  Chart as ChartJs,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJs.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);
const BarChart = ({ data }: { data: any[] }) => {
  const [dataSet, setDataSet] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const options = {
    plugins: {},

    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: false,
        grid: {
          display: false,
        },
      },
    },
  };
  let bardata = {
    labels,
    datasets: dataSet,
  };
  useEffect(() => {
    const _airlines = data.map((datum: any) => datum.airline);
    // const _data=data.map((datum:any)=>parseInt(datum.unresolvedTickets))
    let _dataset = [
      {
        label: "Active Tickets",
        data: [],
        backgroundColor: "#a9def9",
        borderWidth: 1,
        barThickness: 28,
        borderRadius: 40,
      },
      {
        label: "Unresolved Tickets",
        data: [],
        backgroundColor: "#00f5d4",
        borderWidth: 1,
        barThickness: 28,
        borderRadius: 40,
      },
    ];
    _airlines.map((airline: any, index: any) => {
      _dataset[0].data.push(data[index].activeTickets);
      _dataset[1].data.push(data[index].unresolvedTickets);
    });
    setLabels(_airlines);
    setDataSet(_dataset);
  }, []);
  return (
    <div className="w-full h-[40vh]">
      <Bar options={options} data={bardata} />
    </div>
  );
};
