import React, { useEffect, useState } from 'react'
import { TabsContent } from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";

export const TicketsConfiguration = () => {
    const [activeIndex,setActiveIndex]=useState(0)
    useEffect(()=>{

    })
  return (
    <TabsContent value="tickets">
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%]  mx-auto max-h-[80vh] md:overflow-y-auto flex p-2 gap-2"
      >
    <aside className="w-48 relative p-3 outline bg-white">
        <div className="relative h-6 w-full grid place-items-center text-[0.9rem] font-semibold text-">
            <span className={'absolute  font-semibold'}>Request Types</span>
        </div>
        <div className="relative h-6 w-full grid place-items-center my-2">
            <span className={'absolute  '}>Status Types</span>
        </div>
        <div className="relative h-6 w-full grid place-items-center my-2">
            <span className={'absolute  '}>Alerts</span>
        </div>
    </aside>
    </motion.section>
    </AnimatePresence>
    </TabsContent>
  )
}
