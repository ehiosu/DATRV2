import React from 'react'
import { useQuery } from "@tanstack/react-query"
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { useAuth } from '@/api/useAuth'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
export const useFlightDisruptions = (terminal:string,currentPage:number,setMaxPage:React.Dispatch<React.SetStateAction<number>>,size:number,date:DateRange) => {
    const {axios}=useAxiosClient()
    const {user}=useAuth()
    const isAirline = user.roles[user.roles.length-1]==="AIRLINE"
const query=useQuery({
queryKey:["fdr",terminal,date,currentPage],
queryFn:()=>axios(isAirline?`flight-disruption-reports/terminal/airline?terminal-name=${terminal}&airline-name=${user.airline?.replace(" ","-")}` :`flight-disruption-reports/terminal/by-date-of-incidence?terminal=${terminal}&start-date-of-incidence=${format(date.from? date.from:new Date(),"dd-MM-yyyy")}&end-date-of-incidence=${format(date.to?date.to:new Date(),'dd-MM-yyyy')}&page=${currentPage}&size=${size}`).then((resp:any)=>{
    if(!isAirline){
    
    setMaxPage(resp.data["totalPages"])
    }
    console.log(resp.data)
    return resp.data
})
})
return query
}
