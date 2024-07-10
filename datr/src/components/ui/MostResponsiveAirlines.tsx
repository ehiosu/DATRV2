import React, { useState } from 'react'
import { Select, SelectTrigger, SelectValue,SelectContent,SelectItem } from "./select";
import { GenericDataTable, bestPerformingColumnDef } from '@/CPD/Components/DataTable';
import { DatePickerWithRange } from '@/v3/DAS/Delays';
import { DateRange } from 'react-day-picker';
import { useQuery } from '@tanstack/react-query';
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { format } from 'date-fns';
import { AxiosResponse } from 'axios';
export const ResolutionLeaders = ({terminals}:{terminals:any[]}) => {
  const [date,setDate]=useState<DateRange>({
    from:new Date(),
    to:new Date()
  })
  const {axios}=useAxiosClient()
  const [terminal,setTerminal]=useState("All")
  const query=useQuery({
    queryKey:["complaint-resolution",terminal,date],
    queryFn:()=>axios(`tickets/stats/complaint/resolution?terminal=${terminal}&start-date=${format(date?.from? date.from:new Date(),"dd-MM-yyyy")}&end-date=${format(date?.to? date.to:new Date(),"dd-MM-yyyy")}`).then((resp:AxiosResponse)=>resp.data).catch((err)=>{
      throw err
    })
  })
  const formatData=(data:Record<any,any>)=>{
    const keys = Object.keys(data)
    let resp:Record<any,any>[]=[]
    keys.map((key)=>{
      resp.push({
        airline:key,
        activeTickets:data[key]["activeTicketsCount"],
        resolvedTickets:data[key]["resolvedTicketsCount"]
      })
    })

return resp

  }
  return (
    <div className='w-full h-full overflow-y-auto'>
    <div className="flex items-center flex-wrap mb-3">
        <p className='md:text-xl text-lg font-semibold'>Complaint Resolution</p>
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
    query.isSuccess &&  <GenericDataTable data={formatData(query.data as any) as any} columns={bestPerformingColumnDef}/>
   }
{
  query.isError && <p>{query.error.message}</p>
}
</div>
  )
}
