import { useQuery } from "@tanstack/react-query"
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
export const useDelays = (terminal: string, date: DateRange, page: number, size: number) => {
    const { axios } = useAxiosClient();

    // Ensure date objects are correctly instantiated
    const fromDate = date?.from ? new Date(date.from) : new Date();
    const toDate = date?.to ? new Date(date.to) : new Date();

    const queryKey = ['delays', terminal, format(fromDate, 'dd-MM-yyyy'), format(toDate, 'dd-MM-yyyy')];

    const queryFn = () => axios(`data-entries/delays?terminal=${terminal}&airline=Dana-Air&start-date-of-incidence=${format(fromDate, 'dd-MM-yyyy')}&end-date-of-incidence=${format(toDate, 'dd-MM-yyyy')}&page=${page - 1}&size=${size}`)
        .then((resp: any) => resp.data);

    const query = useQuery({
        queryKey,
        queryFn
    });

    return query;
};