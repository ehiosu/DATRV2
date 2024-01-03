import React from "react";
import {motion,AnimatePresence} from 'framer-motion'
import { DashboardStats } from "./DashboardStats";
import { OverviewPerformanceGraph } from "./ReportsOverviewPerformanceGraph";
export const ReportOverview=()=>{
    return(
       <AnimatePresence   >
         <motion.section  initial={{scale:0.1,opacity:0}}    exit={{scale:0.1,opacity:0}}  animate={{scale:1,opacity:1}}    className="w-[90%] space-y-8 mx-auto">
            <DashboardStats/>
            <OverviewPerformanceGraph/>
        </motion.section>
       </AnimatePresence>
    )
}