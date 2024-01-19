import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiWarningCircle } from "react-icons/pi";
import { RTGridData } from "../data/data";
import { AverageResponseTimeGraph } from "./AverageResponseTimeGraph";
import ReactApexChart from "react-apexcharts";
export const ResolutionTime = () => {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%] space-y-8 mx-auto max-h-[80vh] md:overflow-y-auto"
      >
        <div className="grid grid-cols-2 h-auto gap-4">
          {RTGridData.map((datum) => {
            return <GridCard {...datum} />;
          })}
        </div>
        <div className="w-full h-[45vh] rounded-md shadow-md bg-white flex flex-col ">
          <AverageResolutionTime />
        </div>
        <div className="w-full  flex lg:flex-row flex-col p-2 lg:gap-0 gap-4  bg-white rounded-md shadow-lg">
          <div className="flex-1  ">
            <DonutChart
              colors={["#00CCF2"]}
              data={[65]}
              labels={["First Reply Solved"]}
            />
          </div>
          <div className="flex-1">
            <DonutChart
              colors={["#1BB99D"]}
              data={[80]}
              labels={["Assigned Tickets"]}
            />
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

const GridCard = ({ title, text, trend, percentage }) => {
  return (
    <div className="w-[90%] md:h-[25vh] h-[20vh] rounded-lg bg-white flex flex-col shadow-md   p-2 text-center">
      <PiWarningCircle className="ml-auto  text-[0.8rem] md:text-[1.2rem]   hover:cursor-pointer" />
      <p className="text-center lg:text-[1.4rem] md:text-[0.975rem] text-[0.9rem] font-semibold md:mt-0 mt-auto">
        {title}
      </p>
      <p className="font-semibold text-[0.8rem] md:text-[2.1rem] mt-4">
        {text}
      </p>
      <p
        className={`${
          trend === "up" ? "text-blue-400" : "text-red-500"
        } mt-auto md:text-[0.8275rem] text-[0.8rem]`}
      >
        {percentage}
      </p>
    </div>
  );
};

const AverageResolutionTime = ({}) => {
  return (
    <div className="flex-1 p-2">
      <p className="text-[1.4rem] font-semibold">Average Response time</p>
      <AverageResponseTimeGraph />
    </div>
  );
};

const DonutChart = ({ data, labels, title, colors }) => {
  const options = {
    chart: {
      type: "donut",
      height: "95%", // Set the height dynamically
    },
    plotOptions: {
      pie: {
        size: 60,
        endAngle: 270,
        dataLabels: {
          minAngleToShowLabel: 45,
        },
        donut: {
          labels: {
            show: true,
            name: {
              formatter: function (val) {
                return "";
              },
            },
            value: {
              show: true,
              fontSize: "1.5rem",
              fontWeight: "500",
              offsetY: -6,
              formatter: function (val) {
                return val + "%";
              },
            },
          },

          size: "80%",
        },
        border: {
          width: 10, // Set the border width as needed
        },
        borderRadius: 10,
      },
    },
    colors,
    labels,
    dataLabels: {
      enabled: false, // Hide the side labels
    },
  };

  const series = data;
  return (
    <div className="w-full md:w-[80%] h-[35vh]  p-2 ">
      <ReactApexChart
        height={"95%"}
        options={options}
        series={series}
        type="donut"
      />
    </div>
  );
};
