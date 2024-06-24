import { useAuth } from '@/api/useAuth'
import { cn } from '@/lib/utils'
import { ClipboardIcon, CopyX, LogOut, LucideIcon, LucideLayoutDashboard, MessageCircle, Settings, Ticket } from 'lucide-react'
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
    <div className='flex flex-col lg:w-[15vw] px-1 bg-ncBlue items-center overflow-y-auto sticky top-0'>
      <div className="w-full  py-1.5 px-2 aspect-square border-b-2 border-b-neutral-100/40  grid place-items-center">
        <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png" className='w-full aspect-square object-contain' alt="" />
      </div>
    <div className="flex flex-col mt-[40px] px-3  w-full flex-1 p-2">
      <SidebarItem to='/CPD/Dashboard' title='Dashboard' Icon={LucideLayoutDashboard} allowedRoles={["SHIFT_SUPERVISOR","TERMINAL_SUPERVISOR","ADMIN","DGO"]}/>
      <SidebarItem to='/CPD/Tickets' title='Tickets' Icon={Ticket} mainMenu='/CPD/Ticket' allowedRoles={["ADMIN","CPO","AIRLINE"]}/>
      <SidebarItem to='/CPD/Messages' title='Messages' Icon={MessageCircle} allowedRoles={["*"]}/>
      <SidebarItem to='/DAS/Dashboard' title='Data And Statistics' Icon={ClipboardIcon} allowedRoles={["ADMIN","DGO","DATA_STATISTICS"]}/>
      <SidebarItem to='/CPD/Configuration/Sla' title='Configuration' mainMenu='/CPD/Configuration' Icon={Settings} allowedRoles={["ADMIN"]}/>
      <SidebarItem to='/CPD/FDR' title='Flight Disruption' Icon={CopyX} allowedRoles={["ADMIN","AIRLINE"]}/>
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
  allowedRoles:string[],
  mainMenu?:string
}
const SidebarItem=({Icon,title,to,allowedRoles,mainMenu="abc"}:sidebarProps)=>{
  const {user}=useAuth()
  if(!allowedRoles.includes(user.roles[user.roles.length-1]) && allowedRoles[0]!=="*"){
    return <></>
  }
  const nav=useNavigate()
  return(
    <div role='button' onClick={()=>{nav(to)}} className={cn('w-full px-2  text-neutral-500 flex items-center h-10 my-2 hover:text-white transition-all',location.pathname.includes(to) &&"bg-slate-700/40 rounded-lg text-white",location.pathname.includes(mainMenu)&& "bg-slate-700/40 rounded-lg text-white")}>
    <Icon className='w-4 h-4 shrink mr-2'/>
    <p className='text-sm '>{title}</p>
</div>
  )
}