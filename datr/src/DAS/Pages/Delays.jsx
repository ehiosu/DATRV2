import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
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
import { FlightDataTable } from "../../CPD/Components/DataTable";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import { Skeleton } from "../../components/ui/skeleton";

export const Delays = () => {
  const navigate = useNavigate();
  const { Location } = useParams();
  const [date, setDate] = useState({
    from: new Date(),
    to: null,
  });
  const { axios } = useAxiosClient();

  const navto = (id) => {
    navigate(`/DAS/${Location}/Report/${id}`);
  };
  const getDelayData = useQuery({
    queryKey: [
      `${Location}`,
      "delays",
      `from ${date.from.getUTCDate()} to ${date.to?.getUTCDate() || "none"}`,
    ],
    queryFn: () =>
      axios(
        `data-entries/delays?terminal=${Location}&date-of-incidence=${format(
          date.from,
          "dd-MM-yyyy"
        )}`,
        {
          method: "GET",
        }
      ).then((resp) => resp.data),
  });
  return (
    <section className="w-full max-h-screen overflow-y-auto">
      <SearchPage heading={"Delays"}>
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
        {!getDelayData.isError && getDelayData.isSuccess ? (
          <FlightDataTable
            data={Array.from(
              Object.keys(getDelayData.data).map(
                (key) => getDelayData.data[key]
              )
            )}
          />
        ) : (
          <>
            <Skeleton className="w-full h-12 my-2" />
            <Skeleton className="w-full h-12 my-2" />
            <Skeleton className="w-full h-12 my-2" />
            <Skeleton className="w-full h-12 my-2" />
            <Skeleton className="w-full h-12 my-2" />
          </>
        )}
      </SearchPage>
    </section>
  );
};
