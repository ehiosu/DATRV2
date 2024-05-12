import React, { useState } from 'react'
import { AccountRequestsTable } from '../Components/DataTable'
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { ArrowDown } from 'lucide-react';
import { PopoverContent } from '@radix-ui/react-popover';
export const AccountRequests = () => {
  const [currentPage,setCurrentPage]=useState(1)
  const {axios}=useAxiosClient()
  const requestsQuery=useQuery({
    queryKey:["airline","account","request"],
    queryFn:()=>axios(`airlines/accounts/all/status?value=PENDING&page=${currentPage-1}&size=10`).then((resp:any)=>resp.data.airlineRequests)
  })
  return (
    <AnimatePresence>
    <motion.section
      initial={{ scale: 0.1, opacity: 0 }}
      exit={{ scale: 0.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-[90%]  p-1  flex flex-col  mx-auto max-h-[80vh] md:overflow-y-auto"
    >
      <div className="flex items-center space-x-3 mb-4">
       
        {/* <Popover>
          <PopoverTrigger className='text-sm bg-neutral-200 rounded-lg p-2 flex items-center group'>
            Filter by
            <ArrowDown className='w-4 h-4 shrink ml-2 group-data-[state=open]:rotate-180 transition-all duration-300'/>
          </PopoverTrigger>
          <PopoverContent className='w-32 p-2 bg-white shadow-md z-[99999] rounded-md'>
          <div role='button'>
            <p className='text-sm'>Filter by status</p>
          </div>
          <div role='button'>
            <p className='text-sm'>Filter by status</p>
          </div>d
          </PopoverContent>

        </Popover> */}
      </div>
      {
      !requestsQuery.isError && requestsQuery.isSuccess?
      <AccountRequestsTable data={requestsQuery.data} /> :<Skeleton className='w-full h-[30vh]'/>
    }

        
    </motion.section>
    </AnimatePresence>
  )
}
