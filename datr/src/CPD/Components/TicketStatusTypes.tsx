import React from "react";
import { StatusTypeEntries, statusType } from "../data/data.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { MdClose } from "react-icons/md";
import { BsPlus } from "react-icons/bs";
import { Check } from "lucide-react";

export const TicketStatusTypes = () => {
  return (
    <div className="w-full flex flex-col ">
      <p className="text-[1rem] ml-2 font-semibold  my-4">Status Type</p>
      <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
        <div className="flex justify-between items-center pl-10 pr-5  bg-neutral-200 py-2 font-semibold text-[0.75rem]">
          <p className="">Status Types</p>
          <p>Color</p>
        </div>
        <div className="flex flex-col gap-3">
          {StatusTypeEntries.map((singleEntry: statusType, index: number) => {
            return <StatusEntry {...singleEntry} />;
          })}
        </div>
      </div>
      <Dialog>
        <DialogTrigger className="mt-4 w-max px-6 text-[0.9rem] font-semibold bg-darkBlue cursor-pointer hover:bg-purple-500  text-white rounded-md py-2">
          Save Changes
        </DialogTrigger>
        <DialogContent className="flex flex-col ">
          <DialogClose></DialogClose>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-darkBlue text-[1.2rem] font-semibold">
              Changed Successfully
            </p>
            <span className="w-[20%] aspect-square rounded-full bg-blue-300 text-white grid place-items-center my-2">
              <Check className="w-full aspect-square" />
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatusEntry = ({ color, title, state }: statusType) => {
  return (
    <div className="flex items-center px-5 text-[0.75rem] py-2 bg-white border-2 border-neutral-200">
      <input
        type="checkbox"
        defaultChecked={state}
        name=""
        className="rounded-full"
        id=""
      />
      <p className="ml-2 font-semibold">{title}</p>
      <span
        className="ml-auto block w-3 rounded-full aspect-square"
        style={{ backgroundColor: `${color}` }}
      ></span>
    </div>
  );
};
