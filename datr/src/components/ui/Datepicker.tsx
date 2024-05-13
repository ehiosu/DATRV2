import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { differenceInDays, format } from "date-fns"
import { Calendar } from "./calendar"
import { MdKeyboardArrowDown } from "react-icons/md";
import { CalendarIcon } from "lucide-react"
import { DateRange, DayPickerMultipleProps, DayPickerRangeProps, DayPickerSingleProps } from "react-day-picker"
import { useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"


export function DatePickerDemo({className,mode}:{className?:string,mode:DayPickerMultipleProps.mode | DayPickerRangeProps.mode | DayPickerSingleProps.mode}) {
    const [date, setDate] = React.useState<Date>()
   
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "gap-1   font-normal",
              !date && "text-muted-foreground",className
            )}
          >
            <CalendarIcon className="w-8 aspect-square mx-1 grid place-items-center" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <MdKeyboardArrowDown/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode={mode}
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }

  export function DateRangePicker({className,date,setDate,setCurrentPage}:{className?:string,date:DateRange,setDate:React.Dispatch<React.SetStateAction<DateRange|undefined>>,setCurrentPage:React.Dispatch<React.SetStateAction<number>>}) {
    const nav=useNavigate();
    const client=useQueryClient();
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "gap-1   font-normal",
              !date && "text-muted-foreground",className
            )}
          >
            <CalendarIcon className="w-8 aspect-square mx-1 grid place-items-center" /><p className="text-sm">
            {date.to ? `Showing ${differenceInDays(date.to as Date,date.from)} days of Data` :date.from?format(date.from,'LLL dd, y'): <span>Pick a date</span>}</p>
            <MdKeyboardArrowDown/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
             initialFocus
             mode="range"
             defaultMonth={date?.from}
             selected={date}
             onSelect={(range:DateRange)=>{
              if(range.to){
              setCurrentPage(0);
              nav(`${window.location.pathname}?from=${format(range.from,'dd-MM-yyyy')}&to=${format(range.to,'dd-MM-yyyy')}`,{replace:true})
              }
              setDate(range)
             }}
             numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    )
  }