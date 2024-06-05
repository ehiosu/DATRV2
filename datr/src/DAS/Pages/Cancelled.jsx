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
import {
  cancelledFlightColumnDef,
  cancelledFlightPlaceholderData,
  CancelledFlightsDataTable,
  FlightDataTable,
} from "../../CPD/Components/DataTable";
import { useNavigate, useParams } from "react-router";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useQuery } from "@tanstack/react-query";
export const CancelledFlights = () => {
  const navigate = useNavigate();
  const { Location } = useParams();
  const [date, setDate] = useState({
    from: new Date(),
    to: null,
  });

  const { axios } = useAxiosClient();
  // const getCancelledFlightsQuery=useQuery({
  //   queryKey:[`${Location}`,'flights','cancelled', `from ${date.from.getUTCDate()} to ${date.to?.getUTCDate() || "none"}`,],
  //   queryFn:()=>  axios(
  //     `data-entries/delays?terminal=${Location}&date-of-incidence=${format(
  //       date.from,
  //       "dd-MM-yyyy"
  //     )}`,
  //     {
  //       method: "GET",
  //     }
  //   ).then((resp) => resp.data),
  // })
  return (
    <section className="w-full max-h-screen overflow-y-auto">
      <SearchPage heading={"Cancelled Flights"}>
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
        <CancelledFlightsDataTable
          data={[
            {
              cancelledFlight: 6,
              airline: "Air Peace",
              numberOfFlights: 27,
              reason: "Operational Issues",
            },
            {
              cancelledFlight: 8,
              airline: "Arik Air",
              numberOfFlights: 40,
              reason: "Bad Weather",
            },
            {
              cancelledFlight: 8,
              airline: "Overland Airways",
              numberOfFlights: 23,
              reason: "Technical Difficulties",
            },
            {
              cancelledFlight: 7,
              airline: "Aero Contractors",
              numberOfFlights: 55,
              reason: "Crew Shortage",
            },
            {
              cancelledFlight: 5,
              airline: "Dana Air",
              numberOfFlights: 32,
              reason: "Airspace Restrictions",
            },
            {
              cancelledFlight: 4,
              airline: "Ibom Air",
              numberOfFlights: 28,
              reason: "Unforeseen Circumstances",
            },
            {
              cancelledFlight: 7,
              airline: "United Nigeria",
              numberOfFlights: 12,
              reason: "Maintenance Requirements",
            },
            {
              cancelledFlight: 5,
              airline: "Green Africa Airways",
              numberOfFlights: 19,
              reason: "Pilot Strike",
            },
            {
              cancelledFlight: 7,
              airline: "Max Air",
              numberOfFlights: 19,
              reason: "Low Passenger Numbers",
            },
            {
              cancelledFlight: 4,
              airline: "Arik Air",
              numberOfFlights: 22,
              reason: "Runway Closure",
            },
          ].sort((entrya, entryb) => entrya.airline - entryb.airline)}
        />
      </SearchPage>
    </section>
  );
};
