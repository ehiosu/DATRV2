import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useTerminalStore } from '@/store/terminalstore'
import { SelectValue } from '@radix-ui/react-select'
import React, { useState } from 'react'
import { useTerminal } from '../hooks/useTerminal'
import { AuthorizedComponent } from '../CPD/Components/AuthorizedComponent'
import { useNavigate } from 'react-router'
import {  Clipboard, TrendingUp } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'

export const Dashboard = () => {
    const {terminal,setTerminal}=useTerminalStore()
    const {data,isSuccess}=useTerminal()
    const [dataIndex,setDataIndex]=useState(1)
    const nav=useNavigate()
  return (
    <div className='w-full py-6  md:px-7'>
        <div className="flex items-center">
            <p className='text-lg font-[600] text-ncBlue'>Abuja</p>
            {/* <Select value={terminal} onValueChange={setTerminal}>
                <SelectTrigger disabled={!isSuccess} className='dark:bg-ncBlue bg-ncBlue text-white px-2 w-40   h-10 rounded-md ml-auto'>
                    <SelectValue placeholder="Select A terminal" className='text-sm font-normal'/>
                    <SelectContent className='dark:bg-ncBlue bg-ncBlue'>
                        <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='ALL'>All</SelectItem>
                        {
                            isSuccess && data.map((terminal:any)=>(
                                <SelectItem value={terminal.name} className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white'>
                                    {terminal.name}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </SelectTrigger>
            </Select> */}
        </div>
        <div>
            <AuthorizedComponent roles={["ADMIN","DGO","DATA_STATISTIC"]}>
                    <button onClick={()=>nav('/DAS/New')} className='w-32 text-white h-10 rounded-md bg-ncBlue hover:bg-slate-700/50 transition-all hover:text-ncBlue hover:font-semibold focus:bg-lightPink focus:text-white duration-500 focus:ring-2 focus:ring-offset-4 focus:ring-blue-400'>
                        Add Report
                    </button>
            </AuthorizedComponent>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-4 gap-y-4 justify-evenly">
            <StatCard
            title='Total Scheduled Flights'
            figure='72'
            onClick={()=>{}}
            />
            <StatCard
            title='Total Delayed Flights'
            figure='19'
            onClick={()=>{}}
            />
            <StatCard
            title='Total Cancelled Flights'
            figure='17'
            onClick={()=>{}}
            />
            <StatCard
            title='Total On Time Flights'
            figure='36'
            onClick={()=>{}}
            />
        </div>
        <div className="w-full h-[55vh] p-3 bg-white rounded-t-lg border-t-4 border-t-ncBlue mt-6 rounded-lg flex flex-col">
            <p className='text-lg text-white font-[500] '>Key Performance Metrics</p>
            <div className="flex items-center justify-end space-x-2">
                <button className='bg-slate-100 h-6 aspect-square rounded-md flex items-center justify-center   hover:bg-slate-200/80 transition-all'>
                    <MdArrowBack className='w-4 h-4 shrink'/>
                </button>
                <button className='bg-slate-100 h-6 aspect-square rounded-md flex items-center justify-center   hover:bg-slate-200/80 transition-all'>
                    <MdArrowForward className='w-4 h-4 shrink'/>
                </button>
            </div>
            <div className="flex-1  w-full flex items-center justify-center max-h-[80%]">
            <BarChart currentPage={dataIndex}/>
            </div>
        </div>
    </div>
  )
}

type StatCardProps={
    title:string,
    figure:string,
    onClick:()=>void
}
const StatCard=({title,onClick,figure}:StatCardProps)=>{
    return (    
<div role='button' onClick={()=>onClick()} className="bg-ncBlue p-3 w-[13.8rem] rounded-md ">

        <div className="flex flex-col border-l-2 space-y-1 border-l-white text-white pl-2">
            <div className="flex items-center justify-center w-7 aspect-square bg-slate-100/10">
                <Clipboard className='w-4 h-4 shrink'/>
            </div>
            <p className='text-[0.9275rem] font-normal '>{title}</p>
            <p className='text-[0.74rem] font-semibold'>{figure}</p>
        </div>
        <div className="flex items-center mt-2">
            <div className='flex items-center px-1 rounded-lg py-[0.1rem] bg-green-400/40'>
                <TrendingUp className='w-3 h-3 shrink text-green-400 mr-2'/>
                <p className='text-[0.65rem] text-green-400'>14.85%</p>
            </div>
            <p className='text-xs text-white ml-2'>vs Last Month</p>
        </div>
</div>
    )
}

const BarChart=({currentPage}:{currentPage:number})=>{
    const data ={
        labels:["Arik Air","Air Peace","Dana Air","Max Air"],
        datasets:[
            {
                label:"On Time Flights",
                data:[Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100)],
                  backgroundColor: "#fca311",
                  borderWidth: 1,
                  barThickness: 28,
                  borderRadius: 40,
                },
                {
                  label: "Delayed Flights",
                  data:[Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100)],
                  backgroundColor: "#006d77",
                  borderWidth: 1,
                  barThickness: 28,
                  borderRadius: 40,
                },
                {
                  label: "Cancelled Flights",
                  data:[Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100)],
                  backgroundColor: "#01054c",
                  borderWidth: 1,
                  barThickness: 28,
                  borderRadius: 40,
                },
        ]
    }
    const options = {
        plugins: {
            datalabels: {
                display: true,
                align: "bottom",
                backgroundColor: "#01054C",
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
                return label + `: ${context.parsed.y} flights`;
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
    return(
        <div className="h-full w-full flex items-center justify-center">
            <Bar data={data} options={options as any} />
        </div>
    )
}