import React, { useEffect } from 'react'
import { AiFillStar, AiOutlineArrowDown } from "react-icons/ai";
import { SearchPage } from '../../Reusable/SearchPage'
import  audio from  '/2.mp3'
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@radix-ui/react-dropdown-menu';
export const NewTicket = () => {
    useEffect(() => {
        const onMouseMove = () => {
          if (sound) {
            sound.play();
            sound.loop = false;
            window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('touchstart', onMouseMove);
    
          }
        };
    
        // Create an audio element and set its source
       const sound = new Audio(audio); // Replace with the path to your audio file
    
        // Add a mousemove event listener
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchstart',onMouseMove)
    
    
        // Clean up when the component unmounts
        return () => {
          window.removeEventListener('mousemove', onMouseMove);
          if (sound) {
            sound.pause();
          }
        };
      }, []);

  return (
    <section className="w-full  p-4 lg:p-2 max-h-screen overflow-y-auto">
        <SearchPage heading={'New Ticket'}>
        <div className="w-full  ">
        <ol className="list-reset flex  h-full">
          <li>
            <Link to={"/CP/Dashboard"}>
              <a
                href="#"
                classNmae="text-primary font-bold transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
              >
                Dashboard
              </a>
            </Link>
          </li>
          <li>
            <span className="mx-2 text-neutral-500 dark:text-neutral-400">
              /
            </span>
          </li>
          <li className="text-blue-400/50">Library</li>
        </ol>
      </div>
      <p className="text-2xl font-semibold text-neutral-500 my-2">New Ticket</p>

        <div className="md:grid w-[100%] p-2  lg:w-[70%]   flex  flex-col  md:grid-flow-row md:grid-cols-2   gap-2">
        <div className="col-span-1 lg:h-12 h-20 flex gap-2   items-center">
          <div className="flex  text-sm items-center  font-semibold">
            <p className="  text-[#172B4D]">Complainant Name</p>
            <AiFillStar className="text-red-500" />
          </div>
          <input
            type="text"
            name=""
            id=""
            className="w-[65%] h-8 outline-none  border-b-2  border-gray-200"
          />
        </div>

        <div className="col-span-1 md:h-12 flex gap-2 items-center md:my-0  my-2">
          <div className="flex  text-sm items-center  font-semibold">
            <p className="  text-[#172B4D]">Complainant Email</p>
            <AiFillStar className="text-red-500" />
          </div>
          <input
            type="text"
            name=""
            id=""
            className="w-[65%] h-8 outline-none  border-b-2  border-gray-200"
          />
        </div>

        {/* Row-1-above */}

        <div className="col-span-1 md:h-12 flex gap-2 items-center">
          <div className="flex  text-sm items-center  font-semibold">
            <p className="  text-[#172B4D]">Complainant Name</p>
            <AiFillStar className="text-red-500" />
          </div>
          <div className="w-[65%] relative">
           <Select className='outline-none'>
            <SelectTrigger className='w-full h-8 outline-none bg-white rounded-md '>
            <SelectValue placeholder="Complaint" className='text-neutral-500' />
            </SelectTrigger>
            <SelectContent  className='w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none'>
                <SelectItem value='AS' className=' text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center'>
                    Airline Services
                </SelectItem>
                <Separator/>
                <SelectItem className=' text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer' value='Ml'>
                    Missing Luggage
                </SelectItem>
                <Separator/>
                <SelectItem className=' text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer' value='BF'>
                    Bad Food
                </SelectItem>
            </SelectContent>
           </Select>
          
          </div>
        </div>
        <div className="col-span-1 md:h-12 flex gap-2 items-center">
          <div className="flex  text-sm items-center  font-semibold">
            <p className="  text-[#172B4D]">Complainant Phone</p>
            <AiFillStar className="text-red-500" />
          </div>
          <input
            type="text"
            name=""
            id=""
            className="w-[65%] h-8 outline-none  border-b-2  border-gray-200"
          />
        </div>

        {/* Row-2-Above */}

        <div className="col-span-1 h-12 flex gap-2 items-center">
          <div className="flex  text-sm items-center  font-semibold justify-start gap-2">
            <p className="  text-[#172B4D]  w-max ">Date/Time of Incidient</p>
            <AiFillStar className="text-red-500 text-[0.875rem]" />
          </div>
          <input
            type="date"
            name=""
            id=""
            className="w-[65%] h-8 outline-none  border-b-2  border-gray-200 ml-2"
          />
        </div>
        <div className="col-span-1 h-12 flex gap-2 items-center">
          <div className="flex  text-sm items-center  font-semibold">
            <p className="  text-[#172B4D]">Route</p>
            <AiFillStar className="text-red-500" />
          </div>
          <input
            type="text"
            name=""
            id=""
            className="w-[65%] h-8 outline-none  border-b-2  border-gray-200"
          />
        </div>

        {/* row-3-above */}
        <div className="md:col-span-2 md:grid md:grid-cols-2  flex  items-center  justify-start w-full   ">
          <div className="col-span-1 h-12 flex gap-2 items-center">
            <div className="flex  text-sm items-center  font-semibold md:w-max gap-2  w-24  justify-start ">
              <p className="  text-[#172B4D]  md:w-max  w-20">Source of Complaint</p>
              <AiFillStar className="text-red-500" />
            </div>
            <input
              type="text"
              name=""
              id=""
              className=" flex-1  ml-auto md:w-[65%]  w-full h-8 outline-none  border-b-2  border-gray-200  p-2 focus:cursor-pointer"
            />
          </div>
        </div>
        {/* row-4-above */}

        <div className="col-span-2 h-auto flex gap-2 ">
          <div className="flex  text-sm items-center  font-semibold">
            <p className="  text-[#172B4D]"> Complaint Detail</p>
            <AiFillStar className="text-red-500" />
          </div>
          <textarea
            name=""
            id=""
            cols="30"
            rows="5"
            className="w-[65%] h-28  max-h-28 outline-none  border-b-2  border-gray-200  p-2 focus:cursor-pointer"
          ></textarea>
        </div>

        {/* row-5-above */}
        <div className="md:col-span-2 md:grid  flex items-center md:grid-cols-2  md:h-12 my-2">
          <div className="md:col-span-1  md:h-12 flex gap-2 items-center">
            <div className="flex  text-sm items-center  font-semibold md:w-max  w-24">
              <p className="  text-[#172B4D]">Redress Sought</p>
              <AiFillStar className="text-red-500" />
            </div>
            <input
              type="text"
              name=""
              id=""
              className="w-[65%] h-16 outline-none  border-b-2  border-gray-200  p-2 focus:cursor-pointer ml-2"
            />
          </div>
        </div>

        {/* row-6-above */}
        <div className="md:col-span-2 md:grid md:grid-cols-2 flex items-center md:h-12">
          <div className="col-span-1 h-12 flex gap-2 items-center">
            <div className="flex  text-sm items-center  font-semibold">
              <p className="  text-[#172B4D]">Attachments</p>
            </div>
            <input
              type="file"
              name=""
              id=""
              
              className="w-max  h-10 border-2   flex  items-center   rounded-md  bg-transparent border-[#000066]  text-[#000066] p-1 focus:cursor-pointer"
            />
          
            
          </div>
        </div>

        {/* row-7-above */}

        <div className="col-span-1 h-12 flex gap-2 items-center">
          <div className="flex  text-sm items-center  font-semibold">
            <p className="  text-[#172B4D]">Airline</p>
            <AiFillStar className="text-red-500" />
          </div>
          <div className="w-[65%] relative">
          <Select className='outline-none'>
            <SelectTrigger className='w-full h-8 outline-none bg-white rounded-md '>
            <SelectValue placeholder="Airline Services" className='text-neutral-500' />
            </SelectTrigger>
            <SelectContent  className='w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none'>
                <SelectItem value='AS' className=' text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center'>
                    Dana Air
                </SelectItem>
                <Separator/>
                <SelectItem className=' text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer' value='Ml'>
                    Max Air
                </SelectItem>
                <Separator/>
                <SelectItem className=' text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer' value='BF'>
                    Air Peace
                </SelectItem>
            </SelectContent>
           </Select>
           
          </div>
        </div>
        <div className="col-span-1 h-12 flex gap-2 items-center">
          <div className="flex  text-sm items-center  font-semibold">
            <p className="  text-[#172B4D]">Location</p>
            <AiFillStar className="text-red-500" />
          </div>
          <div className="w-[65%] relative">
          <Select className='outline-none'>
            <SelectTrigger className='w-full h-8 outline-none bg-white rounded-md '>
            <SelectValue placeholder="Location" className='text-neutral-500' />
            </SelectTrigger>
            <SelectContent  className='w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none'>
                <SelectItem value='AS' className=' text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center'>
                   MMA 
                </SelectItem>
                <Separator/>
                <SelectItem className=' text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer' value='Ml'>
                    MMA II
                </SelectItem>
                <Separator/>
          
            </SelectContent>
           </Select>
        
          </div>
        </div>

        {/* row-8-above */}
        <div className="  md:col-span-2 md:grid  col-span-1  md:grid-cols-2  md:h-12 ">
          <div className="col-span-1 h-12 flex gap-2 items-center">
            <div className="flex  text-sm items-center  font-semibold">
              <p className="  text-[#172B4D]">Priority</p>
              <AiFillStar className="text-red-500" />
            </div>
            <div className="w-[35%] relative">
            <Select className='outline-none'>
            <SelectTrigger className='w-full h-8 outline-none bg-white rounded-md '>
            <SelectValue placeholder="Critical" className='text-neutral-500' />
            </SelectTrigger>
            <SelectContent  className='w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none'>
                <SelectItem value='AS' className=' text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center'>
                    Critical
                </SelectItem>
                <Separator/>
                <SelectItem className=' text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer' value='Ml'>
                    Morderate
                </SelectItem>
                <Separator/>
            
            </SelectContent>
           </Select>
            
            </div>
          </div>
        </div>
        <div className="flex md:w-auto w-60  my-4 ml-6 p-1 md:space-x-6  space-x-2">
          <button className="md:w-52 h-12 text-white bg-[#000066] rounded-md  w-1/2">
            Cancel
          </button>
          <button className="md:w-52 h-12 text-[#000066] bg-white border-2 border-[#000066] rounded-md  w-1/2">
            Submit
          </button>
        </div>
      </div>
        </SearchPage>
    </section>
  )
}
