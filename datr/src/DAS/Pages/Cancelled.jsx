import React, { useState } from 'react'
import { SearchPage } from '../../Reusable/SearchPage'
import {  format } from "date-fns"
import { CiCalendar } from "react-icons/ci";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cancelledFlightColumnDef, cancelledFlightPlaceholderData, FlightDataTable } from '../../CPD/Components/DataTable'
import { useNavigate, useParams } from 'react-router';
export const CancelledFlights = () => {
    const navigate=useNavigate()
    const {Location}=useParams()
    const [date,setDate]=useState({
        from:new Date(),
        to:null
    })
    const navto=(id)=>{
        console.log(id)
        navigate(`/DAS/${Location}/Report/${id}`)
    }
  return (
    <section className="w-full max-h-screen overflow-y-auto">
    <SearchPage heading={'Cancelled Flights'}>
        <p className='text-[0.8275rem] text-neutral-600 font-semibold'>Select Range: </p>
    <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-60 justify-start text-left font-normal",
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
      <FlightDataTable data={cancelledFlightPlaceholderData} columns={cancelledFlightColumnDef} nav={navto}/>
    </SearchPage>
    </section>
  )
}
