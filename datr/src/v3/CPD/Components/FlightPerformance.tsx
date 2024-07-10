import {  GenericDataTable, OnTimeTableColumnDef } from '@/CPD/Components/DataTable';
import { DatePickerWithRange } from '@/v3/DAS/Delays';
import React, { useState } from 'react'
import { DateRange } from 'react-day-picker';
import { Select, SelectTrigger, SelectValue,SelectContent,SelectItem } from "@/components/ui/select"
import { useQuery } from '@tanstack/react-query';
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { format } from 'date-fns';
import { AxiosError, AxiosResponse } from 'axios';
export const FlightPerformance = ({terminals}:{terminals:any[]}) => {
  const {axios}=useAxiosClient()
  const [date,setDate]=useState<DateRange>({
    from:new Date(),
    to:new Date()
  })
  const [terminal,setTerminal]=useState("All")
  const query =useQuery({
    queryKey:["flight-performance",terminal,date],
    queryFn:()=>axios(`data-entries/stats/general-statistics?terminal=${terminal}&start-date-of-incidence=${format(date?.from? date.from:new Date(),"dd-MM-yyyy")}&end-date-of-incidence=${format(date?.to? date.to:new Date(),"dd-MM-yyyy")}`).then((resp:AxiosResponse)=>{
      console.log(resp.data)
      const data =Object.values(resp.data)
      console.log(data)
      return data
    }).catch((Err:AxiosError)=>{
      throw Err
    })
  })
  
      
  return (
    <div className='h-[50vh] w-full overflow-y-auto p-2 relative'>
    <div className="flex flex-wrap">
        <p className='text-lg font-[500] mb-1'>Flight Disruption Data</p>
        <Select value={terminal} onValueChange={setTerminal} >
      <SelectTrigger
        disabled={!terminals}
        className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none ml-auto"
      >
        <SelectValue placeholder="Select A Terminal" />
      </SelectTrigger>
      {terminals.length>0 && (
        <SelectContent>
          <SelectItem value="All">
            All
          </SelectItem>
          {terminals.map((terminal: any) => (
            <SelectItem value={terminal.name}>
              {terminal.name}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
    </div>
    <DatePickerWithRange className='bg-ncBlue text-white dark:bg-ncBlue dark:text-white w-max px-1.5 rounded-lg hover:bg-ncBlue dark:hover:bg-ncBlue focus:bg-ncBlue dark:focus:bg-ncBlue my-1.5' date={date} setDate={setDate}/>
      {
        query.isSuccess&&   <GenericDataTable downloadExcel columns={OnTimeTableColumnDef} showColumnFilter isHeaderSticky data={query.data||[]}/>
      }
    </div>
  )
}
