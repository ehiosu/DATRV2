import React, { useState } from 'react'
import { SearchPage } from '../../Reusable/SearchPage'
import { useParams } from 'react-router'
import {  format } from "date-fns"
import { CiCalendar } from "react-icons/ci";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CiCircleCheck } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import {ReportsTable} from '../../CPD/Components/DataTable'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { expandedReport } from '../../CPD/data/data';
export const Reports = () => {
    const {id}=useParams()
    const [date,setDate]=useState({
        from:new Date(),
        to:null
    })
  return (
    <section className='w-full max-h-screen overflow-y-auto p-2'>
        <SearchPage heading={id}>
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

      <div className="w-full">
       <Accordion type="single" collapsible className="w-full">
        {
            expandedReport.map((report)=>{
                return  <AccordionItem className='my-3' value={report.date}>
                <AccordionTrigger>{report.date}</AccordionTrigger>
                <AccordionContent >
                    <ReportsTable data={report.data}/>
                </AccordionContent>
            </AccordionItem>
            })
        }
       </Accordion>
      </div>
        </SearchPage>
    </section>
  )
}

const IndividualReport=({report,index})=>{
    return
}
