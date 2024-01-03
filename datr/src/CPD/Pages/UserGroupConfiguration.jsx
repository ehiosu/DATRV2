import { TabsContent } from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { GeneralGroupTable } from "../Components/DataTable";

export const UserGroupConfiguration = () => {
  return (
    <TabsContent value="groups">
      <AnimatePresence>
        <motion.section
          initial={{ scale: 0.1, opacity: 0 }}
          exit={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-[90%]  mx-auto max-h-[80vh] md:overflow-y-auto flex flex-col p-2"
        >
          <button className="bg-black text-white flex items-center gap-2 justify-center h-9 w-32 rounded-md">
            <AiOutlinePlus />
            New Group
          </button>
          <div className="w-full my-5 shadow-md">
            <GeneralGroupTable/>
          </div>

        </motion.section>
      </AnimatePresence>
    </TabsContent>
  );
};
