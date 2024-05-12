import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AirlineReportsDataTable } from "../Components/DataTable";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { format } from "date-fns";
export const AirlineResolutionTable = () => {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%] space-y-8 mx-auto max-h-[80vh] md:overflow-y-auto p-2"
      >
        <div className="flex flex-col space-y-2 my-2">
          <p className="text-sm font-semibold ">Time Range</p>
          <div className="w-32">
            <DatePicker className={""} />
          </div>
        </div>
        <div className=" flex flex-col  space-y-2 bg-white rounded-lg shadow-lg">
          <AirlineReportsDataTable
            data={[
              {
                airline: "Air Peace",
                numberOfComplaints: "42",
                numberOfResolvedComplaints: "37",
                resolutionRating: "4.4",
              },
              {
                airline: "Ibom Air",
                numberOfComplaints: "23",
                numberOfResolvedComplaints: "16",
                resolutionRating: "3.48",
              },
              {
                airline: "Arik Air",
                numberOfComplaints: "61",
                numberOfResolvedComplaints: "45",
                resolutionRating: "3.69",
              },
              {
                airline: "Dana Air",
                numberOfComplaints: "26",
                numberOfResolvedComplaints: "22",
                resolutionRating: "4.23",
              },
            ]}
          />
        </div>
        <div className="w-full  h-[60vh] shadow-md rounded-md bg-white p-3 flex flex-col space-y-2">
          <p className="font-semibold text-[1.2rem]">Response Time / Airline</p>
          <AirlineResolutionGraph />
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

const DatePicker = ({ className }) => {
  const [date, setDate] = useState({
    from: new Date(),
    to: null,
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal transition border-transparent hover:shadow-md hover:ring-2 hover:ring-blue-400 dark:border-transparent dark:bg-neutral-100 bg-neutral-100 hover:dark:bg-neutral-200 hover:dark:text-black hover:bg-neutral-200 hover:text-black",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select a Time Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            classNames={{
              day_selected: "dark:bg-slate-300 bg-slate-300 text-black",
            }}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
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
import { Bar } from "react-chartjs-2";
ChartJs.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);
const barChartColorOptions = [
  "#2CA58D",
  "#0A2342",
  "#FFFDF7",
  "#F46197",
  "#FDECEF",
  "#9D6381",
  "#6610F2",
  "#1A8FE3",
  "#6CD4FF",
  "#8B80F9",
  "#CFBFF7",
  "#5AA9E6",
  "#7FC8F8",
  "#F9F9F9",
  "#FFE45E",
  "#FF6392",
  "#BCF4DE",
  "#EEC6CA",
  "#FFB7C3",
  "#416788",
  "#7389AE",
  "#81D2C7",
  "#B5BAD0",
  "#B5BAD0",
  "#2AFC98",
  "#214F4B",
  "#16C172",
  "#2DE1FC",
  "#F2E3BC",
];
const AirlineResolutionGraph = () => {
  const getRanHex = () => {
    return barChartColorOptions[
      Math.floor(Math.random() * barChartColorOptions.length)
    ];
  };
  const data = {
    labels: ["April", "May", "June", "July"],
    datasets: [
      {
        label: "Arik Air",
        data: [12, 25, 27, 32],
        backgroundColor: getRanHex(6),
        borderWidth: 1,
        barThickness: 28,
        borderRadius: 40,
      },
      {
        label: "Ibom Air",
        data: [22, 13, 39, 12],
        backgroundColor: getRanHex(6),
        borderWidth: 1,
        barThickness: 28,
        borderRadius: 22,
      },
      {
        label: "Arik Air",
        data: [47, 25, 40, 27],
        backgroundColor: getRanHex(6),
        borderWidth: 1,
        barThickness: 28,
        borderRadius: 22,
      },
    ],
  };
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            return label + `: ${context.parsed.y} Minutes`;
          },
        },
      },
    },

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
  return (
    <div className="h-full w-full flex flex-row items-center justify-center">
      <Bar data={data} options={options} className="h-[80%]" />
    </div>
  );
};
