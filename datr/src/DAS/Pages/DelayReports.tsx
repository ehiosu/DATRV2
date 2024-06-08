import React, { useState } from 'react'
import { SearchPage } from "../../Reusable/SearchPage";
import { useLocation, useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { CiCalendar } from "react-icons/ci";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import {TerminalSelector} from "../Components/TerminalSelector.jsx"
import { Skeleton } from "../../components/ui/skeleton";
import { useTerminalStore } from '@/store/terminalstore';
import { ArrowLeft, Download } from 'lucide-react';
import { DelayReportsTable } from '@/CPD/Components/DataTable.js';
export const DelayReports = () => {
    const {airline}=useParams()
    const {terminal,date,setDate}=useTerminalStore()
    const { axios } = useAxiosClient();
    const [currentPage, setCurrentPage] = useState(1);
    const nav=useNavigate()
  return (
    <section className="w-full max-h-screen overflow-y-auto p-2 relative">
      <div onClick={()=>nav(-1)} role='button' className="absolute left-2 top-2 w-6 rounded-bl-md aspect-square bg-white  grid place-items-center">
        <ArrowLeft className="w-4 h-4 shrink"/>
      </div>
      <SearchPage heading={`Delays for ${airline?.replace("_"," ")}`} SearchElement={()=><TerminalSelector/>}>
        <p className="text-[0.8275rem] text-neutral-600 font-semibold">
          Select Range:{" "}
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "min-w-60 max-w-80 justify-start text-left font-normal dark:hover:bg-ncBlue hover:bg-ncBlue dark:bg-neutral-100 bg-neutral-100 ",
                !date && "text-muted-foreground"
              )}
            >
              <CiCalendar className=" h-5 w-5 shrink mr-2" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(new Date(date.from), "LLL dd, y")} -{" "}
                    {format(new Date(date.to), "LLL dd, y")}
                  </>
                ) : (
                  format(new Date(date.from), "LLL dd, y")
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
              defaultMonth={date.from || new Date()}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
        <button className="px-4 bg-ncBlue text-sm text-white w-max flex items-center justify-center h-8 rounded-lg hover:ring-2 hover:ring-offset-4 hover:ring-blue-400 transition-all hover:font-semibold my-2">
          Download All Reports <Download  className='w-4 h-4 shrink ml-2'/>
        </button>
        <div className="w-full">
         <DelayReportsTable data={[]} />
        </div>
      </SearchPage>
    </section>
  )
}
