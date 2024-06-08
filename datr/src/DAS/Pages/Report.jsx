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
import { expandedReport } from "../../CPD/data/data";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import { Skeleton } from "../../components/ui/skeleton";
import { useTerminalStore } from "../../store/terminalstore";
import { TerminalSelector } from "../Components/TerminalSelector";
export const Reports = () => {
  const { id } = useParams();
  const { terminal, date, setDate } = useTerminalStore();
  console.log(typeof date.from, typeof date, date, date.from);

  const { axios } = useAxiosClient();
  const [currentPage, setCurrentPage] = useState(1);
  const getReportsQuery = useQuery({
    queryKey: [
      `${terminal}`,
      `${id}`,
      "reports",
      `from ${date.from ? date.from : "none"} to ${date?.to || "none"}`,
    ],
    retry: false,
    queryFn: () =>
      axios(
        `data-entries/terminal/airline/sort/range?terminal=${terminal}&airline=${id.replace(
          "_",
          "-"
        )}&start-date-of-incidence=${format(
          date.from ? new Date(date.from) : new Date(),
          "dd-MM-yyyy"
        )}&end-date-of-incidence=${
          date.to ? format(new Date(date.to), "dd-MM-yyyy") : ""
        }&page=${currentPage - 1}&size=10`,
        {
          method: "GET",
        }
      )
        .then((resp) => resp.data)
        .catch((err) => {
          throw err;
          return err;
        }),
  });
  return (
    <section className="w-full max-h-screen overflow-y-auto p-2">
      <SearchPage
        heading={`${id.replace("_", " ")} Reports`}
        SearchElement={() => <TerminalSelector />}
      >
        <p className="text-[0.8275rem] text-neutral-600 font-semibold">
          Select Range:{" "}
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "min-w-60 max-w-80 justify-start text-left font-normal dark:bg-neutral-100 bg-neutral-100",
                !date && "text-muted-foreground"
              )}
            >
              <CiCalendar className="mr-2 h-4 w-4" />
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
              defaultMonth={new Date(date.from)}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

        <div className="w-full">
          {!getReportsQuery.isError ? (
            getReportsQuery.isSuccess ? (
              // <Accordion type="single" collapsible className="w-full">
              //   {Object.keys(getReportsQuery.data).map((date) => {
              //     return (
              //       <AccordionItem className="my-3" value={date}>
              //         <AccordionTrigger>{date}</AccordionTrigger>
              //         <AccordionContent>

              //         </AccordionContent>
              //       </AccordionItem>
              //     );
              //   })}
              // </Accordion>
              <ReportsTable
                data={
                  getReportsQuery.data[Object.keys(getReportsQuery.data)[0]]
                }
              />
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
  );
};

const IndividualReport = ({ report, index }) => {
  return;
};
