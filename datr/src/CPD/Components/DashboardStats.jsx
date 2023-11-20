import React from 'react'
import { statData } from '../data/data'
import { PiWarningCircle } from "react-icons/pi";
import ReactApexChart from 'react-apexcharts';
const colors=['#00CCF2','#FF007C']
export const DashboardStats = () => {
  return (
    <div className="flex  gap-4 justify-evenly  my-2  items-center  flex-wrap">
        {
            statData.map((datum)=>{
                return  <StatCard  {...datum} key={datum.id}   />
            })
        }
    </div>
  )
}

const   StatCard=({figure,title})=>{
    return(
        <div    className='w-36 aspect-square  rounded-md   flex    flex-col    items-center bg-white   shadow-md p-2      '>
            <PiWarningCircle    className='ml-auto  text-[0.8rem]   hover:cursor-pointer' />
            <p  className='mt-auto  text-[1.6rem]  font-semibold '>{figure}</p>
            <p  className='font-thin  text-neutral-600 mb-auto text-[0.8275rem]'>{title}</p>
            <p  className='text-xs  text-blue-400   hover:underline underline-offset-2'>{`{total}`}</p>
        </div>
    )
}

export const  TicketStatistics=()=>{
    
    const chartOptions = {
        chart: {
          type: 'bar',
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '40%',
            barWidht:'20%'
          
          },
        },
        xaxis: {
          categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday'],
          
          axisTicks: {
            show: false, // Set to false to hide x-axis ticks
          },
          axisBorder: {
            show: false, // Set to false to hide x-axis border
          },
          tooltip: {
            enabled: false, // Set to false to hide x-axis tooltip
          },
          grid: {
            show: false, // Set to false to hide x-axis grid lines
          },
        },
        yaxis:{
             
          axisTicks: {
            show: false, // Set to false to hide x-axis ticks
          },
          axisBorder: {
            show: false, // Set to false to hide x-axis border
          },
          tooltip: {
            enabled: false, // Set to false to hide x-axis tooltip
          },
          grid: {
            show: false, // Set to false to hide x-axis grid lines
          }, 
        },
        grid: {
            show: false, // Set to false to hide x-axis grid lines
          },
          colors,

        tooltip:{
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const colors=['#00CCF2','#FF007C']
                console.log(seriesIndex,w.globals.colors[seriesIndex])
                  const dataName = w.globals.seriesNames[seriesIndex];
                  return `<div class=" w-36   text-center  h-8 p-1   aspect-square  text-white  bg-[#00CCF2]" ><p className='w-max  h-max  '>${dataName}: ${series[seriesIndex][dataPointIndex]}</p></div>`;
                }
        }
          
      };
    
      const chartSeries = [
        {
          name: 'Assigned',
          data: [44, 55, 41, 64,32],
        },
        {
          name: 'Unassigned',
          data: [53, 32, 33, 52,69],
        },
       
      ];
    return(
        <div className="w-full h-full   bg-white   rounded-md   shadow-md   p-3">
               <ReactApexChart options={chartOptions}   series={chartSeries} type='bar' /> 
        </div>
    )
}