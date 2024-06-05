import { AnimatePresence, useMotionValueEvent, useScroll,motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { TextGenerateEffect } from './components/ui/TextGenerate';

export const Landing = () => {
  const {scrollYProgress}=useScroll();
  const [scrollPosition,SetScrollPosition]=useState(0)
  const [collapsed,setCollapsed]=useState(false)
  useMotionValueEvent(scrollYProgress,"change",(current:number)=>{
   SetScrollPosition(current)
  }); 

  // data-state={scrollPosition>0.07?"collapsed":"expanded"}
 useEffect(()=>{
console.log(scrollPosition)
 },[scrollPosition])
  return (
    <AnimatePresence mode='wait'>

   <main className='w-full flex flex-col overflow-x-hidden'>
    <nav className=' bg-ncBlue data-[state=expanded]:h-16 data-[state=collapsed]:h-12 data-[state=collapsed]:rounded-full data-[state=expanded]:rounded-none data-[state=expanded]:w-full data-[state=collapsed]:w-40 sticky data-[state=collapsed]:top-4 data-[state=expanded]:top-0 mx-auto transition-all duration-500 flex items-center px-8 py-3 z-[20]' data-state={"expanded"} >
      <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png" className='h-full aspect-square rounded-full object-contain' alt="" />
      <p className='md:text-2xl text-lg text-white ml-2 tracking-wider font-semibold'>NCAA CPD PORTAL</p>
      <div className='h-full px-4 py-1 flex items-center bg-[rgb(0,6,133)] ml-auto space-x-6 text-sm  md:text-[1rem] text-white rounded-md'>
       <Link to={"/Auth"} className='hover:border-b-2 hover:border-b-white h-full w-16 text-center flex items-center justify-center'>
          Sign In       
       </Link>
       <Link className='hover:border-b-2 hover:border-b-white h-full w-16 text-center flex items-center justify-center' to={"/Create-Account"}>
          Register      
       </Link>

      </div>
      </nav>
    <div className="flex h-[60vh] w-full bg-[#F3F8FE] parallax-bg">
      <div className="flex-[1] text-black flex flex-col items-center ">
      <TextGenerateEffect words='Streamline Your Support: Track Tickets, Flights, and Reports in One Place'containerClass='mt-16 tracking-widest text-black md:w-[60%] lg:w-[50%] mb-4 text-center '  className="  text-slate-900 md:text-3xl text-xl font-[500] tracking-widest"/>
 <TextGenerateEffect words='Unify your support: Simplify ticket management, gain flight insights, and unlock powerful reporting.' className='text-sm  text-white  font-[400] mt-2' containerClass='md:w-[60%] lg:w-[40%]  text-center mt-4   text-black  leading-2 '/>
 <a href='https://ncaa.gov.ng/report-forms' className="inline-flex h-12 animate-shimmer items-center justify-center rounded-full mt-4 border  border-slate-800 bg-[linear-gradient(110deg,#f8f9fa,55%,#f1f1f1)] bg-[length:200%_100%] px-6 font-medium text-ncBlue transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mx-auto">Log a Complaint</a>
      </div>
      
    </div>

    <section className=''>
      <div className='w-full h-[5vh] bg-ncBlue'/>
      <div className=' md:px-12 w-full  px-4'>
       <FirstSection/>
       <SecondSection/>
       <ThirdSection/>
</div>

    </section>
    <Footer/>
   </main>
   </AnimatePresence>

  )
}

{/* <div className='md:h-[91vh] flex justify-center parallax-bg'>
<div className="py-4 h-auto bg-ncBlue w-[65%] text-white flex flex-col items-center">
 <TextGenerateEffect words='Welcome'containerClass='mt-16 tracking-widest'  className=" text-5xl font-[500] tracking-widest"/>
 <TextGenerateEffect words='Discover our Complaints Management Portal, your trusted hub for aviation data and information' className='text-sm text-neutral-200  font-thin mt-2' containerClass='w-[40%] text-center leading-2 '/>
 <a href='https://ncaa.gov.ng/report-forms' className="inline-flex h-12 animate-shimmer items-center justify-center rounded-full mt-4 border  border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">Log a Complaint</a>
</div>
</div> */}

const FirstSection=()=>{
  return(
    <section className=' flex flex-col lg:flex-row items-center relative'>
    <div className="flex-[1] flex flex-col items-center h-full"> 
    <div className="lg:w-[60%] w-full lg:text-start text-center sticky top-[10%] mt-[10%]">
     <TextGenerateEffect words='Resolve Issues Faster: Streamlined Complaint Creation, Assignment, and Escalation' containerClass='w-full ' className='text-black tracking-wider text-xl lg:text-xl xl:text-4xl  ' />
      <p className='lg:text-[0.8rem] xl:text-sm xl:line-clamp-none line-clamp-5 text-[0.75rem] font-[400] mt-4 lg:leading-[1.6rem]'>
      Unify your support: Simplify ticket management, gain flight insights, and unlock powerful reporting.  Resolve Issues Faster: Streamlined Complaint Creation, Assignment, and Escalation. Eliminate ticket chaos with a user-friendly system for creating, assigning, and escalating complaints. <br/> Empower agents to quickly capture issues, ensure clear ownership, and seamlessly escalate complex cases for timely resolution. Focus on what matters: providing exceptional support, not managing a ticketing nightmare.
      </p>
     </div>
    </div>
     <div className="flex-[0.65]  ">
     <motion.div initial={{x:70,opacity:0}} whileInView={{x:0,opacity:100}} transition={{duration:0.5,delay:0.3}} className='h-[40vh]     sticky  top-0 '>
      <div className="absolute w-[125px] md:w-[250px] aspect-square border-4 border-ncBlue rounded-lg md:-top-8 md:-bottom-0 -bottom-8 md:-right-0 -right-4 md:-left-8">

      </div>
   <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1716910983/asseco-ncaa/tickets_xdfuk1.png" className='aspect-video h-full rounded-lg shadow-lg relative z-[10]' alt="" />
</motion.div>
     </div>
     </section>
  )
}

const SecondSection=()=>{
  return(
    <section className=' w-full  relative'>
      
        <div className='md:w-[80%] w-full mx-auto'>
        <div className="flex items-center justify-center mt-[5vh] space-x-3 my-4 ">
        <span className='w-20 h-[1px] bg-ncBlue'></span>
        <p className='text-lg font-semibold text-ncBlue text-center'>Your Central Hub for Powerful Support Analytics</p>
        <span className='w-20 h-[1px] bg-ncBlue'></span>

      </div>
      <div className='flex flex-row justify-center items-center flex-wrap  gap-y-8 gap-x-8 mt-[4vh]'>
      <div className="col-span-1 w-64 h-[18rem] rounded-lg shadow-md border-[2px] border-ncBlue p-2 z-[10] ">
          {/* bg-[linear-gradient(174.2deg,#FFF4E4 7.1%,#F0F6EE 67.4%)] */}
            <div className="w-full h-1/2 card-top flex items-center justify-center bg-opacity-20 rounded-t-lg">
              <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1716931139/asseco-ncaa/Data_extraction-rafiki_mi8hcr.png" className='w-full h-full object-contain' alt="" />
            </div>
            <p className='font-semibold mb-2'>Consolidated Data</p>
            <p className='text-sm text-neutral-500'>Ditch the spreadsheets! Our secure data hub acts as a central repository for all your support data, from tickets and flights to personnel activity.</p>

          </div>
          <div className="col-span-1 w-64 h-[18rem] rounded-lg shadow-md border-[2px] border-ncBlue p-2 z-[10]">
          {/* bg-[linear-gradient(174.2deg,#FFF4E4 7.1%,#F0F6EE 67.4%)] */}
            <div className="w-full h-1/2 bg-gradient-to-r from-rose-100 to-teal-100 flex items-center justify-center bg-opacity-20 rounded-t-lg">
              <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1716931148/asseco-ncaa/Online_report-bro_y3mmeh.png" className='w-full h-[80%] object-contain' alt="" />
            </div>
            <p className='font-semibold mb-2'>Effortless Reporting</p>
            <p className='text-sm text-neutral-500'>Generate comprehensive reports with a few clicks. Analyze key metrics like resolution times, flight performance, and agent effectiveness.</p>

          </div>
          <div className="col-span-1 w-64 h-[18rem] rounded-lg shadow-md border-[2px] border-ncBlue p-2 z-[10]">
          {/* bg-[linear-gradient(174.2deg,#FFF4E4 7.1%,#F0F6EE 67.4%)] */}
            <div className="w-full h-1/2 card-top flex items-center justify-center bg-opacity-20 rounded-t-lg">
              <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1716931152/asseco-ncaa/Consulting-bro_m2fjur.png" className='w-full h-full object-contain' alt="" />
            </div>
            <p className='font-semibold mb-2'>Actionable Insights</p>
            <p className='text-sm text-neutral-500'>Identify trends, pinpoint areas for improvement, and optimize your support processes for unparalleled efficiency.</p>

          </div>
          <div className="col-span-1 w-64 h-[18rem] rounded-lg shadow-md border-[2px] border-ncBlue p-2 z-[10]">
          {/* bg-[linear-gradient(174.2deg,#FFF4E4 7.1%,#F0F6EE 67.4%)] */}
            <div className="w-full h-1/2 bg-gradient-to-r from-rose-100 to-teal-100 flex items-center justify-center bg-opacity-20 rounded-t-lg">
              <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1716931151/asseco-ncaa/Report-pana_sdyiiq.png" className='w-full h-[80%] object-contain' alt="" />
            </div>
            <p className='font-semibold mb-2'>Data-Driven Decisions</p>
            <p className='text-sm text-neutral-500'>Make informed choices based on real-world data, not gut feeling. Empower your team to drive positive change.</p>

          </div>
          <div className="col-span-1 w-64 h-[18rem] rounded-lg shadow-md border-[2px] border-ncBlue p-2 z-[10] ">
          <div className="w-full h-1/2 card-top flex items-center justify-center bg-opacity-20 rounded-t-lg">
              <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1716931124/asseco-ncaa/Data_report-bro_iurfjt.png" className='w-full h-full object-contain' alt="" />
            </div>
            <p className='font-semibold mb-2'>Always Accessible</p>
            <p className='text-sm text-neutral-500'>Access reports and historical data anytime, anywhere, for a complete picture of your support operations.</p>

          </div>
      </div>
        </div>
    
    </section>
  )
}

const ThirdSection=()=>{
  return(
    <section className='  relative w-full  px-6 md:pb-4 pb-10'>
        <div className='flex flex-col lg:flex-row items-center justify-between bg-ncBlue rounded-xl px-4 w-full lg:w-[80%] sticky mt-[10%] top-[10%]  lg:h-[60%] mx-auto  py-6'>
          <div className="flex-1 flex flex-col py-3 md:px-6 h-full text-white justify-center">
            <p className='text-2xl font-semibold'> Track Complaint Progress and History with Ease.</p>
            <p className='text-sm text-neutral-100 font-thin w-[80%] md:line-clamp-none line-clamp-5'>Never lose track of a complaint again. Our intuitive system provides a comprehensive view of each complaint's progress, from initial submission to final resolution.  Access detailed communication history, track escalations, and gain complete transparency into the entire process. This empowers you to provide accurate updates to customers, identify potential delays, and ensure a smooth, efficient resolution for every complaint.</p>
          </div>
          <div className="flex-1 p-2 relative">
          <div className="absolute w-[120px] md:w-[180px] aspect-square border-4 border-white -top-4 md:-top-8 -left-8 rounded-lg">

</div>
            <motion.img initial={{opacity:0}} whileInView={{opacity:100}} transition={{duration:0.8,delay:0.4,ease:"easeOut"}} src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1716925229/asseco-ncaa/ticket-2_rkpkir.png" className='h-[30%] aspect-video shadow-md  card-3d rounded-lg ring-2 ring-offset-2 ring-offset-white p-1 relative z-[10] max-h-[240px] aspect-video' alt="" />
          </div>
        </div>
     </section>
  )
}

const Footer=()=>{
  return(
    <footer className='w-full flex items-center justify-center px-4 bg-ncBlue text-white py-6 space-x-6'>
      <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png" className='w-24 aspect-square' alt="" />
     
      <div className="flex flex-col items-center justify-center px-4 space-y-3 " >
        <p className='text-neutral-200'>Quick Links</p>
        <a href="https://ncaa.gov.ng/" className='text-sm'>NCAA Home</a>
        <a href="https://ncaa.gov.ng/about/" className='text-sm'>About</a>
        <a href="" className='text-sm'>Privacy</a>
        <a href="" className='text-sm'>Copyright</a>
        <a href="" className='text-sm'>Cookies</a>
      </div>
    
    </footer>
  )
}