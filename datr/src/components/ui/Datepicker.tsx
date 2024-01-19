import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "./calendar"
import { MdKeyboardArrowDown } from "react-icons/md";
import { CalendarIcon } from "lucide-react"

export function DatePickerDemo({className}:{className?:string}) {
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
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }