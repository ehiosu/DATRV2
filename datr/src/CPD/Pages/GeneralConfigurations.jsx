import { TabsContent } from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import React, { useState } from "react";
import { AiOutlineArrowDown, AiOutlinePlus } from "react-icons/ai";

export const GeneralConfigurations = () => {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%]  p-1  flex flex-col  mx-auto  md:overflow-y-auto"
      >
        <p className="font-semibold text-[1..2rem]">Language</p>
        <LanguageSelector
          data={["English Us", "English Uk", "Polish", "French", "Spanish"]}
          defaultText="Select A Language..."
          selectedText="Current Language Selection"
        />
        <div className="flex gap-2 items-center my-3 text-[0.8275rem] text-neutral-600">
          {/* <Checkbox className='form-check' /> */}
          <input
            type="checkbox"
            name=""
            className="checked:bg-darkBlue/40 "
            id=""
          />
          <p>Show Notification Messages</p>
        </div>
        <div className="flex gap-2 items-center my-3 text-[0.8275rem] text-neutral-600">
          {/* <Checkbox className='form-check' /> */}
          <input
            type="checkbox"
            name=""
            className="checked:bg-darkBlue/40 "
            id=""
          />
          <p>Show Desktop Widget</p>
        </div>
        <div className="flex gap-2 items-center my-3 text-[0.8275rem] text-neutral-600">
          {/* <Checkbox className='form-check' /> */}
          <input
            type="checkbox"
            name=""
            className="checked:bg-darkBlue/40 "
            id=""
          />
          <p>Enable Email Tickets</p>
        </div>

        <p className="font-semibold text-[1.2rem]">Language</p>
        <LanguageSelector
          data={["24/7 Calendar", "24/5 Calendar"]}
          defaultText="Select A Work Schedule..."
          selectedText="Selected Schedule"
        />
        <div className="flex items-center gap-3 my-3">
          <div className=" w-7 aspect-square bg-darkBlue text-white grid place-items-center hover:cursor-pointer">
            <AiOutlinePlus />
          </div>
          <p className="text-[1rem] font-semibold">Add Holiday Exception</p>
        </div>
        <p className="font-semibold text-[1.2rem] mt-4 mb-2">
          Security Settings
        </p>
        <div className="flex gap-2 items-center my-1 text-[0.8275rem] text-neutral-600">
          {/* <Checkbox className='form-check' /> */}
          <input
            type="checkbox"
            name=""
            className="checked:bg-darkBlue/40 "
            id=""
          />
          <p>Disable Company Single-sign-ons</p>
        </div>
        <div className="flex gap-2 items-center my-2 text-[0.8275rem] text-neutral-600">
          {/* <Checkbox className='form-check' /> */}
          <input
            type="checkbox"
            name=""
            className="checked:bg-darkBlue/40 "
            id=""
          />
          <p>
            Password must contain a capital letter, number, symbol, and must be
            at least 8 characters long
          </p>
        </div>
        <div className="flex gap-2 items-center my-1 text-[0.8275rem] text-neutral-600">
          {/* <Checkbox className='form-check' /> */}
          <input
            type="checkbox"
            name=""
            className="checked:bg-darkBlue/40 "
            id=""
          />
          <p>Enable MFA For All Users</p>
        </div>
        <p className="font-semibold text-[1.2rem] mt-4 mb-2">
          Location,Zone and Terminal Settings
        </p>
        <div className="flex gap-2 items-center my-1 text-[0.8275rem] text-neutral-600">
          {/* <Checkbox className='form-check' /> */}
          <input
            type="checkbox"
            name=""
            className="checked:bg-darkBlue/40 "
            id=""
          />
          <p>Disable Manual Setup</p>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

const LanguageSelector = ({ defaultText, data = [], selectedText }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // const options=[
  //     "English US","English UK","French","Polish","Dutch"
  // ]
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex justify-between items-center  md:w-[25rem] min-w-[14rem] max-w-full px-4  rounded-full bg-white h-8 border-2 border-neutral-400  py-2 font-semibold mt-3 md:text-[0.9rem] text-[0.82rem]">
          {value
            ? `${selectedText}: ` +
              value[0].toUpperCase() +
              value.slice(1, value.length)
            : `${defaultText}`}{" "}
          <AiOutlineArrowDown />
        </button>
      </PopoverTrigger>
      <PopoverContent className="  w-[] bg-white" side="bottom">
        <Command>
          <CommandInput
            placeholder="Search Language..."
            className="h-6 text-neutral-400 border-b-2 border-b-neutral-600    px-2  shadow-none  outline-none rounded-none focus:outline-none border-none my-2"
          />
          <CommandEmpty className="text-neutral-400 text-[0.6275erm] text-center my-2">
            Language Doesn't Exist.
          </CommandEmpty>
          <CommandGroup>
            {data.map((option) => {
              return (
                <CommandItem
                  key={option}
                  onSelect={(currentvalue) => {
                    setValue(currentvalue);
                    setOpen(false);
                  }}
                >
                  {option}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
