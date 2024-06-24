import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import {useAxiosClient} from "@/api/useAxiosClient"
import React, { useRef } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { GenericDataTable, airlineColumnDef } from '@/CPD/Components/DataTable'

export const AirlineConfiguration = () => {
    const {axios}=useAxiosClient()
    const dialogRef=useRef<HTMLButtonElement|null>(null)
    const getAirlineQuery=useQuery({
        queryKey:["airlines","all","config"],
        queryFn:()=>axios('airlines/all',{
            method:"GET"
        }).then((resp:AxiosResponse)=>resp.data).catch((err:AxiosError)=>{throw err})
    })
  return (
    <section className='w-full space-y-3 pb-6'>
      <Dialog>
        <DialogTrigger ref={dialogRef} asChild>
        <button className='mt-2 w-max text-sm bg-ncBlue px-3 py-1.5 text-white rounded-lg'>
      Add Airlines  
    </button> 
        </DialogTrigger>
        <DialogContent>

        </DialogContent>
    </Dialog>
    {
        getAirlineQuery.isSuccess&&<div className="max-h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full"> <GenericDataTable  filterHeader='Airline Name' hasFilter filterColumn='airlineName' columns={airlineColumnDef} data={getAirlineQuery.data}/></div>
    }
    </section>
  )
}
