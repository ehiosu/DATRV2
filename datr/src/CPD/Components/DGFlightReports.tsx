import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {useAxiosClient} from "@/api/useAxiosClient"
import { cn, getRanHex } from "@/lib/utils";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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
export const DGFlightReports = ({airlines,terminals}:{airlines:any[],terminals:any[]}) => {
    const [date,setDate]=useState<DateRange|undefined>({
        from:new Date(),
        to:undefined
    })

    const [selectedAirline,setSelectedAirline]=useState("")
  const [selectedTerminal, setSelectedTerminal] = useState("");

    const data = {
      labels:["Air Peace","Max Air","Dana Air","Arik Air","Aero Contractors"],
        datasets: [
          {
            label: "Cancelled Flights",
            data: selectedAirline&& true ?[
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
                
            ]:[],
            backgroundColor: "#d90429",
            borderWidth: 1,
            barThickness: 28,
            borderRadius: 40,
          },
          {
            label: "On Time Flights",
            data: selectedAirline&& true ?[
                Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),

            ]:[],
            backgroundColor: "#006d77",
            borderWidth: 1,
            barThickness: 28,
            borderRadius: 40,
          },
          {
            label: "Delayed Flights",
            data: selectedAirline&& true ?[
                Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),
              Math.floor(  Math.random()*100),

            ]:[],
            backgroundColor: "#ffd60a",
            borderWidth: 1,
            barThickness: 28,
            borderRadius: 40,
          },
       
        ],
      };
      const options = {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                return label + `: ${context.parsed.y}`;
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
    <div className="md:w-[48%] md:mt-0 w-full min-w-[400px] h-[70vh] bg-white rounded-md p-3 flex flex-col shadow-md mt-4 md:ml-auto">
        <p className="text-xl font-semibold">
            Airline Flight Report
        </p>
      <div className="flex items-center justify-end">
      <Select value={selectedAirline} onValueChange={setSelectedAirline}>
          <SelectTrigger
            disabled={!terminals}
            className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
          >
            <SelectValue placeholder="Select A Terminal" />
          </SelectTrigger>
         
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
          
        </Select>
      </div>
      
      <div className="flex items-center justify-end">
     <DatePicker className="dark:bg-white bg-white mt-2" date={date} setDate={setDate}/>
      </div>
     <div className="h-[65%] w-full flex items-center justify-center">
     <Bar data={data} options={options}/>
     </div>
    </div>
  );
};
const DatePicker = ({
    className,
    date,
    setDate,
  }: {
    className?: string;
    date: DateRange | undefined;
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  }) => {
    return (
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal dark:bg-white bg-white hover:bg-slate-100 dark:hover:bg-slate-100 hover:text-black dark:hover:text-black",
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
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };