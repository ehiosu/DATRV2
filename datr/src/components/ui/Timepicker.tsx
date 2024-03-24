import { cn } from '@/lib/utils'
import React, { HTMLProps, useEffect, useMemo, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { Button } from './button';
interface timepickerProps extends HTMLProps<HTMLDivElement>{
    circleClassName?:string;
    onClick?:never;
    headerClassname?:string
    onFieldChange:(value:any)=>void
}
export const Timepicker = ({className,onFieldChange,circleClassName,headerClassname,...props}:timepickerProps) => {
    const {onClick} = props
    const [selectionMode,setSelectionMode]=useState<"hours"|"minutes">("hours")
    const [currentTime,setCurrentTime]=useState<{
        hours:null | number,
        minutes:null | number
    }>({
        hours:null,
        minutes:null
    })
    const hourValues = useMemo(() => Array.from({ length: 24 }, (_, i) => i + 1), []);
    const secondValues = useMemo(() => Array.from({ length: 60 }, (_, i) => i + 1), []);  
    const circleContainerRef=useRef<HTMLDivElement>(null)
    const popoverRef=useRef<HTMLButtonElement>(null)    

    const getHourStyling = (timeValue:number)=>{
       
        const circleContainer = document.querySelector(".circleContainer")
        const containerWidth = circleContainer?.clientWidth
        const radius =containerWidth!/2 || 110 ; // Example radius, you can adjust this based on your design
        const angle = ((timeValue-6) / 24) * Math.PI * 2; // Calculate angle around the circle
        const x = radius + radius * Math.cos(angle); // Calculate x coordinate
        const y = radius + 11+ radius * Math.sin(angle);
        return {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -50%)', // Center the marker
        };
    }

  
    const getHourHandRotation = () => {
        const circle=document.querySelector(".circleContainer")
        const radius = circle?.clientWidth! / 2 || 110; // Get the radius of the circle container
        const hourHandLength = radius+30; // Set the length of the hour hand to match the radius
        const currentHour = (currentTime.hours || 0) % 24; // Get current hour value (between 0-11)
        const rotationAngle = (currentHour * 15) % 360; // Calculate rotation angle
    
        return {
            transform: `translateX(-50%) translateY(-50%) rotate(${rotationAngle}deg)`,
            height: `${hourHandLength}px`, // Set the width of the hour hand to match its length
            top:`${circle?.clientTop}px`,
            left: '50%'
        };
    };

    const commitDate=(date:typeof currentTime )=>{
        alert(date)
    //    onFieldChange(`${date.hours||0} ${date.minutes||0}`)
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
    <PopoverContent className='px-1' >
    
    <div  ref={circleContainerRef} className={cn(className,"relative  p-4")} onClick={onClick} >
        <p className={cn("font-semibold leading-4 tracking-wider text-neutral-500",headerClassname)}>Select Time</p>
        <div className="flex items-center space-x-2 mt-1 mb-4">
            <p className='text-2xl font-semibold'>{currentTime.hours ||0 }<span className='text-[0.75rem] mx-1'>hours</span> : {currentTime.minutes ||0 } <span>minutes</span></p>
            
        </div>
        <div  className={cn("w-52 aspect-square h-52 circleContainer relative",circleClassName)}>
            {
                selectionMode==="hours" && 
                <div className='w-full h-full aspect-square relative'>
                    {hourValues.map((value,)=>{
                        const style=getHourStyling(value)
                       
                       
                        return <div role='button' onClick={()=>{setSelectionMode("minutes")}} style={style as object} className={cn(value%24=== currentTime.hours && "bg-blue-300 rounded-full text-white font-bold scale-120 duration-300 "," text-sm transition flex flex-row items-center justify-center  w-6 h-6 rounded-full absolute z-[2]")} onMouseEnter={()=>{setCurrentTime((state)=>({...state,hours:value}))}}>
                                 <p>{value}</p>
                         </div> 
                       
                    })}
                     <div className="w-[3px] h-1/2  z-[1]  bg-blue-300 absolute left-1/2  origin-bottom duration-[400] top-0"  style={getHourHandRotation()}></div>
                    {/* <div className='absolute w-4 rounded-full aspect-square top-1/2 left-1/2 -translate-y-[30%]  bg-blue-300  -translate-x-1/2'/> */}
                </div>
                
            }
            { selectionMode==="minutes" && 
               <div className='max-h-full overflow-y-scroll flex flex-col space-y-2 w-full   transparent-scrollbar p-1'>
                    {
                        secondValues.map((_,index)=>{
                            
                            return <div onClick={()=>{commitDate({hours:currentTime.hours,minutes:index})}}  role='button' className='flex flex-row items-center justify-center text-lg py-3 font-semibold ' >
                                <p>{index+1}</p>
                            </div>
                        })
                    }
               </div>
                
            }
        </div>
        <Button variant={"ghost"} className='mt-2' onClick={()=>commitDate(currentTime)}>Submit</Button>
    </div>
    </PopoverContent>
   </Popover>
  )
}
