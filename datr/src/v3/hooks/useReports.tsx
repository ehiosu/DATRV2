import { useQuery } from "@tanstack/react-query"
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
export const useReports = (terminal: string, setMaxPage:React.Dispatch<React.SetStateAction<number>>, page: number, size: number) => {
    const { axios } = useAxiosClient();

    

    const queryFn = () => axios(`data-entries/all?terminal=${terminal}&page=${page - 1}&size=${size}`)
        .then((resp: any) => {
            setMaxPage(resp.data["totalPages"])
            return resp.data
        });

    const query = useQuery({
        queryKey:[terminal,"reports",page.toString()],
        queryFn
    });

    return query;
};