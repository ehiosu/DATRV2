import React from 'react'
import { home_pages } from '../data'
import { useAuth } from '@/api/useAuth'

import { Link } from 'react-router-dom';
import {motion} from "framer-motion"
import clouds from "/clouds.png"
import rest from "/rest-of-404.png"
export const AccessNotGranted = () => {
    const {user}=useAuth()
    const home_page =home_pages[user.roles[user.roles.length-1] as keyof typeof home_pages]
  return (
    <main className="w-full h-screen relative flex flex-col items-center justify-center">
        <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png" className='absolute top-4 left-4 w-32 rounded object-cover ' alt="" />
        {/* <motion.img 
  initial={{ y: 0 }} 
  animate={{ y: [-8, 8] }} 
  transition={{ 
    duration: 2, // Total duration for the complete cycle
    ease: "easeInOut",
    repeat: Infinity, // Repeat the animation infinitely
    repeatType: "mirror" // Make it yoyo (back and forth)
  }} 
  src={notfound}
  className="w-[40%] min-w-[360px] object-contain" 
  alt="" 
/> */}
<div className='w-[40%] min-w-[360px] object-contain relative '>
<motion.img
initial={{ y: 0 }} 
animate={{ y: [-8, 8] }} 
transition={{ 
  duration: 2, // Total duration for the complete cycle
  ease: "easeInOut",
  repeat: Infinity, // Repeat the animation infinitely
  repeatType: "mirror" // Make it yoyo (back and forth)
}} 
src={clouds} className='w-full object-contain absolute top-0 left-0 z-[5]' alt="" />
<img className="w-full object-contain" src={rest} alt="" />
</div>
      
      <Link  to={home_page} className="flex flex-col justify-center text-center w-max px-6 font-semibold py-2 mt-2 bg-ncBlue text-white rounded">
        Go Home
      </Link>
    </main>
  )
}
