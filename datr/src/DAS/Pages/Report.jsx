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
export const Reports = () => {
  const { id, Location } = useParams();
  const [date, setDate] = useState({
    from: new Date(),
    to: null,
  });
  const { axios } = useAxiosClient();
  const [currentPage, setCurrentPage] = useState(1);
  const getReportsQuery = useQuery({
    queryKey: [
      `${location}`,
      `${id}`,
      "reports",
      `from ${date.from.getUTCDate()} to ${
        date.to?.getUTCDate() || date.from.getUTCDate()
      }`,
    ],
    retry: false,
    queryFn: () =>
      axios(
        `data-entries/terminal/airline/sort/range?terminal=${Location}&airline=${id.replace(
          "_",
          "-"
        )}&start-date-of-incidence=${format(
          new Date(date.from),
          "dd-MM-yyyy"
        )}&end-date-of-incidence=${format(
          new Date(date.to || date.from),
          "dd-MM-yyyy"
        )}&page=${currentPage - 1}&size=10`,
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
      <SearchPage heading={id}>
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
  );
};

const IndividualReport = ({ report, index }) => {
  return;
};
