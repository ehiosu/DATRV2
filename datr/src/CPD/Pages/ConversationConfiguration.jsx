import React from "react";
import { TabsContent } from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-dropdown-menu";
export const ConversationConfiguration = () => {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%]  mx-auto max-h-[80vh] md:overflow-y-auto flex flex-col p-2 gap-2"
      >
        <div className="w-full flex justify-start gap-2      items-center">
          <input type="checkbox" name="" id="" />
          <p className="text-[0.8275rem] font-semibold">
            Automatically Archive Emails
          </p>
        </div>
        <Select className="outline-none">
          <SelectTrigger className="w-48 h-7 outline-none my-1 bg-white rounded-md  dark:bg-white bg-white rounded-md outline-0 focus:ring-0 focus:outline-none focus-within:ring-0 focus-within:outline-none focus:border-0 focus-within:border-0">
            <SelectValue
              placeholder="Closed Tickets Only"
              className="text-neutral-500"
            />
          </SelectTrigger>
          <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
            <SelectItem
              value="Closed Tickets"
              className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
            >
              Closed Tickets Only
            </SelectItem>
            <Separator />
            <SelectItem
              value="DS"
              className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
            >
              Resolved Tickets and Closed Tickets
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="w-full flex justify-start gap-2 my-2 items-center">
          <input type="checkbox" name="" id="" />
          <p className="text-[0.8275rem] font-semibold">
            Automatically Archive Deleted Items
          </p>
        </div>
        <div className="w-full flex justify-start gap-2 my-2 items-center">
          <input
            type="checkbox"
            name=""
            id=""
            className="checked:bg-purple-500"
          />
          <p className="text-[0.8275rem] font-semibold">Send Email Enabled</p>
        </div>
        <div className="flex w-[20%] items-center h-10 justify-between  sm:w-40">
          <p className="text-[0.8275rem] font-semibold">Select Mailer</p>
          <p className="font-semibold text-sm text-blue-700">SMTP</p>
        </div>
        <div className="w-[60%] flex-col flex gap-3 ">
          <div className="col-span-1 flex justify-between items-center px-3 sm:px-0">
            <p className="text-[0.8275rem] font-semibold">From Email</p>
            <input
              type="email"
              name=""
              id=""
              placeholder="Email"
              className="text-sm p-2 w-72 h-8 bg-transparent focus:bg-white focus:shadow-lg transition-all outline-none border-b-4 border-gray-200"
            />
          </div>
          <div className="col-span-1 flex justify-between items-center px-3 sm:px-0">
            <p className="text-[0.8275rem] font-semibold">SMTP Username</p>
            <input
              type="email"
              name=""
              id=""
              placeholder="Username"
              className="text-sm p-2 w-72 h-8 bg-transparent focus:bg-white focus:shadow-lg transition-all outline-none border-b-4 border-gray-200"
            />
          </div>
          <div className="col-span-1 flex justify-between items-center px-3 sm:px-0">
            <p className="text-[0.8275rem] font-semibold">From Name</p>
            <input
              type="text"
              name=""
              id=""
              placeholder="Name"
              className="text-sm p-2 w-72 h-8 bg-transparent focus:bg-white focus:shadow-lg transition-all outline-none border-b-4 border-gray-200"
            />
          </div>
          <div className="col-span-1 flex justify-between items-center px-3 sm:px-0">
            <p className="text-[0.8275rem] font-semibold">SMTP Password</p>
            <input
              type="password"
              name=""
              id=""
              placeholder="Password"
              className="text-sm p-2 w-72 h-8 bg-transparent focus:bg-white focus:shadow-lg transition-all outline-none border-b-4 border-gray-200"
            />
          </div>
        </div>
        <div className="flex w-[25%] items-center h-10 justify-between  sm:w-44">
          <p className="text-[0.8275rem] font-semibold">SMPT Authentication</p>
          <p className="font-semibold text-sm text-blue-700">Yes</p>
        </div>
        <div className="flex w-[25%] items-center h-10 justify-between  sm:w-44">
          <p className="text-[0.8275rem] font-semibold">SMTP Security</p>
          <p className="font-semibold text-sm text-blue-700">StarTLS</p>
        </div>
        <div className="flex w-[25%] items-center h-10 justify-between  sm:w-44">
          <p className="text-[0.8275rem] font-semibold">PORT</p>
          <p className="font-semibold text-sm text-blue-700">587</p>
        </div>
        <button className="w-40 rounded-md h-12 my-2 bg-[#000066] text-white">
          Save Changes
        </button>
      </motion.section>
    </AnimatePresence>
  );
};
