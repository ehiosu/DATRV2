import React from 'react'
import { useQuery } from "@tanstack/react-query"
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { useAuth } from '@/api/useAuth'
export const useFlightDisruptions = (terminal:string,currentPage:number,setMaxPage:React.Dispatch<React.SetStateAction<number>>,size:number) => {
    const {axios}=useAxiosClient()
    const {user}=useAuth()
    const isAirline = user.roles[user.roles.length-1]==="AIRLINE"
const query=useQuery({
queryKey:["fdr",terminal],
queryFn:()=>axios(isAirline?`flight-disruption-reports/terminal/airline?terminal-name=${terminal}&airline-name=${user.airline?.replace(" ","-")}` :`flight-disruption-reports/terminal?value=${terminal}&page=${currentPage-1}&size=${size}`).then((resp:any)=>{
    if(!isAirline){
    
    setMaxPage(resp.data["totalPages"])
    }
    
    return resp.data
})
})
return query
}
