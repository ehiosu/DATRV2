import { Select, SelectItem, SelectTrigger, SelectValue,SelectContent, SelectGroup } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { airlines } from '@/data'
import { cn } from '@/lib/utils'

import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { MdError } from 'react-icons/md'
import { toast } from 'sonner'

const ratingOptions=["Poor","Okay","Average","Good","Great"]
export const Rating = () => {
    const [hoverRating,setHoverRating]=useState<number>(0)
    const handleSumbit=()=>{
        toast.promise(new Promise((resolve,reject)=>{
            if(!formData.airline)
                {
                    reject(new Error("Airline Missing"))
                }
            if(formData.rating===0)
                {
                    reject(new Error("Select a Rating!"))
                }
            setTimeout(() => {
                resolve(true)
            }, 1200);
        }),{
            loading:"Submitting Your Feeback...",
            success:"Feedback Submitted Successfully!",
            error(error) {
                return(
                    <div className='flex flex-col'>
                        <p className="text-lg font-semibold flex items-center mr-2"><MdError className='w-4 h-4 shrink mr-2'/> Error!</p>
                        <p className="text-sm">{error.message}</p>
                    </div>
                )
            },
        })
    }
    const [formData,setFormData]=useState({
        airline:"",
        rating:0,
        remark:""
    })
   
  return (
    <main className='w-full h-screen flex  justify-center bg-ncBlue'>
        <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png" className='absolute w-52 aspect-square left-2 top-2 z-[]' alt="" />
        <div className='xl:w-[40%] md:w-[60%] lg:w-[50%] relative z-[10] w-full rounded-lg py-4 px-4 bg-white h-max mt-[25vh]'>
            <p className="text-2xl text-center  font-[400] text-ncBlue">
                Rate Your Experience!
            </p>
            <p className='text-[0.875rem] text-neutral-600 text-center my-2'>Help Us Improve – Rate Your Experience</p>
            <div className="flex flex-col gap-y-2">
            <p className="text-sm font-semibold text-ncBlue">
                Airline
            </p>
            <Select value={formData.airline} onValueChange={(value)=>{setFormData((state)=>({...state,airline:value}))}}>
                <SelectTrigger className='dark:bg-[#F1F4F9] bg-[#F1F4F9] dark:ring-0 ring-0 focus:ring-0 focus:outline-none outline-none ring-offset-0 border-neutral-200 border-2 dark:border-neutral-200 dark:shadow-none shadow-none'>
                    <SelectValue placeholder="Select An Airline"/>
                </SelectTrigger>
                <SelectContent className='max-h-[40vh]'>
                    <SelectGroup>
                    {
                        airlines.map((airline)=>(
                            <SelectItem className='text-ncBlue' value={airline}>
                                {airline}
                            </SelectItem>
                        ))
                    }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div className="flex flex-col gap-y-2 my-3">
            <p className="text-sm font-semibold text-ncBlue">
                Rate Your Experience
            </p>
            <div className="flex items-center">
            <TooltipProvider delayDuration={0.1}>
                {
                    
                    ratingOptions.map((option,index)=>(
                       
                         <Tooltip>
                            <TooltipTrigger onMouseEnter={()=>{setHoverRating(index+1)}} onMouseLeave={()=>{setHoverRating(-1)}} onClick={()=>{setFormData((state)=>({...state,rating:index+1}))}} className='mx-1'>
                                <FaStar className={cn('w-5 h-5 shrink text-neutral-500 transition-all duration-300',hoverRating!=-1? index+1 <=hoverRating&&"text-blue-400": index+1 <= formData.rating && "text-blue-400")}/>
                            </TooltipTrigger>
                            <TooltipContent  className='w-max h-max px-2 py-1.5 text-sm text-white bg-ncBlue dark:bg-ncBlue'>
                                <p className=''>{option}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))
                }
                       </TooltipProvider>

            </div>
        </div>
        <div className="flex flex-col gap-y-2 my-4">
        <p className="text-sm font-semibold text-ncBlue">
                Share your experience {"(optional)"}
            </p>
            <Textarea className='bg-[#F1F4F9] dark:bg-[#F1F4F9] max-h-[20vh]'  value={formData.remark} onChange={(e)=>{setFormData((state)=>({...state,remark:e.target.value}))}} placeholder='remark'>

            </Textarea>
        </div>
        <button className='text-white bg-slate-500 hover:bg-ncBlue transition-all w-full h-10 rounded-md duration-300'onClick={()=>{handleSumbit()}} >
            Submit!
        </button>
        </div>
        

    </main>
  )
}
