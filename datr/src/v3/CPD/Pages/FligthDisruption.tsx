import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTerminal } from '@/v3/hooks/useTerminal'
import React, { useState } from 'react'
import { AuthorizedComponent } from '../Components/AuthorizedComponent'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useFlightDisruptions } from '@/v3/hooks/useFlightDisruptions'
import { Skeleton } from '@/components/ui/skeleton'
import { GenericDataTable, fdrAirlineColumnDef, fdrColumnDef } from '@/CPD/Components/DataTable'
import { useAuth } from '@/api/useAuth'
import { NcPagination } from '@/components/ui/NcPagination'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from '@/v3/DAS/Delays'

export const FligthDisruption = () => {
    const {isSuccess,isLoading,data} = useTerminal()
    const [terminal,setTerminal]=useState("All")
    const {user}=useAuth()
    const isAirline=user.roles[user.roles.length-1]==="AIRLINE"
    const [currentPage,setCurrentPage]=useState(0)
    const [maxPages,setMaxPages]=useState(0)
    const [pageSize,setPageSize]=useState(12)
    const [date,setDate]=useState<DateRange>({
        from:new Date(),
        to:new Date()
    })
    const query=useFlightDisruptions(terminal,currentPage,setMaxPages,pageSize,date)
    const nav= useNavigate()
  return (
    <section className='w-full px-6 py-2 '>
    <div className="flex items-center w-full justify-between">
    <p className='text-xl font-semibold'>Flight Disruptions</p>
 <div className="flex flex-col gap-y-3">
 <Select value={terminal} onValueChange={setTerminal}>
                <SelectTrigger disabled={!isSuccess} className='dark:bg-ncBlue bg-ncBlue text-white px-2 w-40   h-10 rounded-md ml-auto'>
                    <SelectValue placeholder="Select A terminal" className='text-sm font-normal'/>
                    <SelectContent className='dark:bg-ncBlue bg-ncBlue'>
                        <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='All'>All</SelectItem>
                        {
                            isSuccess && data.map((terminal:any)=>(
                                <SelectItem value={terminal.name} className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white'>
                                    {terminal.name}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </SelectTrigger>
            </Select>
            <DatePickerWithRange date={date} setDate={setDate}/>
 </div>
    </div>
    <AuthorizedComponent roles={["AIRLINE","ADMIN"]}>
                <button onClick={()=>{nav("/CPD/FDR/New")}} className='w-40 h-10 rounded-lg bg-ncBlue text-white flex items-center justify-center space-x-3'>
                    Add Report <Plus className='w-5 h-5 shrink'/>
                </button>
    </AuthorizedComponent>

    <div className="max-h-[60vh] overflow-auto  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
    {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&&   <GenericDataTable tableClassname=''  headerClassname='rounded-lg' columns={isAirline?fdrAirlineColumnDef:fdrColumnDef} data={isAirline?query.data:query.data["flightDisruptionReportResponses"]} filterColumn='airline' filterHeader='Airline' showColumnFilter hasFilter={!isAirline}/>
          }
    </div>
   <div className="flex items-center justify-center mt-2">
   <NcPagination className='mx-auto' maxPage={maxPages} currentPage={currentPage} setPage={setCurrentPage}/>
   </div>

    
      
    </section>
  )
}
