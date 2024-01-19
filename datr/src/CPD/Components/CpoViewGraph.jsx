import React from "react";
import ReactApexChart from "react-apexcharts";

export const CpoViewGraph = () => {
  const data = [
    {
      name: "Assigned",
      data: [84, 90, 104, 100],
    },
    {
      name: "Resolved",
      data: [63, 56, 44, 87],
    },
    {
      name: "Escalated",
      data: [42, 60, 14, 24],
    },
  ];
  const options = {
    chart: {
      type: "bar",
    },
    colors: ["#2E6DFF", "#4DBF5D", "#D116DD"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May"],
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
  };
  return (
    <div className="flex-1 ">
      <ReactApexChart
        options={options}
        series={data}
        type="bar"
        height={"95%"}
      ></ReactApexChart>
    </div>
  );
};
