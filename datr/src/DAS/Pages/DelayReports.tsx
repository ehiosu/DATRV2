import React, { useState } from 'react'
import { SearchPage } from "../../Reusable/SearchPage";
import { useLocation, useParams } from "react-router";
import { format } from "date-fns";
import { CiCalendar } from "react-icons/ci";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CiCircleCheck } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { ReportsTable } from "../../CPD/Components/DataTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import { Skeleton } from "../../components/ui/skeleton";
export const DelayReports = () => {
    const {airline}=useParams()
    const from=new URLSearchParams(document.location.search).get("from")
    const to=new URLSearchParams(document.location.search).get("to")
 const [date, setDate] = useState({
        from: from? new Date(from as string):null,
        to: to?new Date(to as string):null,
      });
      const { axios } = useAxiosClient();
      const [currentPage, setCurrentPage] = useState(1);
  return (
    <section className="w-full max-h-screen overflow-y-auto p-2">
      <SearchPage heading={airline}>
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

        <div className="w-full">
          {!getReportsQuery.isError ? (
            getReportsQuery.isSuccess ? (
              <Accordion type="single" collapsible className="w-full">
                {Object.keys(getReportsQuery.data).map((date) => {
                  return (
                    <AccordionItem className="my-3" value={date}>
                      <AccordionTrigger>{date}</AccordionTrigger>
                      <AccordionContent>
                        <ReportsTable data={getReportsQuery.data[date]} />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              Array.from({ length: 5 })
                .fill(null)
                .map((_, index) => (
                  <Skeleton key={index} className="w-full h-12 my-3" />
                ))
            )
          ) : (
            <p>error</p>
          )}
        </div>
      </SearchPage>
    </section>
  )
}
