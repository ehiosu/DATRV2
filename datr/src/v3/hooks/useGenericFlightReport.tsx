import { useQuery } from '@tanstack/react-query'
import React from 'react'
import {useAxiosClient} from "@/api/useAxiosClient"
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { AxiosError, AxiosResponse } from 'axios'
export const useGenericFlightReport = (date:DateRange,terminal:string) => {
    const {axios}=useAxiosClient()
 const query=useQuery({
    queryKey:["generic-fligjt-report",terminal,date],
    queryFn:()=>axios(`data-entries/stats/general-statistics?terminal=${terminal}&start-date-of-incidence=${format(date?.from? date.from:new Date(),"dd-MM-yyyy")}24&end-date-of-incidence=${format(date?.to? date.to:new Date(),"dd-MM-yyyy")}`).then((resp:AxiosResponse)=>Object.values(resp)).catch((err:AxiosError)=>{
        throw err
    })

 })
}
