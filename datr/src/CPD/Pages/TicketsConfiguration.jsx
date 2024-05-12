import React, { useEffect, useState } from "react";
import { TabsContent } from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { TicketRequestType } from "../Components/TicketRequestType";
import { TicketStatusTypes } from "../Components/TicketStatusTypes";
import { TicketAlerts } from "../Components/TicketAlerts";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";

export const TicketsConfiguration = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { axios } = useAxiosClient();

  return (
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%]  mx-auto min-h-[80vh]  max-h-[80vh] md:overflow-y-auto flex md:flex-row flex-col p-2 gap-4 "
      >
        <aside className="md:w-48 w-80 max-w-full  p-3   bg-white md:rounded-none rounded-lg md:h-28 py-2 md:flex-col flex-row flex gap-2 md:gap-0">
          <TabItem
            title={"Request Type"}
            index={0}
            activeIndex={activeIndex}
            onclick={() => {
              setActiveIndex(0);
            }}
          />
          <TabItem
            title={"Status Types"}
            index={1}
            activeIndex={activeIndex}
            onclick={() => {
              setActiveIndex(1);
            }}
          />
          <TabItem
            title={"Alerts"}
            index={2}
            activeIndex={activeIndex}
            onclick={() => {
              setActiveIndex(2);
            }}
          />
        </aside>
        <TabContent activeIndex={activeIndex} index={0}>
          <TicketRequestType />
        </TabContent>
        <TabContent activeIndex={activeIndex} index={1}>
          <TicketStatusTypes />
        </TabContent>
        <TabContent activeIndex={activeIndex} index={2}>
          <TicketAlerts />
        </TabContent>
      </motion.section>
    </AnimatePresence>
  );
};

const TabItem = ({ title, onclick, index, activeIndex }) => {
  return (
    <div
      className={`relative h-8 w-full grid place-items-center text-[0.75rem] md:text-[0.9rem] font-semibold text- hover:cursor-pointer ${
        index === activeIndex &&
        "bg-neutral-200 border-b-2 transition-all duration-500 rounded-md border-b-blue-400"
      }`}
      onClick={onclick}
    >
      <span className={"absolute  font-semibold"}>{title}</span>
    </div>
  );
};

const TabContent = ({ index, children, activeIndex }) => {
  if (activeIndex !== index) return null;
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex-1 "
    >
      {children}
    </motion.section>
  );
};
