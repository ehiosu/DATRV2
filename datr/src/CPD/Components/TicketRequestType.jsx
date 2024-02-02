import React, { useRef } from "react";
import {
  AiOutlineArrowDown,
  AiOutlineClose,
  AiOutlinePlus,
} from "react-icons/ai";
import { requestEntries } from "../data/data.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog.tsx";
import { Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Input } from "../../components/ui/input.tsx";
export const TicketRequestType = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-[1rem] ml-2 font-semibold ">Request Type</p>
      <AlertDialog>
        <AlertDialogTrigger className="w-max px-4 flex gap-3 items-center bg-blue-300 rounded-md text-white h-max py-2">
          Add New Request
          <AiOutlinePlus className="text-[0.95rem]" />
        </AlertDialogTrigger>
        <AlertDialogContent className="flex flex-col">
          <AlertDialogCancel className="w-max ml-auto border-none">
            <AiOutlineClose />
          </AlertDialogCancel>
          <div className="flex items-center gap-2">
            <p className="md:w-[20%] text-darkBlue font-semibold text-[0.8275rem]">
              Category
            </p>
            <Select defaultValue="airline_problems">
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="airline_problems">
                  Airline Problems
                </SelectItem>
                <SelectItem value="service issues">Service Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <p className="md:w-[20%] text-darkBlue font-semibold text-[0.8275rem]">
              Request
            </p>
            <Input
              placeholder="Rude Staff"
              className="dark:focus:outline-transparent dark:focus:ring-transparent dark:focus-within:ring-transparent dark:focus:ring-offset-transparent "
            />
          </div>
          <button className="block h-8 mt-4 bg-darkBlue text-white hover:cursor-pointer hover:bg-purple-400 transition-colors hover:ring-2  hover:ring-offset-4  rounded-md hover:ring-purple-300">
            Submit
          </button>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-full max-h-[50vh] transition-all overflow-y-auto">
        <div className="pl-10 pr-3 flex justify-between items-center bg-neutral-300 py-2">
          <p className="text-[0.8275rem] font-bold">Request Type</p>
          <input type="checkbox" className="rounded-full " name="" id="" />
        </div>
        <TicketManager />
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

const TicketManager = () => {
  return (
    <div className="w-full flex-1 max-h-[60vh]">
      {requestEntries.map((requestBlock) => {
        return <TicketRequestBlock {...requestBlock} />;
      })}
    </div>
  );
};

const TicketRequestBlock = ({ data, title }) => {
  const toggleCheckAll = (state) => {
    const checks = document.querySelectorAll(`.${title.replace(" ", "_")}`);
    checks.forEach((check) => {
      console.log(check);
      check.checked = state;
    });
  };
  return (
    <Collapsible>
      <div className="flex flex-col">
        <div className="flex justify-between items-center pl-5 pr-3 py-2 bg-blue-300/20 text-darkBlue ">
          <CollapsibleTrigger className="flex items-center gap-2">
            {data?.length > 0 && <AiOutlineArrowDown className="text-xs" />}
            <p className="font-semibold text-[0.8275rem]">{title}</p>
          </CollapsibleTrigger>
          <input
            type="checkbox"
            className="rounded-full "
            name=""
            id=""
            onChange={(e) => {
              toggleCheckAll(e.target.checked);
            }}
          />
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-1 ">
            {data.map((entry, index) => {
              return (
                <SingleTicketComponent
                  {...entry}
                  index={index}
                  groupName={title.replace(" ", "_")}
                />
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const SingleTicketComponent = ({ title, state, groupName }) => {
  return (
    <div className="flex items-center justify-between pl-6 py-1 bg-neutral-100 pr-3">
      <p className="font-semibold text-[0.75rem]">{title}</p>
      <input
        type="checkbox"
        className={`rounded-full ${groupName} `}
        name=""
        id=""
        defaultChecked={state}
      />
    </div>
  );
};
