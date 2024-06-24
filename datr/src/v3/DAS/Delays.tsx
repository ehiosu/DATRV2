import { GenericDataTable, flightsColumnDef } from '@/CPD/Components/DataTable'
import React, { useEffect, useState } from 'react'
import { useDelays } from '../hooks/useDelays'
import { useTerminalStore } from '@/store/terminalstore'
import { DateRange } from 'react-day-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon, Download } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'

export const Delays = () => {
  const[currentPage,setCurrentPage]=useState(1)
  const {terminal,date,setDate}=useTerminalStore()
  const [maxPage,setMaxPage]=useState(1)
  const [pageSize,setPageSize]=useState<10|20|30|40>(10)
  const query=useDelays(terminal,date as DateRange,currentPage,pageSize)

  return (
    <section className='w-full px-6 py-2 '>
       <div className="flex items-center w-full justify-between">
       <p className='text-xl font-semibold'>Delays</p>
       <DatePickerWithRange date={date} setDate={setDate}/>
       </div>
        <div className="w-full h-[60vh] overflow-y-auto border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth">
          {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&&   <GenericDataTable downloadExcel DownloadComponent={DownloadReportComponent} tableClassname='' headerClassname='rounded-lg' columns={flightsColumnDef as any} data={Object.values(query.data)} hasFilter={true} showColumnFilter filterColumn={"airline"}/>
          }
        </div>
        {/* <div className='mt-5 flex justify-between items-center'>
          <button className='w-max px-5 py-1.5 text-sm rounded-lg bg-ncBlue text-white'>
            Previous
          </button>
          <button className='px-5 w-max py-1.5 rounded-lg bg-ncBlue text-white text-sm'>
            Next
          </button>
        </div> */}
    </section>
  )
}
interface daterangeProps extends React.HTMLAttributes<HTMLDivElement>{
  date:DateRange|undefined,
  setDate:(date:DateRange|undefined)=>void
}
export function DatePickerWithRange({
  className,
  date,
  setDate
}:daterangeProps ) {
  const fromDate = date?.from ? new Date(date.from) : undefined;
  const toDate = date?.to ? new Date(date.to) : undefined;

  const [localDate, localSetDate] = useState<DateRange | undefined>({
    from: fromDate,
    to: toDate
  });
 useEffect(()=>{
  console.log(localDate)
 },[localDate])
  return (
    <div className={cn("grid gap-2", className)}>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-normal ml-auto dark:bg-ncBlue bg-ncBlue text-white",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {localDate?.from ? (
            localDate.to ? (
              <>
                {format(localDate.from, "LLL dd, y")} -{" "}
                {format(localDate.to, "LLL dd, y")}
              </>
            ) : (
              format(localDate.from, "LLL dd, y")
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
          defaultMonth={localDate?.from ? localDate.from : new Date()}
          selected={localDate}
          onSelect={(value) => {
            localSetDate(value);
            setDate(value);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  </div>
)
}

import ExcelJs from "exceljs";
import { toast } from "sonner";
import { useAuth } from "@/api/useAuth";

const DownloadReportComponent=({data}:{data:any[]})=>{
  const {user}=useAuth()
  const {date}=useTerminalStore()
  const fromDate=format(date?.from? new Date(date?.from) as Date :new Date(),'dd-MM-yyyy')
  const toDate=format(date?.to?new Date(date?.to) as Date:new Date(),'dd-MM-yyyy'||"")
  const tryDownloadReport = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        try{
          const workbook = new ExcelJs.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.creator = `${user.email}-${user.firstName}`;
        workbook.views = [
          {
            x: 0,
            y: 0,
            width: 10000,
            height: 20000,
            firstSheet: 0,
            activeTab: 0,
            visibility: "visible",
          },
        ];
        const sheet=workbook.addWorksheet("Sheet 1")
        sheet.columns=[
          {
            key:"airline",
            header:"Airline",
            width:25,
            style:{
              
              alignment:{
                horizontal:"center",
                vertical:"middle"
              },
              font:{
                size:11
              }
            }
          },
          {
            key:"numberOfDelays",
            header:"Delayed Flights",
            width:25,
            style:{
              alignment:{
                horizontal:"center",
                vertical:"middle"
              },
              font:{
                size:11
              }
            }
          },
          {
            key:"numberOfFlight",
            header:"Total Flights",
            width:25,
            style:{
              alignment:{
                horizontal:"center",
                vertical:"middle"
              },
              font:{
                size:11
              }
            }
          },
          {
            key:"delayLessThanHour",
            header:"Delay 15 minutes - 1Hr",
            width:35,
            style:{
              alignment:{
                horizontal:"center",
                vertical:"middle"
              },
              font:{
                size:11
              }
            }
          },
          {
            key:"delayInBetweenOneAndTwoHour",
            header:"Delay 1Hr - 2Hrs",
            width:35,
            style:{
              alignment:{
                horizontal:"center",
                vertical:"middle"
              },
              font:{
                size:11
              }
            }
          },
          {
            key:"delayGreaterThanTwoHour",
            header:"Delay > 2Hrs",
            width:35,
            style:{
              alignment:{
                horizontal:"center",
                vertical:"middle"
              },
              font:{
                size:11
              }
            }
          },
        ]
        sheet.eachColumnKey((column) => {
          column.eachCell((cell, index) => {
            console.log(cell);
            cell.font = {
              size: 13,
              bold: true,
            };
          });
        });
        data.map((datum)=>{
            sheet.addRow({
              ...datum
              // airline:datum["airline"],
              // numberOfDelays:datum["numberOfDelays"],
              // numberOfFlight:datum["numberOfFlight"]
            })
        })
        workbook.xlsx.writeBuffer().then(function (data) {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = `Delayed Flights-${fromDate}-${toDate}.xlsx`;
          anchor.click();
          window.URL.revokeObjectURL(url);
        });
        }
        catch(err:any){
          reject(err)
        }
      })
    )
  }
  return(
    <button onClick={()=>{tryDownloadReport()}} className="w-36 h-10 rounded-md bg-ncBlue text-white flex items-center justify-center">
      Download <Download className="w-4 h-5 shrink ml-2"/>
    </button>
  )
}
