import React, { useEffect, useState } from 'react'
import { ViewChanger, view } from './ViewChanger'
import { GenericDataTable, OnTimeTableColumnDef } from '@/CPD/Components/DataTable'
import { Bar } from 'react-chartjs-2'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const OnTimePerformanceMetric = ({terminals}:{terminals:any[]}) => {
    const [view,setView]=useState<view>("Table")
    const [currentPage,setCurrentPage]=useState(1)
    const data =[
        { "airline": "Air Peace", "onTimeFlights": "22", "totalFlights": "27" },
        { "airline": "Dana Air", "onTimeFlights": "60", "totalFlights": "85" },  { "airline": "Ibom Air", "onTimeFlights": "72", "totalFlights": "90" },  { "airline": "Arik Air", "onTimeFlights": "55", "totalFlights": "78" },  { "airline": "Max Air", "onTimeFlights": "48", "totalFlights": "70" },  { "airline": "Aero Contractors", "onTimeFlights": "62", "totalFlights": "88" },  { "airline": "Green Africa", "onTimeFlights": "80", "totalFlights": "100" },  { "airline": "Overland Airways", "onTimeFlights": "68", "totalFlights": "95" },  { "airline": "United Nigeria Airlines", "onTimeFlights": "52", "totalFlights": "75" },  { "airline": "Med-View Airline", "onTimeFlights": "75", "totalFlights": "100" }]
  return (
    <section className='w-full h-full p-2 overflow-y-auto'>
        <div className="flex items-center flex-wrap gap-x-2 mb-2">
            <p className='md:text-xl text-lg font-semibold'>On Time Performance</p>
            <ViewChanger className='ml-auto ' view="Table" currentView={view} setView={setView}/>
            <ViewChanger view="Bar" className='ml-1' currentView={view} setView={setView}/>
        </div>
       {view==="Table"&& <GenericDataTable columns={OnTimeTableColumnDef} data={data}/>}
       {
        view==="Bar" && <>
        <div className="flex items-center justify-end space-x-2">
            <button className='w-5 h-5 bg-neutral-300 rounded-md hover:bg-neutral-200 transition-all flex items-center justify-center' onClick={()=>{setCurrentPage((state)=>state-1)}} disabled={currentPage===1}><ArrowLeft className='w-4 h-4 shrink'/></button>
            <button onClick={()=>{setCurrentPage((state)=>state+1)}} disabled={currentPage===3}  className='w-5 h-5 bg-neutral-300 rounded-md hover:bg-neutral-200 transition-all flex items-center justify-center'><ArrowRight className='w-4 h-4 shrink'/></button>
        </div>
        
        <BarChart currentPage={currentPage} data={data}/></>
       }

    </section>
  )
}
const BarChart=({data,currentPage}:{data:any[],currentPage:number})=>{
    const [dataset,setDataSet]=useState<any[]>([])
    const [labels,setLabels]=useState<any[]>([])
    let bardata = {
        labels,
        datasets: dataset,
      };
      const options = {
        plugins: {},
    
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
    useEffect(()=>{
       const _labels=data.slice((currentPage-1)*4,4*currentPage).map((data)=>data.airline)
        let _dataset = [
            {
              label: "Total Flights",
              data: [],
              backgroundColor: "#03045e",
              borderWidth: 1,
              barThickness: 28,
              borderRadius: 40,
            },
            {
              label: "On Time Flight",
              data: [],
              backgroundColor: "#83c5be",
              borderWidth: 1,
              barThickness: 28,
              borderRadius: 40,
            },
          ];
          _labels.slice(0,4).map((airline,index)=>{
            _dataset[0].data.push(data[index].totalFlights)
            _dataset[1].data.push(data[index].onTimeFlights)
          })
          setDataSet(_dataset)
          setLabels(_labels)
    },[currentPage])
    return(
        <div className="h-[40vh]">
            <Bar data={bardata} options={options}/>
        </div>
    )
}
