import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTerminal } from "@/v3/hooks/useTerminal";
import { ArrowLeft, ArrowLeftCircle } from "lucide-react";

import React, { useState } from "react";

import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJs.register(ArcElement, Tooltip, Legend, ChartDataLabels);
export const DisruptionBreakdown = () => {
  const [selectedTerminal, setSelectedTerminal] = useState("ALL");
  const { data, isSuccess } = useTerminal();
  const [currentPage, setCurrentPage] = useState(1);
  const chartData: any = {
    labels: ["Cancelled Flight", "Delayed Flights", "On Time Flights"],
    datasets: [
      {
        label: [],
        data: [27, 11, 35,],
        backgroundColor: ["#00A3E0", "#7D91F0", "#1464AA"],
      },
    ],
  };
  const options: any = {
    plugins: {
      datalabels: {
        display: true,
        align: "bottom",
        backgroundColor: "#01054C",
        color:"#FFF",
        borderRadius: 3,
        font: {
          size: 14,
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col xl:p-3">
      <div className="flex items-center flex-wrap gap-x-4">
        <p className="text-[500] text-lg">Flight Operations Breakdown</p>
      </div>
      <div className="flex items-center ">
        <Select value={selectedTerminal} onValueChange={setSelectedTerminal}>
          <SelectTrigger
            className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none "
            disabled={!isSuccess}
          >
            <SelectValue placeholder="Select A terminal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            {isSuccess &&
              data.map((terminal: any) => (
                <SelectItem value={terminal.name}>{terminal.name}</SelectItem>
              ))}
          </SelectContent>
        </Select>
       
      </div>
      <div className="h-[80%]  w-full flex items-center justify-center max-h-[80%]">
        <Doughnut options={options} data={chartData} />
      </div>
    </div>
  );
};
