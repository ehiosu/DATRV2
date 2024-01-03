import React from 'react'
import { Sidebar } from '../Sidebar/Sidebar'
import { Outlet } from 'react-router'

export const DASLayout = () => {
  return (
    <main className='flex w-full bg-my-gray max-w-screen-2xl'>
        <Sidebar/>
        <div className="lg:w-[75%] w-full mx-auto  overflow-x-hidden">
         <Outlet/>
       </div>
    </main>
  )
}
