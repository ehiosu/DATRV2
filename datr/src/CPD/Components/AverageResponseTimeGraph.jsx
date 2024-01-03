import React from 'react'
import ReactApexChart from 'react-apexcharts'

export const AverageResponseTimeGraph = () => {
  const series =[
    {"name":"Current","data":[1,5,3,4,5,7]},
    {"name":"Previous","data":[4,5,1,7,9,2]}
  ]
  const options ={
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [5, 7, 5],
      curve: 'straight',
      dashArray: [0, 8, 5]
    },
 
    legend: {
      tooltipHoverFormatter: function(val, opts) {
        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] 
      }
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    xaxis: {
      categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
        '10 Jan', '11 Jan', '12 Jan'
      ],
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              return val + " (Hours)"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + " (Hours)"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val;
            }
          }
        }
      ]
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  }
  
  return (
    <div className='w-full h-full flex-1' >
      <ReactApexChart series={series} options={options} height={'90%'}/>
    </div>
  )
}

