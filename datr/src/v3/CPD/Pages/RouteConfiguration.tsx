import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import React, { useRef } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { GenericDataTable, routesColumnDef } from '@/CPD/Components/DataTable'

export const RouteConfiguration = () => {
    const dialogRef=useRef<HTMLButtonElement|null>(null)
    const {axios}=useAxiosClient()
    const getRoutesQuery=useQuery({
        queryKey:["routes","all"],
        queryFn:()=>axios('routes',{
            method:"GET"
        }).then((resp:AxiosResponse)=>resp.data).catch((err:AxiosError)=>{
            throw err
        })
    })
  return (
    <section className='w-full space-y-3 pb-6'>
      <Dialog>
        <DialogTrigger ref={dialogRef} asChild>
        <button className='mt-2 w-max text-sm bg-ncBlue px-3 py-1.5 text-white rounded-lg'>
      Add Route  
    </button> 
        </DialogTrigger>
        <DialogContent>

        </DialogContent>
    </Dialog>
    <div className="mx-auto w-max">
        <p className='px-1 py-1.5 text-lg font-semibold text-ncBlue border-b-2 border-b-ncBlue'>Routes</p>
    </div>
    {
        getRoutesQuery.isSuccess&&<div className="max-h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full"> <GenericDataTable  columns={routesColumnDef} data={getRoutesQuery.data}/></div>
    }
    </section>
  )
}
