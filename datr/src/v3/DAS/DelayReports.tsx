import { useTerminalStore } from '@/store/terminalstore'
import { id } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { DatePickerWithRange } from './Delays'
import { MdArrowBack } from 'react-icons/md'
import { useTerminalData } from '../hooks/useTerminalData'
import { DateRange } from 'react-day-picker'
import { Skeleton } from '@/components/ui/skeleton'
import { GenericDataTable, delayReportColumnDef, delayedReportColumnDef, delayedReportColumnDefDeparture } from '@/CPD/Components/DataTable'

export const DelayReports = () => {
    const {id}=useParams()
    const {terminal,date,setDate}=useTerminalStore()
    const query=useTerminalData(terminal,`${id?.replace("_","-")}`,"delayed",date as DateRange)
    const nav = useNavigate()
    const [splitData,setSplitData]=useState<{
      Arrival:any[],
      Departure:any[]
    }>({
      Arrival:[],
      Departure:[]
    })
    useEffect(()=>{
      if(!query.data)return
      let data: { Arrival: any[]; Departure: any[] } = {
        Arrival: [],
        Departure: [],
      };
      query.data.map((datum: any) => {
        if (datum["reportType"] == "ARRIVAL") {
          data.Arrival.push(datum);
        } else {
          data.Departure.push(datum);
        }
      });
      setSplitData(data)
    },[query.data])
  return (
    <section className='w-full px-6 py-2 '>
    <div onClick={()=>{nav(-1)}} role='button' className='w-8 h-8 bg-ncBlue rounded-sm flex items-center justify-center text-white'>
        <MdArrowBack className='w-4 h-4 shrink'/>
    </div>
    <div className="flex items-center w-full justify-between">
    <p className='text-xl font-semibold'>Delays for {id?.replace("_"," ")}</p>
    <DatePickerWithRange date={date} setDate={setDate}/>
    </div>
    <div className="w-full h-[60vh] overflow-y-auto border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth">
      <p className="text-lg font-semibold text-ncBlue ml-2">
        Arrivals
      </p>
          {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&&   <GenericDataTable downloadExcel DownloadComponent={ReportDownloadComponent} tableClassname='' headerClassname='rounded-lg' columns={delayedReportColumnDef as any} data={splitData.Arrival} hasFilter={true} showColumnFilter filterColumn={"airline"}/>
          }
        </div>
    <div className="w-full h-[60vh] overflow-y-auto border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth ">
    <p className="ml-2 text-lg font-semibold text-ncBlue">
        Departure
      </p>
          {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&&   <GenericDataTable downloadExcel DownloadComponent={ReportDownloadComponentDeparture} tableClassname='' headerClassname='rounded-lg' columns={delayedReportColumnDefDeparture as any} data={splitData.Departure} hasFilter={true} showColumnFilter filterColumn={"airline"}/>
          }
        </div>
    </section>
  )
}

import ExcelJs from "exceljs";
import { format } from "date-fns";
import { useAuth } from '@/api/useAuth'
import { toast } from 'sonner'
import { Download } from 'lucide-react'
const ReportDownloadComponent: React.FC<{ data: any[] }> = ({ data }) => {
  const { user } = useAuth();
  const {date}=useTerminalStore()
  const {id}=useParams()
  const airline =id?.replace("_"," ")
  let fromDate;
  let toDate;
  const [nativeDate,setNativeDate]=useState<Record<string,string>>({
    from:"",
    to:""
  })
  useEffect(()=>{
    console.log(date)
    setNativeDate({
      from:format(date?.from?new Date(date?.from):new Date(),'dd-MM-yyyy'),
      to:format(date?.to?new Date(date?.to):new Date(),'dd-MM-yyyy')
    })
  },[])
  try{
     fromDate=format(date?.from? date?.from as Date :new Date(),'dd-MM-yyyy')
   toDate=format(date?.to?date?.to as Date:new Date(),'dd-MM-yyyy'||"")
  }
  catch(err){
    fromDate = format(new Date(),'dd-MM-yyy')
    toDate = format(new Date(),'dd-MM-yyy')
  }
  const tryDownloadReport = () => {
    toast.promise(
      new Promise((resolve, reject) => {
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
       
        let filteredData:Record<any,any[]>={

        }
        data.map((datum)=>{
          if (!filteredData[datum.dateOfIncidence]) {
            filteredData[datum.dateOfIncidence] = [datum];
          } else {
            filteredData[datum.dateOfIncidence].push(datum);
          }
        })
        try {
          const sheet = workbook.addWorksheet(airline);
            sheet.columns = [
              {
                header: "Date",
                key: "date",
                width: 20,
                style: {
                  font: {
                    size: 12,
                    bold: true,
                  },
                },
              },
              {
                header: "Ac-Type",
                key: "acType",
                width: 20,
              },
              {
                header: "FLT-No",
                key: "flightNumber",
                width: 20,
              },
              {
                header: "Route",
                key: "route",
                width: 20,
              },
              {
                header: "STA",
                key: "stipulatedTimeArrived",
                width: 20,
              },
              {
                header: "ATA",
                key: "actualTimeArrived",
                width: 20,
              },
              {
                header: "DELAY",
                key: "delayedDifferenceInHour",
                width: 20,
              },
              {
                header: "Report Type",
                key: "reportType",
                width: 20,
              },
              {
                header: "Status",
                key: "remark",
                width: 20,
              },
            ];

            sheet.eachColumnKey((column) => {
              column.eachCell((cell, index) => {
                console.log(cell);
                cell.font = {
                  size: 13,
                  bold: true,
                };
              });
            });
        Object.keys(filteredData).map((dateKey)=>{
          
      
              sheet.addRow({
                date: dateKey,
                delayedDifferenceInHour:"-"
              })
              filteredData[dateKey].map((datum)=>{
                sheet.addRow({
                  acType: datum["acType"],
                  flightNumber: datum["flightNumber"],
                  route: datum["route"],
                  stipulatedTimeArrived:
                   datum["stipulatedTimeArrived"] || "---",
                  actualTimeArrived: datum["actualTimeArrived"] || "---",
                  delayedDifferenceInHour: datum["delayedDifferenceInHour"]
                    ? `${Math.floor(
                        parseInt(datum["delayedDifferenceInHour"]!) / 3600
                      )} hours : ${
                        (parseInt(datum["delayedDifferenceInHour"]!) % 3600) /
                        60
                      } minutes`
                    : "",
                  reportType: datum["reportType"] || "---",
                  remark: datum["remark"] || "---",
                  stipulatedTimeDeparted:datum["stipulatedTimeArrived"] || "---",
                  actualTimeDeparted: datum["actualTimeArrived"] || "---",
                });
              });
              sheet.getColumn("delayedDifferenceInHour").eachCell((cell) => {
                const value = sheet.getCell(cell?.address).value;
                if (!value) {
                  sheet.getCell(cell.address).value =  "#####";
                  sheet.getCell(cell?.address).style = {
                    font: {
                      size: 14,
                      bold: true,
                      color: {
                        argb: "c1121f",
                      },
                    },
                  };
                }
                if(value=="-"){
                  sheet.getCell(cell.address).value=""
                }
              });
             
              }) 
              workbook.xlsx.writeBuffer().then(function (data) {
                const blob = new Blob([data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `Arrival Delay report for ${airline}${nativeDate.from}-${nativeDate.to}.xlsx`;
                anchor.click();
                window.URL.revokeObjectURL(url);
              });
        } catch (err: any) {
          console.log(err.message);
        }

        resolve(workbook);
      }),
      {
        loading: "loading",
        success: "success!",
        error: "error!",
      }
    );
  };
  return (
    <div className="ml-auto">
      <button
        onClick={() => {
          tryDownloadReport();
        }}
        className="w-32 ml-auto text-white px-2 py-2 flex items-center justify-center bg-ncBlue text-sm rounded-lg "
      >
        Download <Download className="w-4 ml-2 h-4 shrink " />
      </button>
    </div>
  );
};
const ReportDownloadComponentDeparture: React.FC<{ data: any[] }> = ({ data }) => {
  const { user } = useAuth();
  const {date}=useTerminalStore()
  const {id}=useParams()
  const airline =id?.replace("_"," ")
  let fromDate;
  let toDate;
  const [nativeDate,setNativeDate]=useState<Record<string,string>>({
    from:"",
    to:""
  })
  useEffect(()=>{
    console.log(date)
    setNativeDate({
      from:format(date?.from?new Date(date?.from):new Date(),'dd-MM-yyyy'),
      to:format(date?.to?new Date(date?.to):new Date(),'dd-MM-yyyy')
    })
  },[])
  try{
     fromDate=format(date?.from? date?.from as Date :new Date(),'dd-MM-yyyy')
   toDate=format(date?.to?date?.to as Date:new Date(),'dd-MM-yyyy'||"")
  }
  catch(err){
    fromDate = format(new Date(),'dd-MM-yyy')
    toDate = format(new Date(),'dd-MM-yyy')
  }
  const tryDownloadReport = () => {
    toast.promise(
      new Promise((resolve, reject) => {
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
       
        let filteredData:Record<any,any[]>={

        }
        data.map((datum)=>{
          if (!filteredData[datum.dateOfIncidence]) {
            filteredData[datum.dateOfIncidence] = [datum];
          } else {
            filteredData[datum.dateOfIncidence].push(datum);
          }
        })
        console.log(filteredData)
        try {
          const sheet = workbook.addWorksheet(airline);
            sheet.columns = [
              {
                header: "Date",
                key: "date",
                width: 20,
                style: {
                  font: {
                    size: 12,
                    bold: true,
                  },
                },
              },
              {
                header: "Ac-Type",
                key: "acType",
                width: 20,
              },
              {
                header: "FLT-No",
                key: "flightNumber",
                width: 20,
              },
              {
                header: "Route",
                key: "route",
                width: 20,
              },
              {
                header: "STD",
                key: "stipulatedTimeArrived",
                width: 20,
              },
              {
                header: "ATD",
                key: "actualTimeArrived",
                width: 20,
              },
              {
                header: "DELAY",
                key: "delayedDifferenceInHour",
                width: 20,
              },
              {
                header: "Report Type",
                key: "reportType",
                width: 20,
              },
              {
                header: "Status",
                key: "remark",
                width: 20,
              },
            ];

            sheet.eachColumnKey((column) => {
              column.eachCell((cell, index) => {
                console.log(cell);
                cell.font = {
                  size: 13,
                  bold: true,
                };
              });
            });
      
        Object.keys(filteredData).map((dateKey)=>{
          
              sheet.addRow({
                date: dateKey,
                delayedDifferenceInHour:"-"
              })
              filteredData[dateKey].map((datum)=>{
                sheet.addRow({
                  acType: datum["acType"],
                  flightNumber: datum["flightNumber"],
                  route: datum["route"],
                  stipulatedTimeArrived:datum["stipulatedTimeArrived"] || "---",
                  actualTimeArrived: datum["actualTimeArrived"] || "---",
                  delayedDifferenceInHour: datum["delayedDifferenceInHour"]
                    ? `${Math.floor(
                        parseInt(datum["delayedDifferenceInHour"]!) / 3600
                      )} hours : ${
                        (parseInt(datum["delayedDifferenceInHour"]!) % 3600) /
                        60
                      } minutes`
                    : "",
                  reportType: datum["reportType"] || "---",
                  remark: datum["remark"] || "---",
                  
                });
              });
              sheet.getColumn("delayedDifferenceInHour").eachCell((cell) => {
                const value = sheet.getCell(cell?.address).value;
                if (!value) {
                  sheet.getCell(cell.address).value =  "#####";
                  sheet.getCell(cell?.address).style = {
                    font: {
                      size: 14,
                      bold: true,
                      color: {
                        argb: "c1121f",
                      },
                    },
                  };
                }
                if(value=="-"){
                  sheet.getCell(cell.address).value=""
                }
              });
              
              }) 
              workbook.xlsx.writeBuffer().then(function (data) {
                const blob = new Blob([data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `Departure Delay report for ${airline}${nativeDate.from}-${nativeDate.to}.xlsx`;
                anchor.click();
                window.URL.revokeObjectURL(url);
              });
        } catch (err: any) {
          console.log(err.message);
        }

        resolve(workbook);
      }),
      {
        loading: "loading",
        success: "success!",
        error: "error!",
      }
    );
  };
  return (
    <div className="ml-auto">
      <button
        onClick={() => {
          tryDownloadReport();
        }}
        className="w-32 ml-auto text-white px-2 py-2 flex items-center justify-center bg-ncBlue text-sm rounded-lg "
      >
        Download <Download className="w-4 ml-2 h-4 shrink " />
      </button>
    </div>
  );
};
