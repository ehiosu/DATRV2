import { useQuery } from "@tanstack/react-query"
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
export const useTerminalData = (terminal:string,airline:string,remark:string,date:DateRange) => {
    const { axios } = useAxiosClient();

    // Ensure date objects are correctly instantiated
    const fromDate = date?.from ? new Date(date.from) : new Date();
    const toDate = date?.to ? new Date(date.to) : new Date();
    const url=`data-entries/terminal/airline/remark?terminal-name=${terminal}&airline-name=${airline}&remark=${remark}&start-date-of-incidence=${format(fromDate,'dd-MM-yyyy')}&end-date-of-incidence=${format(toDate,'dd-MM-yyyy')}`
    const query=useQuery({
        queryKey:[terminal,airline,remark,date],
        queryFn:()=>axios(url,{method:"GET"}).then((resp:any)=>resp.data)
    })
    return query
}
