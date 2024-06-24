import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { useParams } from "react-router";
import { format } from "date-fns";
import { CiCalendar } from "react-icons/ci";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CiCircleCheck } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { GenericDataTable, ReportsTable, fdrColumnDef } from "../../CPD/Components/DataTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import { Skeleton } from "../../components/ui/skeleton";
import { PaginationEllipsis } from "@/components/ui/pagination";
import { useTerminalStore } from "@/store/terminalstore";
import {TerminalSelector} from "../Components/TerminalSelector.jsx"
export const FDReports = () => {
    const {terminal,date,setDate}=useTerminalStore()
    
    const { axios } = useAxiosClient();
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPages, setMaxPages] = useState(1);
    const reportsQuery=useQuery({
        queryKey:[terminal,"FDR",`${currentPage}`],
        queryFn:()=>axios(`flight-disruption-reports/terminal?value=${terminal}&page=${currentPage}&size=20`).then((resp:any)=>{
            setMaxPages(resp.data.totalPages)
            return resp.data.flightDisruptionReportResponses
        })
    })
    return (
      <section className="w-full max-h-screen overflow-y-auto p-2">
        <SearchPage heading={"Flight Disruption Reports"} SearchElement={()=><TerminalSelector/>} >
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
          {
            reportsQuery.isSuccess&&  <div className="flex items-center space-x-2 mx-2">
            <Button
              disabled={currentPage === 0}
              className="hover:bg-slate-100 h-8 px-2 dark:hover:bg-slate-200"
              onClick={() => {
                setCurrentPage((state) => state - 1);
              }}
            >
              Previous
            </Button>
            {currentPage === 0 ? (
              <PaginationEllipsis className="mt-1" />
            ) : (
              <>
                <Button
                  className="hover:bg-slate-200 h-8 px-2 dark:hover:bg-slate-200"
                  onClick={() => {
                    setCurrentPage(0);
                  }}
                >
                  1
                </Button>
                {currentPage + 1 < maxPages && currentPage !== 0 && (
                  <PaginationEllipsis className="mt-1" />
                )}
                <Button
                  className={`${
                    currentPage + 1 === maxPages
                      ? "bg-slate-200 dark:bg-slate-300 h-8 px-2"
                      : "hover:bg-slate-200 h-8 px-2 dark:hover:bg-slate-200"
                  }  cursor-default`}
                >
                  {currentPage + 1}
                </Button>
                {/* {currentPage + 1 !== maxPages && (
                  <PaginationEllipsis className="mt-1" />
                )} */}
              </>
            )}
            <Button
              onClick={() => {
                setCurrentPage((state) => state + 1);
              }}
              className="hover:bg-slate-200 h-8 px-2 dark:hover:bg-slate-200"
              disabled={currentPage + 1 === maxPages}
            >
              Next
            </Button>
          </div>
          }
  
         {
            reportsQuery.isFetching?<Skeleton className="w-full h-[40vh]"/>:reportsQuery.isSuccess?<div className=" max-h-[50vh] p-2 overflow-y-auto bg-white rounded-md max-w-[50vh]">
                <GenericDataTable columns={fdrColumnDef} data={reportsQuery.data}/>
            </div>:<></>
         }
        </SearchPage>
      </section>
    );
}
