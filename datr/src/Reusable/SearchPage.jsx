import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import React, { useState } from 'react'
import { CiBookmarkCheck } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
export const SearchPage = ({children,heading}) => {
    const  [searching,setSearching]=useState(false)
  return (
    <div    className='w-full   flex    flex-col   gap-2  '>
       <div className="flex flex-wrap justify-between items-center">
        <p  className='text-[1.2rem]  font-semibold'>{heading}</p>
        <div className="flex items-center gap-2 text-[1.2rem] font-extrabold">
          <CiBookmarkCheck  className='hover:text-blue-700'/>
          <CiBellOn />
          <CiTrash className='hover:text-red-700  ' />
        </div>
       <div    className={`   h-16  flex   items-center  justify-end gap-3 `}>
          
          <div className={`${searching?'lg:w-[35rem]  w-[22rem]':'w-60'} transition-all   h-12    ro   relative grid place-items-center`}>
           <input type="text" name=""  className='w-full   h-8    border-2 border-gray-400   rounded-xl  px-2  py-2  text-[0.8275rem] text-neutral-600   outline-none   ' id="" placeholder='Search' onFocus={()=>{setSearching(()=>true)}}  onBlur={()=>{setSearching(()=>false)}}/>
           <div   className={`absolute  top-12 right-0  ${searching?'block':'hidden'} h-40 w-full  shadow-md  z-[10] absolute bg-white`} >

           </div>
           </div> 
        <UserHeader searching={searching}/>
       </div>
       </div>
        {children}
    </div>
  )
}


const UserHeader=({searching})=>{
  return(
    <DropdownMenu   >
    <DropdownMenuTrigger  className={`outline-none ${searching?'hidden':'block'} `}>
    <Avatar className='w-8  aspect-square rounded-full  border-2  border-gray-400/40  grid  place-items-center' >
      <AvatarFallback>PU</AvatarFallback>
  </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent  className='w-40 outline-none bg-neutral-100 p-2 rounded-md shadow-md  z-[10]  text-[0.8275rem] text-center   '>
      <DropdownMenuItem className='outline-none h-8 grid  place-items-center'>
        <p>Account Settings</p>
      </DropdownMenuItem>
      <DropdownMenuItem className='outline-none h-8 grid  place-items-center'>
        <p>Sign Out</p>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}