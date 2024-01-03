import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { CiCalendar } from "react-icons/ci";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@radix-ui/react-dropdown-menu';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useNavigate, useParams } from "react-router";

export const CreateEntry = () => {
  const [date, setDate] = useState();
  const nav=useNavigate()
  const {Location}=useParams()
  return (
    <main className="w-full h-full">
      <SearchPage heading={"New Entry"}>
        <div className="w-[80%] mx-auto flex-col flex">
       <div className="flex items-center gap-2">
       <p className="text-neutral-600 text-[0.9rem] font-semibold">Date:</p>
          <Popover>
            <PopoverTrigger asChild>
              
              <Button
                variant={"outline"}
                className={cn(
                  "w-60 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CiCalendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span> Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
       </div>
      <div className="flex items-center flex-wrap w-full gap-3">
      <div className="flex md:w-[45%] w-full items-center justify-between my-2 gap-2">
            <p className="whitespace-nowrap flex items-center gap-2">Flight Number <AiFillStar className="text-red-700"/></p>
            <input type="text" className="flex-1  outline-none p-2" placeholder="JKV201..."/>
       </div>
       <div className="flex md:w-[45%] w-full items-center justify-between my-2 gap-2">
            <p className="whitespace-nowrap flex items-center gap-2">Route <AiFillStar className="text-red-700"/></p>
            <input type="text" className="flex-1  outline-none p-2" placeholder="LOS..."/>
       </div>
      </div>

      <div className="flex items-center flex-wrap w-full gap-3">
      <div className="flex md:w-[45%] w-full items-center justify-between my-2 gap-2">
            <p className="whitespace-nowrap flex items-center gap-2">STA <AiFillStar className="text-red-700"/></p>
            <input type="text" className="flex-1  outline-none p-2" placeholder="10:30..."/>
       </div>
       <div className="flex md:w-[45%] w-full items-center justify-between my-2 gap-2">
            <p className="whitespace-nowrap flex items-center gap-2">ATA <AiFillStar className="text-red-700"/></p>
            <input type="text" className="flex-1  outline-none p-2" placeholder="12:30..."/>
       </div>
      </div>
      <div className="flex items-center gap-4 my-2">
      <p className="whitespace-nowrap flex items-center gap-1">Is Delayed <AiFillStar className="text-red-700"/></p>
        <input type="checkbox" name="" id="" />
      </div>
      <div className="flex items-center gap-4 my-3">
      <p className="whitespace-nowrap flex items-center gap-1">Is On Time <AiFillStar className="text-red-700"/></p>
        <input type="checkbox" name="" id="" />
      </div>
      <div className="flex items-center gap-4 my-3">
      <p className="whitespace-nowrap flex items-center gap-1">Is Cancelled <AiFillStar className="text-red-700"/></p>
        <input type="checkbox" name="" id="" />
      </div>
      <p className="text-[0.8275rem] text-center font-semibold text-neutral-500 ">Ensure You Only Tick One of These Boxes.</p>
    <div className="flex items-center gap-3">
        <p className="whitespace-nowrap flex items-center gap-1">Report Type:</p>
        <Select className="outline-none">
                <SelectTrigger className="w-48 h-7 outline-none my-1 bg-white rounded-md ">
                  <SelectValue
                    placeholder="Report Type"
                    className="text-neutral-500"
                  />
                </SelectTrigger>
                <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                  <SelectItem
                    value="In"
                    className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
                  >
                    Arrival
                  </SelectItem>
                  <Separator />
                  <SelectItem
                    value="DS"
                    className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
                  >
                    Departure
                  </SelectItem>
            
                </SelectContent>
              </Select>
    </div>
    <div className="flex items-center gap-4 my-3">
      <p className="whitespace-nowrap flex items-center gap-1">Remark: <AiFillStar className="text-red-700"/></p>
        <input type="text" className="w-full h-20" name="" id="" />
      </div>
    <div className="flex gap-4 items-center my-6">
        <button className="w-56 h-10 rounded-lg shadow-md bg-darkBlue text-white" onClick={()=>{nav(`/DAS/${Location}/Dashboard`)}}>Submit</button>
        <button className="w-56 h-10 rounded-lg shadow-md bg-lightPink text-white " onClick={()=>{nav(`/DAS/${Location}/Dashboard`)}}>Cancel</button>

    </div>
        </div>
       
        
      </SearchPage>
    </main>
  );
};
