import React from 'react'
import ReactApexChart from 'react-apexcharts'

const colors=['#FF5858','#00CCF2']
export const DashboardPerformanceGraph = () => {
  return (
    <div  className='w-full h-[50vh] bg-white   p-4 rounded-lg  shadow-md   flex    flex-col'>
       
            <Graph/>

       
    </div>
  )
}

const  Graph=()=>{
   const series= [{
        name: "Open Tickets",
        data: [10, 41, 35, 51, 49, 62, 69]
    },{
        name: "Resolved Tickets",
        data: [40,71, 15, 31, 89, 32, 29]
    }]
    const options = {
        chart: {
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Key Performance Metrics',
          align: 'left',
          style: {
            fontWeight: 600
          }
        },
        grid: {
          row: {
            colors: [ 'transparent'],
            opacity: 0.5
          },
        },
        colors,
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
              show: false,
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
    <div    className='flex-1    '>
<ReactApexChart  type='line' series={series} options={options} height={'100%'} />
    </div>
)
}