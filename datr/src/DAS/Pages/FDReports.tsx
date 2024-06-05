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

export const FDReports = () => {
    const { Location } = useParams();
    const [date, setDate] = useState({
      from: new Date(),
      to: null,
    });
    const { axios } = useAxiosClient();
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPages, setMaxPages] = useState(1);
    const reportsQuery=useQuery({
        queryKey:[location,"FDR",`${currentPage}`],
        queryFn:()=>axios(`flight-disruption-reports/terminal?value=${Location}&page=${currentPage}&size=20`).then((resp:any)=>{
            setMaxPages(resp.data.totalPages)
            return resp.data.flightDisruptionReportResponses
        })
    })
    return (
      <section className="w-full max-h-screen overflow-y-auto p-2">
        <SearchPage heading={"Flight Disruption Reports"}>
          <p className="text-[0.8275rem] text-neutral-600 font-semibold">
            Select Range:{" "}
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-60 justify-start text-left font-normal dark:bg-neutral-100 bg-neutral-100 ",
                  !date && "text-muted-foreground"
                )}
              >
                <CiCalendar className="mr-2 h-4 w-4" />
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
            reportsQuery.isFetching?<Skeleton className="w-full h-[40vh]"/>:reportsQuery.isSuccess?<div className="w-full h-[50vh] p-2 overflow-y-auto bg-white rounded-md">
                <GenericDataTable columns={fdrColumnDef} data={reportsQuery.data}/>
            </div>:<></>
         }
        </SearchPage>
      </section>
    );
}
