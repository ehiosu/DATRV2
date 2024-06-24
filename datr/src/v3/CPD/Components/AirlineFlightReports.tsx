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
ChartJs.register(BarElement,Tooltip,Legend,CategoryScale,LinearScale);

export const AirlineFlightReports = ({terminals}:{terminals:any[]}) => {
    const [terminal,setTerminal]=useState("ALL")
    const data = {
        labels:["Air Peace","Max Air","Dana Air","Arik Air","Aero Contractors"],
          datasets: [
            {
              label: "Cancelled Flights",
              data:[
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                  
              ],
              backgroundColor: "#01054C",
              borderWidth: 1,
              barThickness: 28,
              borderRadius: 40,
            },
            {
              label: "On Time Flights",
              data: [
                  Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
  
              ],
              backgroundColor: "#D70028",
              borderWidth: 1,
              barThickness: 28,
              borderRadius: 40,
            },
            {
              label: "Delayed Flights",
              data:[
                  Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
                Math.floor(  Math.random()*100),
  
              ],
              backgroundColor: "#FFD20A",
              borderWidth: 1,
              barThickness: 28,
              borderRadius: 40,
            },
         
          ],
        };
        const options = {
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context:any) {
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
    <p className='text-lg font-[500]'>Airline Flight Performance</p>
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
     <div className="h-[80%] flex justify-center items-center">
         <Bar data={data}  options={options}/>
     </div>

 </div>
  )
}
