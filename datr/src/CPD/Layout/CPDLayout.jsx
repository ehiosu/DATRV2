import React from 'react'
import { Sidebar } from '../Sidebar/Sidebar'
import { Outlet } from 'react-router'
export const CPDLayout = () => {
  return (
    <main   className='flex w-full bg-my-gray'>
        <Sidebar/>
       <div className="lg:w-[80%] w-full mx-auto">
         <Outlet/>
       </div>
    </main>
  )
}
