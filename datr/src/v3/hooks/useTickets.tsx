import { useQuery } from "@tanstack/react-query"
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import React from "react";
import { useAuth } from "@/api/useAuth";
export const useTickets = (status: string, date: DateRange={from:new Date(),to:new Date()}, page: number, size: number,setMaxPages:React.Dispatch<React.SetStateAction<number>>,email:string="") => {
    const { axios } = useAxiosClient();
    const {user}=useAuth()
    const role = user.roles[user.roles.length-1]
    const isAirline=user.roles[user.roles.length-1]==="AIRLINE"
    let queryUrl =''
    if(role==="FOU_HEAD" && status==="NEW"){
        queryUrl=""
    }
    if(role !== "CPO" && !role.includes("FOU")){
    if(status==="ALL" && !date.from){
        queryUrl=!isAirline?`tickets/all?page=${page-1}&size=${size}`:`tickets/airline?page=${page-1}&size=${size}`
    }
    if(!date.from && status!=="ALL"){
        queryUrl=!isAirline?`tickets/status?value=${status}`:`tickets/airline/status?value=${status}&page=${page-1}&size=${size}`
        console.log(queryUrl)
    }
    // Ensure date objects are correctly instantiated
   if(date.from){
    queryUrl=!isAirline?`date-range?start=${format(date.from as Date,'dd-MM-yyyy')}&end=${format(date.to?date.to:date.from,"dd-MM-yyyy")}&page=${page-1}&size=${size}`:''
   }
    }
    else{
        queryUrl=`tickets/by-creator-assignee?email=${user.email}&page=${page-1}&size=${size}`
    }
  
    const queryFn = () => axios(queryUrl,{method:"GET"})
        .then((resp: any) => {
            setMaxPages(resp.data["totalPages"]||1)
            return resp.data["tickets"]});

    const query = useQuery({
        queryKey:['tickets',status,page,`${date.from?date.from?.toDateString():""}`],
        queryFn
    });

    return query;
};