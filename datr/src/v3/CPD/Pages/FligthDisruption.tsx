import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTerminal } from '@/v3/hooks/useTerminal'
import React, { useState } from 'react'
import { AuthorizedComponent } from '../Components/AuthorizedComponent'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useFlightDisruptions } from '@/v3/hooks/useFlightDisruptions'
import { Skeleton } from '@/components/ui/skeleton'
import { GenericDataTable, fdrColumnDef } from '@/CPD/Components/DataTable'

export const FligthDisruption = () => {
    const {isSuccess,isLoading,data} = useTerminal()
    const [terminal,setTerminal]=useState("ALL")
    const [currentPage,setCurrentPage]=useState(1)
    const [maxPages,setMaxPages]=useState(1)
    const [pageSize,setPageSize]=useState(20)
    const query=useFlightDisruptions(terminal,currentPage,setMaxPages,pageSize)
    const nav= useNavigate()
  return (
    <section className='w-full px-6 py-2 '>
    <div className="flex items-center w-full justify-between">
    <p className='text-xl font-semibold'>Flight Disruptions</p>
    <Select value={terminal} onValueChange={setTerminal}>
                <SelectTrigger disabled={!isSuccess} className='dark:bg-ncBlue bg-ncBlue text-white px-2 w-40   h-10 rounded-md ml-auto'>
                    <SelectValue placeholder="Select A terminal" className='text-sm font-normal'/>
                    <SelectContent className='dark:bg-ncBlue bg-ncBlue'>
                        <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='ALL'>All</SelectItem>
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
    </div>
    <AuthorizedComponent roles={["AIRLINE","ADMIN"]}>
                <button onClick={()=>{nav("/CPD/FDR/New")}} className='w-40 h-10 rounded-lg bg-ncBlue text-white flex items-center justify-center space-x-3'>
                    Add Report <Plus className='w-5 h-5 shrink'/>
                </button>
    </AuthorizedComponent>

    <div className="h-[60vh] overflow-auto  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
    {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&&   <GenericDataTable tableClassname=''  headerClassname='rounded-lg' columns={fdrColumnDef} data={query.data["flightDisruptionReportResponses"]} filterColumn='airline' filterHeader='Airline' showColumnFilter hasFilter/>
          }
    </div>
    <div className='mt-5 flex justify-center space-x-4 items-center'>
          <button onClick={()=>setCurrentPage((state)=>state-1)}  disabled={currentPage===1} className='w-max px-5 py-1.5 text-sm rounded-lg bg-ncBlue text-white disabled:bg-slate-400'>
            Previous
          </button>
          <button onClick={()=>setCurrentPage((state)=>state+1)} disabled={currentPage===maxPages}  className='px-5 w-max py-1.5 rounded-lg bg-ncBlue text-white text-sm disabled:bg-slate-400'>
            Next
          </button>
        </div>
    </section>
  )
}
