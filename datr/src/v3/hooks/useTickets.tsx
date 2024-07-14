import { useQuery } from "@tanstack/react-query"
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import React from "react";
import { useAuth } from "@/api/useAuth";
export const useTickets = (status: string, date: DateRange={from:new Date(),to:new Date()}, page: number, size: number,setMaxPages:React.Dispatch<React.SetStateAction<number>>,terminal:string) => {
    const { axios } = useAxiosClient();
    const {user}=useAuth()
    const role = user.roles[user.roles.length-1]
    const isAirline=user.roles[user.roles.length-1]==="AIRLINE"
    let queryUrl =GetRequestUrl({
        size,
        status,
        page,
        email:user.email,
        terminal,
        role,
        date
    })
    const queryFn = () => axios(queryUrl,{method:"GET"})
        .then((resp: any) => {
            setMaxPages(resp.data["totalPages"]||1)
            return resp.data["tickets"]});

    const query = useQuery({
        queryKey:['tickets',status,page,`${date.from?date.from?.toDateString():""}`,terminal,size],
        queryFn
    });

    return query;
};

type requestParams={
    role:string,
    terminal:string|null,
    date:DateRange,
    size:number,
    page:number,
    email:string,
    status:string,
}
const GetRequestUrl=(requestargs:requestParams)=>{
    const {role,email,size,page,status,terminal}=requestargs
    console.log(requestargs)
    const isAdmin=role === "ADMIN"
    const isCPO = role === "CPO"
    const isInFOU = role.includes("FOU")
    const isTerminalHeadLike = role === "TERMINAL_SUPERVISOR" || role ==="SHIFT_SUPERVISOR"
    const isAirline = role === "AIRLINE"

    if(isCPO){
        return `tickets/by-creator-assignee?email=${email}&page=${page-1}&size=${size}`
    }
    if(isAdmin){
        if(status.toLowerCase()==="all" && terminal?.toLowerCase()!=="all"){
            return `tickets/terminal?value=${terminal}&page=${page-1}&size=${size}`
        }
        if(status.toLowerCase()==="all"){
            return `tickets/all?page=${page-1}&size=${size}`
        }
        return status==="AWAITING_APPROVAL"?`tickets/terminal/status/department?terminal-name=${terminal}&ticket-status=AWAITING_APPROVAL&page=${page-1}&size=${size}`:`tickets/valid/status?value=${status}&page=${page-1}&size${size}`
    }
    if(isInFOU){
        if(role==="FOU_HEAD"){
            return `tickets/terminal/status/department?terminal-name=${terminal}&ticket-status=${status}&page=${page-1}&size=${size}`
        }
        return `tickets/by-creator-assignee?email=${email}&page=${page-1}&size=${size}`
    }
    if(isTerminalHeadLike){
        return `tickets/terminal/status/department?terminal-name=${terminal}&ticket-status=${status}&page=${page-1}&size=${size}`
    }
    if(isAirline){
        return status=== "All"?`tickets/airline?page=${page-1}&size=${size}`:`tickets/airline/status?value=${status}&page=${page-1}&size=${size}`
    }
    return ""

}