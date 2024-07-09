import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from './input'
import { PaginationEllipsis } from './pagination'
type paginationProps={
    className?:string,
    maxPage:number,
    setPage:React.Dispatch<React.SetStateAction<number>>,
    currentPage:number
}
export const NcPagination:React.FC<paginationProps> = ({className,maxPage,setPage,currentPage}) => {
    const [targetPage,setTargetPage]=useState<number|null>(null)
  return (
   <div className={cn("flex items-center",className)}>
    <button disabled={currentPage===1} onClick={()=>{setPage((state)=>Math.max(state-1,1))}} className='w-8 h-8 rounded bg-ncBlue text-white flex items-center justify-center mr-2 disabled:bg-slate-300 disabled:text-black'>
        <ChevronLeft className='w-4 h-4 shrink'/>
    </button>
    {
        currentPage + 2 >5 && <button className='w-7 h-7 rounded bg-white text-ncBlue ring-2 ring-ncBlue flex items-center justify-center mr-2 hover:bg-slate-200/40 transition-colors' onClick={()=>{setPage(1)}}>
            1
        </button>
    }
   {
    currentPage -2 > 4 && <PaginationEllipsis role='button' className='bg-ncBlue text-white rounded  p-0 w-7 h-7' onClick={()=>{
        setPage(Math.min(currentPage-5,maxPage))
    }}/> 
   }
    {
        currentPage - 2 >0 && <button onClick={()=>{setPage((state)=>state-2)}} className='w-7 h-7 rounded bg-white text-ncBlue ring-2 ring-ncBlue flex items-center justify-center mr-2 hover:bg-slate-200/40 transition-colors'>
        {currentPage-2}
        </button>
    }
    {
        currentPage - 1 >0 && <button onClick={()=>{setPage((state)=>state-1)}} className='w-7 h-7 rounded bg-white text-ncBlue ring-2 ring-ncBlue flex items-center justify-center mr-2 hover:bg-slate-200/40 transition-colors'>
        {currentPage-1}
        </button>
    }
    <button className='w-7 h-7 rounded bg-ncBlue text-white ring-2 ring-ncBlue flex items-center justify-center mr-2'>
        {currentPage}
        </button>
        {
        currentPage + 1 < maxPage && <button onClick={()=>{setPage((state)=>state+1)}} className='w-7 h-7 rounded bg-white text-ncBlue ring-2 ring-ncBlue flex items-center justify-center mr-2 hover:bg-slate-200/40 transition-colors'>
        {currentPage+1}
        </button>
    }
        {
        currentPage + 2 < maxPage && <button onClick={()=>{setPage((state)=>state+2)}} className='w-7 h-7 rounded bg-white text-ncBlue ring-2 ring-ncBlue flex items-center justify-center mr-2 hover:bg-slate-200/40 transition-colors'>
        {currentPage+2}
        </button>
    }
   {
    currentPage + 5 < maxPage &&  <PaginationEllipsis role='button' className='bg-ncBlue text-white rounded  p-0 w-7 h-7' onClick={()=>{
        setPage(Math.min(currentPage+5,maxPage))
    }}/>
   }
    {
        currentPage + 1 <= maxPage &&  <button onClick={()=>setPage(maxPage)} className='w-7 h-7 rounded bg-white text-ncBlue ring-2 ring-ncBlue flex items-center justify-center mr-2 hover:bg-slate-200/40 transition-colors'>
        {maxPage}
        </button>
    }
   
     <button onClick={()=>{setPage((state)=>Math.min(state+1,maxPage))}} className='w-8 h-8 rounded bg-ncBlue text-white flex items-center justify-center ml-2 disabled:bg-slate-300 disabled:text-black'>
        <ChevronRight className='w-4 h-4 shrink'/>
    </button>
    <div className="flex items-center ml-3 text-sm">
        <p>Go To Page</p>
        <Input value={targetPage||""} className='w-8 h-8 border-[1px] ml-2 mr-1 dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue px-1' max={maxPage} placeholder='1' onChange={(e)=>{
            const value = parseInt(e.target.value)
            if(!e.target.value){
                setTargetPage(null)
            }
            else{
                if (value <= maxPage){
                    setTargetPage(value)
                }
            }
        }} type='number'/> 
        <p>/ {maxPage}</p>
        <button className='w-max px-1.5 py-2 bg-ncBlue text-white rounded-md mx-2 disabled:bg-slate-300 disabled:text-black' disabled={!targetPage} onClick={()=>{
            setPage(targetPage as number)
            setTargetPage(null)
            }}>Submit</button>
    </div>
   </div>
  )
}
