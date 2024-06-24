import { useAuth } from '@/api/useAuth'
import { cn } from '@/lib/utils'
import { Ban, ClipboardIcon, ClipboardPaste, LogOut, LucideIcon, LucideLayoutDashboard, SendToBack, Ticket, Timer, TimerOff } from 'lucide-react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router'

export const Sidebar = () => {
  const location=useLocation()
  const nav =useNavigate()
  const {logout}=useAuth()
  const tryLogout=()=>{
    logout()
    nav('/')
  }
  return (
    <div className='flex flex-col lg:w-[15vw] px-1 bg-ncBlue items-center overflow-y-auto '>
       <div className="w-full  py-1.5 aspect-square border-b-2 border-b-neutral-100/40  grid place-items-center px-2">
        <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png" className='w-full aspect-square object-contain' alt="" />
      </div>
    <div className="flex flex-col mt-[40px] px-3  w-full flex-1 p-2">

      <SidebarItem to='/CPD/Dashboard' title='CPD Dashboard' Icon={SendToBack} allowedRoles={["DGO","ADMIN"]}/>
      <SidebarItem to='/DAS/Dashboard' title='Dashboard' Icon={LucideLayoutDashboard} allowedRoles={["DGO","ADMIN","DATA_STATISTICS"]}/>
      <SidebarItem to='/DAS/Delays' title='Delayed Flights' Icon={TimerOff} allowedRoles={["DGO","ADMIN","DATA_STATISTICS"]}/>
      <SidebarItem to='/DAS/Cancelled' title='Cancelled Flights' Icon={Ban} allowedRoles={["DGO","ADMIN","DATA_STATISTICS"]}/>
      <SidebarItem to='/DAS/OnTime' title='On Time Flights' Icon={Timer} allowedRoles={["DGO","ADMIN","DATA_STATISTICS"]}/>
      <SidebarItem to='/DAS/Reports' title='Reports' Icon={ClipboardPaste} allowedRoles={["DGO","ADMIN","DATA_STATISTICS"]}/>
{/*       
      <SidebarItem to='/CPD/Tickets' title='Tickets' Icon={Ticket} allowedRoles={["ADMIN","CPO","AIRLINE","DGO"]}/>
      <SidebarItem to='/CPD/Reports' title='Reports' Icon={ClipboardIcon} allowedRoles={["ADMIN","CPO","AIRLINE","DGO"]}/>
      <SidebarItem to='/DAS/Dashboard' title='Data And Statistics' Icon={ClipboardIcon} allowedRoles={["ADMIN","DGO","DATA_STATISTICS"]}/> */}
      <div onClick={()=>{tryLogout()}} role='button' className="mt-auto px-2 flex items-center space-x-2 text-lightPink hover:bg-slate-100/10 rounded-md h-8 transition-all">
        <LogOut className='w-4 h-4 shrink '/>
        <p className='text-sm'>Logout</p>
      </div>
     
    </div>
      



    </div>
  )
}
type sidebarProps={
  Icon:LucideIcon,
  title:string,
  to:string,
  allowedRoles:string[]
}
const SidebarItem=({Icon,title,to,allowedRoles}:sidebarProps)=>{
  const {user}=useAuth()
  if(!allowedRoles.includes(user.roles[user.roles.length-1]) && allowedRoles[0]!=="*"){
    return <></>
  }
  const nav=useNavigate()
  return(
    <div role='button' onClick={()=>{nav(to)}} className={cn('w-full px-2  text-neutral-500 flex items-center h-10 my-2 hover:text-white transition-all',location.pathname.includes(to)&&"bg-slate-700/40 rounded-lg text-white")}>
    <Icon className='w-4 h-4 shrink mr-2'/>
    <p className='text-sm '>{title}</p>
</div>
  )
}