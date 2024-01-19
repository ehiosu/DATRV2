import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TicketDistributionTable } from "./DataTable";
import { DonutChart } from "./DonutChart";
import { ReportTicketDonutData } from "../data/data";
export const ReportTickets = () => {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%] space-y-8 mx-auto max-h-[80vh] md:overflow-y-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 h-auto space-y-4">
          {ReportTicketDonutData.map((datum) => (
            <DonutChart
              data={datum.data}
              labels={datum.labels}
              colors={datum.colors}
              title={datum.title}
            />
          ))}
        </div>

        <TicketDistributionTable />
      </motion.section>
    </AnimatePresence>
  );
};
