import React from "react";
import { redirect, useParams } from "react-router";
import { SearchPage } from "../../Reusable/SearchPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Textarea } from "../../components/ui/textarea";
import { ArrowDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { DatePickerDemo } from "../../components/ui/Datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectLabel,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
} from "../../components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "../../components/ui/command";

import useWindowSize from "../Sidebar/Hooks/useWindowSize";
import { SignleMessage } from "../Components/SingleMessage";
import { TipTapEditor } from "../Components/TipTapEditor";

export const MessaggeComponent = () => {
  const { id } = useParams();

  if (!id) {
    return redirect("/Home");
  }
  return (
    <section className="w-full max-h-screen overflow-y-auto">
      <SearchPage isRedirect={true} heading={"Back"}>
        <div className="flex md:gap-0 gap-3 justify-between items-center flex-wrap flex-1 ">
          <div className="flex items-center gap-2 text-[0.8275rem]">
            <p className="font-semibold">High Priority</p>
            <p className="text-darkBlue font-semibold">Ticket ID: #234523129</p>
          </div>
          <div className="flex items-center gap-2">
            <span className=" h-8 grid place-items-center aspect-square rounded-full bg-darkBlue text-white">
              K
            </span>
            <p className="text-[0.8275rem] text-darkBlue font-semibold">
              Kunmi Samuel
            </p>
            <ActionsComponent />
          </div>
        </div>
        <div className="flex mt-3 ">
          <div className="flex-[2.2] border-r-2 border-t-2 p-2 h-[70vh] max-w-full relative">
            <div className=" border-neutral-200 flex flex-col px-5 py-2 gap-3  h-[45vh] overflow-y-auto relative">
              <SignleMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={`Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
              />
            </div>
            <TipTapEditor />
          </div>
          <div className="flex-[1] border-t-2 border-neutral-200 md:block hidden">
            <div className="ml-2 h-24 w-[80%] mt-2 border-2 border-neutral-200 rounded-lg bg-white text-center flex flex-col items-center justify-center">
              <p className="text-darkBlue text-[1.3rem] font-semibold">
                Time To Expiry:
              </p>
              <p className="text-blue-400 text-[1.3rem] font-semibold">
                3:20:23
              </p>
            </div>
          </div>
        </div>
      </SearchPage>
    </section>
  );
};

const AddNotePopover = () => {
  const { screenSize } = useWindowSize();
  return (
    <Popover>
      <PopoverTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2">
        Add Note
      </PopoverTrigger>
      <PopoverContent
        side={screenSize == "small" ? "top" : "left"}
        className="w-80 h-40"
      >
        <Textarea
          placeholder="Please Type here"
          className="focus:outline-none focus:ring-0 focus-visible:ring-0"
        />
        <Button variant={"outline"} className="w-full my-2">
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const AddReminderPopover = () => {
  const { screenSize } = useWindowSize();
  return (
    <Popover>
      <PopoverTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2">
        Add Reminder
      </PopoverTrigger>
      <PopoverContent
        side={screenSize == "small" ? "top" : "left"}
        className="w-80 "
      >
        <p className="my-2 text-[0.8275rem] font-semibold text-blue-400">
          Date
        </p>
        <DatePickerDemo className="w-full h-8" />
        <p className="my-2 text-[0.8275rem] font-semibold text-blue-400">
          Time
        </p>
        <input
          type="time"
          className="w-full focus-within:outline-none focus:outline-none focus:border-neutral-100 focus-within:border-neutral-100  rounded-md border-[2px] border-neutral-100"
        />
        <p className="my-2 text-[0.8275rem] font-semibold text-blue-400">
          Snooze
        </p>
        <Select defaultValue="0">
          <SelectTrigger className="focus:outline-none focus-within:outline-none focus:ring-0 focus-within:ring-0">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0 minutes</SelectItem>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="15">10 minutes</SelectItem>
            <SelectItem value="20">15 minutes</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={"outline"} className="w-full my-2">
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const AddWorkLogPopover = () => {
  const { screenSize } = useWindowSize();
  return (
    <Popover>
      <PopoverTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2">
        Add Work Log
      </PopoverTrigger>
      <PopoverContent
        side={screenSize == "small" ? "top" : "left"}
        className="w-80 h-40"
      >
        <Textarea
          placeholder="Please Type here"
          className="focus:outline-none focus:ring-0 focus-visible:ring-0"
        />
        <Button variant={"outline"} className="w-full my-2">
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const AddCommentDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2 focus:ring-0 focus:outline-none focus-within:ring-0 focus-within:outline-none">
        Add Comment
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="text-darkBlue font-semibold">
          Add Comment
        </AlertDialogHeader>
        <Textarea
          placeholder="Type here..."
          className="focus:outline-none focus:ring-0 focus-visible:ring-0"
        />
        <div className="flex items-center gap-4">
          <AlertDialogAction className="flex-1 bg-darkBlue">
            Submit
          </AlertDialogAction>
          <AlertDialogCancel className="flex-1 bg-lightPink hover:bg-lightPink hover:bg-blend-darken text-white hover:text-white">
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EscalatePopover = () => {
  const { screenSize } = useWindowSize();
  return (
    <Popover>
      <PopoverTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2">
        Escalate Ticket
      </PopoverTrigger>
      <PopoverContent
        side={screenSize == "small" ? "top" : "left"}
        className="px-2 py-1 w-[20rem]"
      >
        <p className="text-xl text-blue-400">Escalate Ticket</p>
        <p className="text-[0.8275rem] text-darkBlue my-2">Escalate Issue To</p>
        <Command>
          <CommandInput
            className="border-none ring-0 focus:border-none focus:ring-0 h-8 text-[0.8275rem] text-neutral-700"
            placeholder="Search for Agent"
          ></CommandInput>
          <CommandEmpty>Agent doesn't exist</CommandEmpty>
          <CommandGroup></CommandGroup>
        </Command>
        <p className="text-[0.8275rem] text-darkBlue my-2">
          Reason For Escalation
        </p>
        <Select>
          <SelectTrigger className="w-full my-2 ring-0 focus:ring-0 ">
            <SelectValue placeholder="Reason for escalation..." />{" "}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">Issue Out of Control</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={"outline"} className="w-full my-2">
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const ActionsComponent = () => {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center gap-2 text-[0.8275rem] w-40 bg-neutral-200 h-8">
        Needs action <ArrowDown className="w-4 aspect-square" />
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-44">
        <AddNotePopover />
        <AddReminderPopover />
        <AddWorkLogPopover />
        <AddCommentDialog />
        <EscalatePopover />
      </PopoverContent>
    </Popover>
  );
};
