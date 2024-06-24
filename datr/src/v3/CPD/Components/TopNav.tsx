import { useAuth } from '@/api/useAuth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTerminalStore } from '@/store/terminalstore'
import { useTerminal } from '@/v3/hooks/useTerminal'
import { Bell } from 'lucide-react'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router'

export const TopNav = () => {
    const {user}=useAuth()
    const {terminal,setTerminal}=useTerminalStore()
    const terminalQuery=useTerminal()
    const location =useLocation()
    useEffect(()=>{
        console.log(location.pathname)
    },[location])
  return (
    <div className='bg-white h-16 p-2 w-full flex items-center justify-end divide-x-2 divide-neutral-200 space-x-4'>
        {
            location.pathname.toLowerCase().includes("das") && location.pathname!=="DAS/Dashboard"&& !location.pathname.includes("CPD")&&  <Select value={terminal} onValueChange={setTerminal}>
                <SelectTrigger className='w-40 ml-auto dark:bg-ncBlue bg-ncBlue text-white' disabled={!terminalQuery.isSuccess}>
                    <SelectValue placeholder="Select A terminal"/>
                </SelectTrigger>
                <SelectContent className='dark:bg-ncBlue bg-ncBlue'>
                        <SelectItem className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white' value='All'>All</SelectItem>
                        {
                            terminalQuery.isSuccess && terminalQuery.data.map((terminal:any)=>(
                                <SelectItem value={terminal.name} className='text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white'>
                                    {terminal.name}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
            </Select>
        }
        <div role='button' className="w-7 hover:bg-neutral-200 transition-all hover:rounded-md flex items-center justify-center aspect-square relative">
            <div className="w-4 h-4 rounded-full absolute -right-1 top-1 text-xs flex items-center justify-center bg-orange-500 text-white -translate-y-1/2">
                <p className='text-[10px]'>7</p>
            </div>
            <Bell className='w-4 h-4 shrink ml-[1px]'/>
        </div>
        <div className=''>
            <div role='button' className="ml-4 flex space-x-2 items-center w-32">
                <img src="https://www.pngkey.com/png/full/202-2024792_user-profile-icon-png-download-fa-user-circle.png" className='w-6 h-6 object-contain' alt="" />
                <div className="flex flex-col  justify-start">
                    <p className='font-semibold text-[0.75rem]'>{user.firstName}</p>
                    <p className='text-[0.65rem] text-neutral-500'>{user.roles[user.roles.length-1]}</p>
                </div>
            </div>

        </div>

    </div>
  )
}
