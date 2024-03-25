import { cn } from '@/lib/utils'
import React, { HTMLProps, useEffect, useMemo, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { Button } from './button';
import { Save } from 'lucide-react';
interface timepickerProps extends HTMLProps<HTMLDivElement>{
    circleClassName?:string;
    onClick?:never;
    headerClassname?:string;
    onFieldChange:(value:any)=>void;
    defaultTimeValue?:{
        hours:number | null,
        minutes:number | null
    }
}
export const Timepicker = ({className,onFieldChange,circleClassName,headerClassname,defaultTimeValue={hours:null,minutes:null},...props}:timepickerProps) => {
    const {onClick} = props
    const [selectionMode,setSelectionMode]=useState<"hours"|"minutes">("hours")
    const [currentTime,setCurrentTime]=useState<{
        hours:null | number,
        minutes:null | number
    }>(defaultTimeValue)
    const hourValues = useMemo(() => Array.from({ length: 25 }, (_, i) => i ), []);
    const minuteValues = useMemo(() => Array.from({ length: 61 }, (_, i) => i ), []);  
    const popoverRef=useRef<HTMLButtonElement>(null)

    const commitDate=(date:typeof currentTime )=>{
        
        if(!date.hours && !date.minutes){
            onFieldChange("")
            return
        }
       onFieldChange(`${date.hours||0} ${date.minutes||0}`)
       popoverRef.current?.click()
    }
    
  return (
   <Popover>
    <PopoverTrigger asChild  className='w-48 h-9 border-2 md:flex-grow-0  border-darkBlue bg-white outline-none ring-0 dark:ring-0 dark:bg-white px-2 text-[0.75rem]    rounded-lg ' ref={popoverRef}>
       <div role='button' className='flex flex-row items-center justify-center'>
       {
            currentTime.hours == null && currentTime.minutes == null ?"Select a time Value":`${currentTime.hours||0} hours(s) ${currentTime.minutes||0} minute(s)`
        }
       </div>
    </PopoverTrigger>
    <PopoverContent className='px-1 h-80 scroll-smooth overflow-y-auto transparent-scrollbar' >
        <div>
            <p className='text-lg font-[400]'>Current Time : <span className='text-[0.9275rem]'>{currentTime.hours|| "00"}h </span> : <span className='text-[0.9275rem]'>{currentTime.minutes || "00"} m</span></p>
        </div>
        <div className="flex items-center my-3 space-x-2">
            <Button disabled={selectionMode=="hours"} onClick={()=>setSelectionMode("hours")} className='hover:bg-darkBlue hover:text-white transition disabled:bg-lightPink disabled:hover:bg-neutral-50 disabled:text-white disabled:hover:text-black' variant={"ghost"}>Hours</Button>
            <Button disabled={selectionMode=="minutes"} onClick={()=>setSelectionMode("minutes")} className='bg-neutral-50 hover:dark:bg-darkBlue hover:bg-darkBlue transition disabled:bg-lightPink  text-black hover:text-white disabled:text-white'>Minutes</Button>

        </div>
        <Button onClick={()=>{commitDate(currentTime)}} variant={"ghost"} className='w-full ring-1 flex items-center justify-center space-x-2'>Save <Save className='w-4 h-4 shrink ml-2' /></Button>
        {
            selectionMode==="hours" &&
            <div className="flex flex-col w-full transparent-scrollbar mt-3  px-3 space-y-3">
                {
                    hourValues.map((hourValue)=>{
                        return <div onClick={()=>{
                            setCurrentTime((state)=>({...state,hours:hourValue}))
                            setSelectionMode("minutes")
                            }} role='button' className='text-center w-[40%] mx-auto h-8 flex flex-row items-center justify-center hover:bg-neutral-50 rounded-md' key={hourValue}>
                            <p>{hourValue}</p>
                        </div>
                    })
                }
            </div>
            
           
        }
        {
             selectionMode==="minutes" &&
             <div className="flex flex-col w-full transparent-scrollbar mt-3  px-3 space-y-3">
                 {
                     minuteValues.map((minuteValue)=>{
                         return <div onClick={()=>{
                             setCurrentTime((state)=>({...state,minutes:minuteValue}))
                             setSelectionMode("hours")
                            commitDate({hours:currentTime.hours,minutes:minuteValue})

                             }} role='button' className='text-center w-[40%] mx-auto h-8 flex flex-row items-center justify-center hover:bg-neutral-50 rounded-md' key={minuteValue}>
                             <p>{minuteValue}</p>
                         </div>
                     })
                 }
             </div>
        }
   
    </PopoverContent>
   </Popover>
  )
}
