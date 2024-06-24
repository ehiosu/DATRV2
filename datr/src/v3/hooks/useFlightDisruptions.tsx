import React from 'react'
import { useQuery } from "@tanstack/react-query"
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
export const useFlightDisruptions = (terminal:string,currentPage:number,setMaxPage:React.Dispatch<React.SetStateAction<number>>,size:number) => {
    const {axios}=useAxiosClient()
const query=useQuery({
queryKey:["fdr",terminal],
queryFn:()=>axios(`flight-disruption-reports/terminal?value=${terminal}&page=${currentPage-1}&size=${size}`).then((resp:any)=>{

    setMaxPage(resp.data["totalPages"])
    return resp.data
})
})
return query
}
