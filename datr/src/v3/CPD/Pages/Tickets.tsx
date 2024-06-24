import { GenericDataTable, ResolvedTicketColumnDefinition, UnresolvedTicketsColumnDefinition, generalTicketColumnDefiniton, openTicketColumnDefinition } from '@/CPD/Components/DataTable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useTickets } from '@/v3/hooks/useTickets'
import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { AuthorizedComponent } from '../Components/AuthorizedComponent'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { ColumnDef } from '@tanstack/react-table'

const statusColumnMap={
  OPEN:openTicketColumnDefinition,
  ALL:generalTicketColumnDefiniton,
  RESOLVED:ResolvedTicketColumnDefinition,
  ESCALATED:UnresolvedTicketsColumnDefinition,
  NEW:generalTicketColumnDefiniton
}
export const Tickets = () => {
  const [filter,setFilter]=useState("ALL")
  const [currentPage,setCurrentPage]=useState(0)
  const [maxPages,setMaxPages]=useState(1)
  const [pageSize,setPageSize]=useState(10)
  const [date,setRange]=useState<DateRange>({
    from:undefined,
    to:undefined
  })
  const query=useTickets(filter,date,currentPage,pageSize,setMaxPages)
  const nav=useNavigate()
  return (
    <section className='w-full px-6 py-2 '>
    <div className="flex items-center w-full justify-between">
    <p className='text-2xl font-semibold'>Tickets</p>
    <Select value={filter} onValueChange={(value:string)=>{
      setCurrentPage(0)
      setFilter(value)
    }}>
      <SelectTrigger className='w-32 h-10 bg-ncBlue dark:bg-ncBlue text-white dark:text-white hover:bg-slate-500 focus:outline-none outline-none dark:focus:outline-none ring-0 focus:ring-0 dark:focus:ring-0 dark:hover:bg-slate-500 transition'>
        <SelectValue placeholder="Filter By Status"/>
      </SelectTrigger>
      <SelectContent className='bg-ncBlue dark:bg-ncBlue text-white'>
      <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='ALL'>
          All
        </SelectItem>
        <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='OPENED'>
          Open
        </SelectItem>
        <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='RESOLVED'>
          Resolved
        </SelectItem>
        <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='ESCALATED'>
          Escalated
        </SelectItem>
        <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='NEW'>
          New
        </SelectItem>
      </SelectContent>
    </Select>
    </div>
    <AuthorizedComponent roles={["ADMIN","TERMINAL_HEAD","SHIFT_HEAD","CPO"]}>
            <button onClick={()=>{nav('/CPD/New-Ticket')}} className='w-40 h-9 hover:bg-slate-400 transition-all rounded-md bg-ncBlue text-white flex items-center space-x-2 justify-center ml-auto  my-2'>
              New Ticket <Plus className='w-4 h-4 ml-2 shrink'/>
            </button>
          </AuthorizedComponent>
   
    {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&& <div className="h-[60vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">   <GenericDataTable tableClassname='' headerClassname='rounded-lg' filterHeader='Complainant Name' columns={statusColumnMap[filter as keyof typeof statusColumnMap] as any} data={query.data||[]} filterColumn='complainantName' hasFilter/></div>
          }
    
    <div className='mt-5 flex justify-center space-x-4 items-center'>
          <button onClick={()=>setCurrentPage((state)=>state-1)}  disabled={currentPage===0} className='w-max px-5 py-1.5 text-sm rounded-lg bg-ncBlue text-white disabled:bg-slate-400'>
            Previous
          </button>
          <button onClick={()=>setCurrentPage((state)=>state+1)} disabled={currentPage===maxPages-1}  className='px-5 w-max py-1.5 rounded-lg bg-ncBlue text-white text-sm disabled:bg-slate-400'>
            Next
          </button>
        </div>
    </section>
  )
}