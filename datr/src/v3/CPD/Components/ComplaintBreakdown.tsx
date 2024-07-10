import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTerminal } from "@/v3/hooks/useTerminal";
import React, { useState } from "react";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DatePickerWithRange } from "@/v3/DAS/Delays";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { format } from "date-fns";
import { AxiosResponse } from "axios";
ChartJs.register(ArcElement, Tooltip, Legend, ChartDataLabels);
export const ComplaintBreakdown = () => {
  const [selectedTerminal, setSelectedTerminal] = useState("All");
  const [labels,setLabels]=useState<string[]>([])
  const { data, isSuccess } = useTerminal();
  const {axios}=useAxiosClient()
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPages,setMaxPages]=useState(0)
  const [date,setDate]=useState<DateRange>({
    from:new Date(),
    to:new Date()
  })
  const query=useQuery({
    queryKey:["complaint-breakdown",selectedTerminal,date],
    queryFn:()=>axios(`tickets/stats/complaint/breakdown?terminal=${selectedTerminal}&start-date=${format(date?.from? date.from:new Date(),"dd-MM-yyyy")}&end-date=${format(date?.to? date.to:new Date(),"dd-MM-yyyy")}`).then((resp:AxiosResponse)=>{

      setLabels(Object.keys(resp.data))
      setMaxPages(Object.values(resp.data).length /4)
      setCurrentPage(0)
      return Object.values(resp.data)
    })
  })
  const chartData: any = {
    labels:query.isSuccess? labels.slice(currentPage*3,(currentPage*3)+3):[],
    datasets: [
      {
        label: [],
        data:query.isSuccess? query.data.slice(currentPage*3,(currentPage*3)+3):[],
        backgroundColor: ["#00A3E0", "#7D91F0", "#1464AA"],
      },
    ],
  };
  const options: any = {
    plugins: {
      datalabels: {
        display: true,
        align: "center",
        backgroundColor: "#01054C",
        color:"#FFF",
        borderRadius: 3,
        font: {
          size: 12,
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col xl:p-3">
      <div className="flex items-center flex-wrap gap-x-4">
        <p className="text-[500] text-lg">Complaints Breakdown</p>
      </div>
      <div className="flex items-center ">
        <Select value={selectedTerminal} onValueChange={setSelectedTerminal}>
          <SelectTrigger
            className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none "
            disabled={!isSuccess}
          >
            <SelectValue placeholder="Select A terminal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {isSuccess &&
              data.map((terminal: any) => (
                <SelectItem value={terminal.name}>{terminal.name}</SelectItem>
              ))}
          </SelectContent>
        </Select>
        <div className="flex  items-center ml-auto gap-x-2">
          <Button
            onClick={() => {
              setCurrentPage((state) => state - 1);
            }}
            disabled={currentPage === 0}
            className="px-2 h-8 dark:bg-slate-300  aspect-square rounded-md w-16   text-xs dark:text-sm"
          >
            <p className="text-xs">Previous</p>
          </Button>
          <Button
          disabled={currentPage>maxPages}
            onClick={() => setCurrentPage((state) => state + 1)}
            className="px-1 h-8 dark:bg-slate-300  aspect-square rounded-md w-16 text-sm dark:text-sm  "
          >
            <p className="text-xs">Next</p>
          </Button>
        </div>
      </div>
      <DatePickerWithRange className='bg-ncBlue text-white dark:bg-ncBlue dark:text-white w-max px-1.5 rounded-lg hover:bg-ncBlue dark:hover:bg-ncBlue focus:bg-ncBlue dark:focus:bg-ncBlue my-1.5' date={date} setDate={setDate}/>
      <div className=" w-full flex items-center justify-center h-[70%] max-h-[70%] ">
        <Doughnut options={options}  data={chartData} />
      </div>
    </div>
  );
};
