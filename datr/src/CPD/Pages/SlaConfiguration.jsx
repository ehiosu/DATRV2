import { TabsContent } from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@radix-ui/react-dropdown-menu';
import { AiOutlinePlus } from "react-icons/ai";
import {GeneralSlaDataTable} from '../Components/DataTable'
export const SlaConfiguration = () => {
  return (
    <TabsContent value="sla">
      <AnimatePresence>
        <motion.section
          initial={{ scale: 0.1, opacity: 0 }}
          exit={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-[90%]  mx-auto max-h-[80vh] md:overflow-y-auto flex flex-col"
        >
          <p className="font-[600] text-[1.2rem] ">Service Level Agreement</p>
          <div className="md:w-[80%] flex items-center justify-between my-4">
            <div className="flex items-center gap-2">
              <p className="text-[0.8275rem] font-[600] whitespace-nowrap">
                Service Level Agreement For
              </p>
              <Select className="outline-none">
                <SelectTrigger className="w-full h-8 outline-none ml-auto  bg-white rounded-md ">
                  <SelectValue
                    placeholder="Service Level Setting"
                    className="text-neutral-500"
                  />
                </SelectTrigger>
                <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                  <SelectItem
                    value="DS"
                    className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
                  >
                    Default Settings
                  </SelectItem>
                  <Separator />
            
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-[0.8275rem] font-[600] whitespace-nowrap">
                SLA Based Email Escalation
              </p>
              <Select className="outline-none">
                <SelectTrigger className="w-full h-8 outline-none ml-auto  bg-white rounded-md ">
                  <SelectValue
                    placeholder="Service Level Setting"
                    className="text-neutral-500"
                  />
                </SelectTrigger>
                <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                  <SelectItem
                    value="DS"
                    className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
                  >
                    Default Settings
                  </SelectItem>
                  <Separator />
            
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 my-2">
            <button className="w-44 p-2 rounded-md h-10 bg-[#27A7DD] text-white flex justify-between items-center">Add New SLA<AiOutlinePlus/></button>
            <button className="w-28 h-10 bg-neutral-200 text-black rounded-md font-semibold">Delete</button>
          </div>
          <div className="w-full mt-4 shadow-md">
            <GeneralSlaDataTable/>
          </div>
        </motion.section>
      </AnimatePresence>
    </TabsContent>
  );
};
