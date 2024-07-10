import React, { useState } from 'react'
import {
    Chart as ChartJs,
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
  } from "chart.js";
  import { Bar } from "react-chartjs-2";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { DatePickerWithRange } from '@/v3/DAS/Delays';
import { Skeleton } from '@/components/ui/skeleton';
import { AxiosError, AxiosResponse } from 'axios';
import { ArrowLeft, ArrowRight } from 'lucide-react';
ChartJs.register(BarElement,Tooltip,Legend,CategoryScale,LinearScale);
type dataSetEntry ={
  label:string,
  data:number[],
  backgroundColor:string,
  borderWidth:number,
  barThickness:number,
  borderRadius:number
}
type dataset =dataSetEntry[]
export const AirlineComplaintPerformance = ({terminals}:{terminals:any[]}) => {
    const [terminal,setTerminal]=useState("All")
    const [labels,setLabels]=useState<string[]>([])
    const [currentPage,setCurrentPage]=useState(0)
    const [maxPage,setMaxPage]=useState(0)
    const {axios}=useAxiosClient()
    const [date,setDate]=useState<DateRange>({
      from:new Date(),
      to:new Date()
    })
    const organizeData=(data:Record<any,any>)=>{
      const _labels=Object.keys(data)
      setLabels(_labels)
      let _dataset = [...graphData]
      _dataset[0].data=[]
      _dataset[1].data=[]
      _labels.map((_lable)=>{
        _dataset[0].data.push(data[_lable as string]["resolved"]) 
        _dataset[1].data.push(data[_lable as string]["opened"]) 
      })
      setGraphData(_dataset)
      setMaxPage(_dataset[0].data.length/6)
      setCurrentPage(0)
      return data
    }
    const query = useQuery({
      queryKey:["Airline-Complaint-Performance",terminal,date],
      queryFn:()=>axios(`tickets/stats/complaint/performance?terminal=${terminal}&start-date=${format(date?.from? date.from:new Date(),"dd-MM-yyyy")}&end-date=${format(date?.to? date.to:new Date(),"dd-MM-yyyy")}`).then((resp:AxiosResponse)=>organizeData(resp.data)).catch((err:AxiosError)=>err)
    })
    const [graphData,setGraphData]=useState<dataset>([{
    
      label:"Resolved Tickets",
      data:[],
      backgroundColor: "#01054C",
      borderWidth: 1,
      barThickness: 28,
      borderRadius: 40,
    },
  {
    label: "Open Tickets",
    data:[],
    backgroundColor: "#006973",
    borderWidth: 1,
    barThickness: 28,
    borderRadius: 40,
  }
  
  
  ])
    let data = {
        labels:labels.slice(currentPage*5,(currentPage*5)+5),
        datasets: [{
    
          label:"Resolved Tickets",
          data:graphData[0].data.slice(currentPage*5,(currentPage*5)+5),
          backgroundColor: "#01054C",
          borderWidth: 1,
          barThickness: 28,
          borderRadius: 40,
        },
      {
        label: "Open Tickets",
        data:graphData[1].data.slice(currentPage*5,(currentPage*5)+5),
        backgroundColor: "#006973",
        borderWidth: 1,
        barThickness: 28,
        borderRadius: 40,
      }
      
      
      ],
      };
    const options = {
        plugins: {
          datalabels: {
            display: true,
            align: "center",
           
            color:"#FFF",
            borderRadius: 3,
            font: {
              size: 14,
            },
          },
          tooltip: {
            color:"#FFF",
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || "";
                return label + `: ${context.parsed.y}`;
              },
            },
          },
        },
    
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: false,
            grid: {
              display: false,
            },
          },
          y: {
            stacked: false,
            grid: {
              display: false,
            },
          },
        },
      };
    
  return (
    <div className='md:w-full lg:w-[60%] w-full  h-[60vh] p-2 max-w-full  bg-white border-t-4 border-t-ncBlue rounded-t-lg overflow-y-auto  xl:max-w-[48%]  min-w-[400px] mx-auto'>
       <div className="flex items-center flex-wrap">
       <p className='text-lg font-[500]'>Airline Complaints Performance</p>
        <Select defaultValue={terminal} onValueChange={setTerminal}>
        <SelectTrigger
            disabled={!terminals}
            className="w-48 h-7 ml-auto  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:border-neutral-200 border-neutral-200 dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
          >
                <SelectValue placeholder="Select A Terminal"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">
                All
              </SelectItem>
              {terminals.map((terminal: any) => (
                <SelectItem value={terminal.name}>
                  {terminal.name}
                </SelectItem>
              ))}
            </SelectContent>
        </Select>
       </div>
       <DatePickerWithRange className='bg-ncBlue text-white dark:bg-ncBlue dark:text-white w-max px-1.5 rounded-lg hover:bg-ncBlue dark:hover:bg-ncBlue focus:bg-ncBlue dark:focus:bg-ncBlue' date={date} setDate={setDate}/>
       <div className="flex items-center justify-end gap-x-3">
        <button onClick={()=>{setCurrentPage((state)=>state-1)}} disabled={currentPage===0}  className='w-5 h-5 flex items-center justify-center rounded bg-slate-200'>
<ArrowLeft className='w-4 h-4 shrink'/>
        </button>
        <button onClick={()=>{setCurrentPage((state)=>state+1)}} disabled={currentPage>maxPage} className='w-5 h-5 flex items-center justify-center rounded bg-slate-200'>
<ArrowRight className='w-4 h-4 shrink'/>
        </button>
      
       </div>
        <div className="h-[80%] flex justify-center items-center">
            <Bar data={data}  options={options as any}/>
        </div>

    </div>
  )
}
