import React from "react";
import ReactApexChart from "react-apexcharts";
export const DonutChart = ({ data, labels, title, colors }) => {
  const options = {
    chart: {
      type: "donut",
      height: "90%", // Set the height dynamically
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
          },
          size: "70%",
        },
        border: {
          width: 10, // Set the border width as needed
        },
        borderRadius: 10,
      },
    },
    colors,
    labels,
  };

  const series = data;
  return (
    <div className="col-span-1 w-full md:w-[80%] min-h-[35vh] bg-white rounded-lg shadow-md flex flex-col p-3">
      <p className="text-[1.3rem] font-semibold text-neutral-500">{title}</p>
      <ReactApexChart
        height={"90%"}
        options={options}
        series={series}
        type="donut"
      />
    </div>
  );
};
