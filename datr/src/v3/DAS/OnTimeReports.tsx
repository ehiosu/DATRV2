import { useTerminalStore } from '@/store/terminalstore'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { DatePickerWithRange } from './Delays'
import { MdArrowBack, MdError } from 'react-icons/md'
import { useTerminalData } from '../hooks/useTerminalData'
import { DateRange } from 'react-day-picker'
import { Skeleton } from '@/components/ui/skeleton'
import { GenericDataTable, delayReportColumnDef, onTimeReportColumnDef, onTimeReportColumnDefDeparture } from '@/CPD/Components/DataTable'

export const OnTimeReports = () => {
    const {id}=useParams()
    const {terminal,date,setDate}=useTerminalStore()
    const query=useTerminalData(terminal,`${id?.replace("_"," ")}`,"on time",date as DateRange)
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
    <div onClick={()=>{nav(-1)}} role='button' className='w-7 h-7  bg-ncBlue rounded-md flex items-center justify-center text-white'>
        <MdArrowBack className='w-4 h-4 shrink'/>
    </div>
    <div className="flex items-center w-full justify-between">
    <p className='text-xl font-semibold'>On Time Flights for {id?.replace("_"," ")}</p>
    <DatePickerWithRange date={date} setDate={setDate}/>
    </div>
    <div className="w-full h-[60vh] overflow-y-auto border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth">
    <p className="my-2 ml-2 text-lg font-semibold text-ncBlue">
        Arrivals
      </p>
          {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&&   <GenericDataTable tableClassname='' downloadExcel DownloadComponent={ReportDownloadComponent} headerClassname='rounded-lg' columns={onTimeReportColumnDef as any} data={splitData.Arrival} hasFilter={true} showColumnFilter filterColumn={"airline"}/>
          }
        </div>
    <div className="w-full h-[60vh] overflow-y-auto border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth">
    <p className="my-2 ml-2 text-lg font-semibold text-ncBlue">
        Departures
      </p>
          {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&&   <GenericDataTable tableClassname='' downloadExcel DownloadComponent={ReportDownloadComponentDeparture} headerClassname='rounded-lg' columns={onTimeReportColumnDefDeparture as any} data={splitData.Departure } hasFilter={true} showColumnFilter filterColumn={"airline"}/>
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
     fromDate=format(date?.from? new Date(date?.from) as Date :new Date(),'dd-MM-yyyy')
   toDate=format(date?.to?new Date(date?.to) as Date:new Date(),'dd-MM-yyyy'||"")
  }
  catch(err:any){
    fromDate = format(new Date(),'dd-MM-yyy')
    toDate = format(new Date(),'dd-MM-yyy')
    console.log(err.message)
  }
  const tryDownloadReport = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        if (data.length===0){
          reject(new Error("No Reports to download"))
        }
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
          console.log(filteredData)
        const sheet = workbook.addWorksheet(airline);
        sheet.columns = [
          {
            header:"Date",
            key:"date",
            style: {
              font: {
                size: 12,
                bold:true
                
              },
            },

            width:25
          },
          {
            header: "Id",
            key: "id",
            width: 20,
            style: {
              font: {
                size: 12,
                
              },
            },
          },
          {
            header: "Terminal",
            key: "terminalName",
            width: 20,
          },
          {
            header: "Airline",
            key: "airline",
            width: 20,
          },
          {
            header: "Date",
            key: "dateOfIncidence",
            width: 20,
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
         
        ];

        sheet.eachColumnKey((column) => {
          column.eachCell((cell, index) => {
            cell.font = {
              size: 13,
              bold: true,
            };
          });
        });

        Object.keys(filteredData).map((dateKey)=>{
            
      
              sheet.addRow({
                date: dateKey,
                
              })
              filteredData[dateKey].map((datum)=>{
                sheet.addRow({
                  ...datum
                });
              });
              
             
              }) 
            workbook.xlsx.writeBuffer().then(function (data) {
                const blob = new Blob([data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `Arrival On Time Flight report for ${airline}${nativeDate.from}-${nativeDate.to}.xlsx`;
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
        error: (error)=>{
          return (
            <div className='flex flex-col gap-y-2'>
              <p className='text-lg font-semibold flex items-center'><MdError className='w-4 h-4 mr-1 shrink'/> Error</p>
              <p className='text-sm font-[500]'>{error.message}</p>
            </div>
          )
        },
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
     fromDate=format(date?.from? new Date(date?.from) as Date :new Date(),'dd-MM-yyyy')
   toDate=format(date?.to?new Date(date?.to) as Date:new Date(),'dd-MM-yyyy'||"")
  }
  catch(err:any){
    fromDate = format(new Date(),'dd-MM-yyy')
    toDate = format(new Date(),'dd-MM-yyy')
    console.log(err.message)
  }
  const tryDownloadReport = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        if (data.length===0){
          reject(new Error("No Reports to download"))
        }
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
          console.log(filteredData)
        const sheet = workbook.addWorksheet(airline);
        sheet.columns = [
          {
            header:"Date",
            key:"date",
            style: {
              font: {
                size: 12,
                bold:true
                
              },
            },

            width:25
          },
          {
            header: "Id",
            key: "id",
            width: 20,
            style: {
              font: {
                size: 12,
                
              },
            },
          },
          {
            header: "Terminal",
            key: "terminalName",
            width: 20,
          },
          {
            header: "Airline",
            key: "airline",
            width: 20,
          },
          {
            header: "Date",
            key: "dateOfIncidence",
            width: 20,
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
         
        ];

        sheet.eachColumnKey((column) => {
          column.eachCell((cell, index) => {
            cell.font = {
              size: 13,
              bold: true,
            };
          });
        });

        Object.keys(filteredData).map((dateKey)=>{
            
      
              sheet.addRow({
                date: dateKey,
                
              })
              filteredData[dateKey].map((datum)=>{
                sheet.addRow({
                  ...datum
                });
              });
              
             
              }) 
            workbook.xlsx.writeBuffer().then(function (data) {
                const blob = new Blob([data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `Departure On Time Flight report for ${airline}${nativeDate.from}-${nativeDate.to}.xlsx`;
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
        error: (error)=>{
          return (
            <div className='flex flex-col gap-y-2'>
              <p className='text-lg font-semibold flex items-center'><MdError className='w-4 h-4 mr-1 shrink'/> Error</p>
              <p className='text-sm font-[500]'>{error.message}</p>
            </div>
          )
        },
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
