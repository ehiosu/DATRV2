import React from 'react'
import { Sidebar } from './Sidebar'
import { Outlet, useNavigate } from 'react-router'
import { TopNav } from '@/v3/CPD/Components/TopNav'
import { ArrowLeft } from 'lucide-react'


export const DasLayout = () => {
  const nav =useNavigate()
  return (
    <div className='flex  w-full  relative overflow-hidden '>
        <Sidebar/>
        <div className="flex-1 h-screen  w-[70vh] flex flex-col ">
          <TopNav/>
        <div className='bg-[#F7F7F7] flex-1  overflow-y-auto  p-2 '>
        <button onClick={()=>{nav(-1)}} className='w-max text-xs px-3 h-max py-1.5 bg-ncBlue rounded-md text-white flex items-center my-2'>
            <ArrowLeft className='w-4 h-4 shrink'/> Back
          </button>
        <Outlet/>
        {/* <div className="w-full h-[20vh] bg-ncBlue px-6 py-3">

    </div> */}
        </div>
        </div>
    </div>
  )
}
