import React from "react";
import ReactApexChart from "react-apexcharts";
import {
  Chart as ChartJs,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJs.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);
const colors = ["#00CCF2", "#FF007C"];
export const DashboardPerformanceGraph = () => {
  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "Open Tickets",
        data: [
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
        ],
        backgroundColor: colors[0],
        borderWidth: 1,
        barThickness: 28,
        borderRadius: 40,
      },
      {
        label: "Resolved Tickets",
        data: [
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
        ],
        backgroundColor: colors[1],
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
          label: function (context) {
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
    <div className="w-full h-[50vh] bg-white   p-4 rounded-lg  shadow-md   flex    flex-col">
      <p className="md:text-xl text-lg font-semibold">
        Key Performance Metrics
      </p>
      <div className="h-[90%] flex items-center justify-center">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

const Graph = () => {
  const series = [
    {
      name: "Open Tickets",
      data: [10, 41, 35, 51, 49, 62, 69],
    },
    {
      name: "Resolved Tickets",
      data: [40, 71, 15, 31, 89, 32, 29],
    },
  ];
  const options = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Key Performance Metrics",
      align: "left",
      style: {
        fontWeight: 600,
      },
    },
    grid: {
      row: {
        colors: ["transparent"],
        opacity: 0.5,
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
        },
      },
      marker: {
        show: false,
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        console.log(seriesIndex, w.globals.colors[seriesIndex]);
        const dataName = w.globals.seriesNames[seriesIndex];
        return `<div class=" w-36   text-center  h-8 p-1   aspect-square  text-white  bg-lightPink" ><p className='w-max  h-max  '>${dataName}: ${series[seriesIndex][dataPointIndex]}</p></div>`;
      },
    },
    xaxis: {
      categories: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      axisBorder: {
        color: "transparent",
      },
    },
  };

  return (
    <div className="flex-1    ">
      <ReactApexChart
        type="line"
        series={series}
        options={options}
        height={"100%"}
      />
    </div>
  );
};
