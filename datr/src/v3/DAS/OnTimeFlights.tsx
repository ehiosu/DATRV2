import React, { useState } from "react";
import { DatePickerWithRange } from "./Delays";
import { useTerminalStore } from "@/store/terminalstore";
import { useOnTime } from "../hooks/useOnTime";
import { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { GenericDataTable, onTimeFlightsColumnDef } from "@/CPD/Components/DataTable";
import { Download } from "lucide-react";

export const OnTimeFlights = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { terminal, date, setDate } = useTerminalStore();
  const [maxPage, setMaxPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 30 | 40>(10);
  const query = useOnTime(terminal,date as DateRange,currentPage,pageSize)
  return (
    <section className="w-full px-6 py-2 ">
      <div className="flex items-center w-full justify-between">
        <p className="text-xl font-semibold">On Time Flights</p>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>
      <div className="w-full h-[60vh] overflow-y-auto border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth">
          {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&&   <GenericDataTable DownloadComponent={DownloadReportComponent} downloadExcel tableClassname='' headerClassname='rounded-lg' filterHeader="Airline" columns={onTimeFlightsColumnDef as any} data={Object.values(query.data)} hasFilter={true} showColumnFilter filterColumn={"airline"}/>
          }
        </div>
    </section>
  );
};

import ExcelJs from "exceljs";
import { toast } from "sonner";
import { useAuth } from "@/api/useAuth";
import { format } from "date-fns";
const DownloadReportComponent=({data}:{data:any[]})=>{
  const {user}=useAuth()
  const {date}=useTerminalStore()
  const fromDate=format(date?.from? new Date(date?.from )as Date :new Date(),'dd-MM-yyyy')
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
            key:"numberOfFlightsOnTime",
            header:"On Time Flights",
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
            key:"numberOfFlights",
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
              airline:datum["airline"],
              numberOfFlightsOnTime:datum["numberOfFlightsOnTime"],
              numberOfFlights:datum["numberOfFlights"]
            })
        })
        workbook.xlsx.writeBuffer().then(function (data) {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = `On Time Flights-${fromDate}-${toDate}.xlsx`;
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