import React from "react";
import { motion, AnimatePresence } from 'framer-motion'
import { PiWarningCircle } from "react-icons/pi";
import ReactApexChart from "react-apexcharts";
import { bigConversationData, conversationData } from "../data/data";
export const Conversations = () => {
    return (
        <AnimatePresence   >
            <motion.section initial={{ scale: 0.1, opacity: 0 }} exit={{ scale: 0.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-[90%] space-y-8 mx-auto max-h-[80vh] md:overflow-y-auto">
              <div className="w-full h-[60vh] flex flex-col gap-2 bg-white rounded-md shadow-md p-2">
                <p className="block text-[1.8rem] font-semibold p-2 border-b-2 border-b-neutral-400/40">Conversations</p>
                <Graph/>
              </div>
              <div className="flex  gap-3  lg:flex-row flex-col">
                <div className="lg:w-[25vw] md:w-[60%] md:mx-auto w-full h-[35vh] bg-white rounded-md shadow-md flex flex-col p-2">
                    <p className="text-neutral-400 text-[1rem] text-center">{bigConversationData.title}</p>
                    <p className="xl:text-[4rem] text-[2.7rem] text-center xl:mt-4 xl:mb-6 lg:mt-4 lg:mb-6 mt-6 mb-8 font-semibold">{bigConversationData.count}</p>
                    <p className="text-center text-[1.2rem] text-neutral-600 font-semibold">{bigConversationData.text}</p>
                    <p className="xl:mt-4 lg:mt-2 mt-6 text-[1.2rem] text-neutral-500 text-center">
                        <span className={`${bigConversationData.trend=="up"?"text-blue-300":"text-red-500"}`}>{bigConversationData.percentage}</span>
                        % from last week
                    </p>
                </div>
                <div className="flex-1 grid md:grid-cols-3 md:grid-rows-2 grid-cols-2 grid-rows-3 gap-2 lg:h-[35vh]">
                    {
                        conversationData.map((datum)=><GridCard {...datum}/>)
                    }
                </div>
              </div>
               

            </motion.section>
        </AnimatePresence>
    )
}

const  Graph=()=>{
    const series= [{
         name: "New Conversations",
         data: [10, 41, 35, 51, 49, 62, 69]
     },{
         name: "Resolutions",
         data: [40,71, 15, 31, 89, 32, 29]
     },
     {
        name: "Customer",
        data: [32,56, 18, 21, 79, 72, 59]
    }]
     const options = {
         chart: {
           type: 'bar',
           zoom: {
             enabled: false
           }
         },
         dataLabels: {
           enabled: true
         },
         grid: {
           row: {
             colors: [ 'transparent'],
             opacity: 0.5
           },
         },
         colors:['#FF1313','#83FC94','#F4EF50'],
         tooltip: {
             // or 'light' depending on your preference
             x: {
               show: true,
             },
             y: {
               formatter: function (value) {
                 return value + " tickets";
               }
             },
             marker: {
               show: true,
             },
             custom: function ({ series, seriesIndex, dataPointIndex, w }) {
               console.log(seriesIndex,w.globals.colors[seriesIndex])
                 const dataName = w.globals.seriesNames[seriesIndex];
                 return `<div class=" w-36   text-center  h-8 p-1   aspect-square  text-white  bg-[${colors[seriesIndex===1?1:0]}]" ><p className='w-max  h-max  '>${dataName}: ${series[seriesIndex][dataPointIndex]}</p></div>`;
               }
           },
         xaxis: {
           categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
           axisBorder: {
             color: 'transparent'
           }
         }
         
       };
       
  return(
     <div    className='flex-1'>
  <ReactApexChart  type='bar' series={series} options={options} height={'90%'} />
     </div>
  )
  }

const GridCard=({count,text,trend,percentage})=>{
    return(
        <div className="col-span-1  p-2 flex flex-col bg-white rounded-md shadow-md">
            <PiWarningCircle className="ml-auto text-[1.1rem]"/>
            <p className="text-[1.4rem] text-center font-semibold">{count}</p>
            <p className="text-[0.9rem] text-center text-neutral-500 my-2">{text}</p>
            <p className={`mt-auto ${trend=="up"?'text-blue-300':'text-red-500'} text-center`}>{percentage}%</p>
        </div>
    )
}