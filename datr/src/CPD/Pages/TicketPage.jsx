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
import { SignleTicketMessage } from "../Components/SingleMessage";
import { TipTapEditor } from "../Components/TipTapEditor";

export const TicketPage = () => {
  const { id } = useParams();
  if (!id) return redirect("/CPD/Dashboard");
  const btnStyles = {
    Pending: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
    Unresolved: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
    Resolved: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
    Open: "bg-[#FF585821] border-2 border-[#FF5858]",
    Escalated: "bg-[#D016DD21] border-2 border-[#D116DD]",
    Unassigned: "",
  };

  return (
    <section className="w-full max-h-screen overflow-y-auto">
      <SearchPage isRedirect={true} heading={"Back"}>
        <div className="flex md:gap-0 gap-3 justify-between items-center flex-wrap flex-1 ">
          <div className="flex flex-col">
            <div className="flex  gap-2 items-center ">
              <p className="text-[1.4rem] font-semibold text-darkBlue">
                Missing Baggage
              </p>
              <span
                className={`block w-max px-3 text-[0.7275rem] rounded-md ${btnStyles.Pending}`}
              >
                Pending
              </span>
            </div>
            <div className="flex items-center gap-2 text-[0.8275rem]">
              <p className="font-semibold">High Priority</p>
              <p className="text-darkBlue font-semibold">Ticket ID: {id}</p>
            </div>
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
          <div className="flex-[2.5] border-r-2 border-t-2 p-2 h-[70vh] max-w-full relative">
            <div className=" border-neutral-200 flex flex-col px-5 py-2 gap-3  h-[45vh] overflow-y-auto relative">
              <SignleTicketMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
                complaintDetails={{
                  requestType: "Missing Items",
                  complainantName: "Balogun Sadiq",
                  complainantEmail: "bsadiq@gmail.com",
                  complainantPhone: "08123456789",
                  location: "Lagos",
                  zone: "Zone",
                  rating: 3,
                  attachments: [],
                }}
              />
              <SignleTicketMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleTicketMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleTicketMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleTicketMessage
                name={"DG"}
                username={"DG Office"}
                priority={"High Priority"}
                date={"10 oct,2023"}
                message={
                  "Hi Support, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              />
              <SignleTicketMessage
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
          <LeftPanel />
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
      <PopoverTrigger className="flex items-center justify-center gap-2 text-[0.8275rem] w-40 bg-neutral-200 h-8 rounded-md">
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
import { FiMessageCircle } from "react-icons/fi";
const ExtraActions = () => {
  return (
    <div className="w-full flex flex-col mt-2 px-2 gap-2">
      <Button className="w-full h-12 focus:text-blue-400 dark:bg-white bg-white flex items-center justify-start gap-2 ">
        <FiMessageCircle />
        Conversations
      </Button>
      <DetailsSubAction />
      <HistorySubAction />
    </div>
  );
};

const LeftPanel = () => {
  return (
    <div className="flex-[1] border-t-2 border-neutral-200">
      <div className="ml-2 h-24 w-[80%] mt-2 border-2 border-neutral-200 rounded-lg bg-white text-center flex flex-col items-center justify-center">
        <p className="text-darkBlue text-[1.3rem] font-semibold">
          Time To Expiry:
        </p>
        <p className="text-blue-400 text-[1.3rem] font-semibold">3:20:23</p>
      </div>
      <ExtraActions />
    </div>
  );
};
import { CgDetailsMore } from "react-icons/cg";
import { MdHistory } from "react-icons/md";
const DetailsSubAction = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="w-full h-12 focus:text-blue-400 focus-within:text-blue-400 dark:bg-white bg-white flex items-center justify-start gap-2">
          <CgDetailsMore />
          Details
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" className="w-[35vw] h-[60vh] px-4">
        <p className="text-[1.3rem] font-semibold ">Details</p>
        <div className=" w-full grid grid-cols-3 grid-rows-4 gap-y-3 h-[90%]">
          {Object.keys(detailsData).map((key, index) => {
            return <DetailCellManager cellKey={key} value={detailsData[key]} />;
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DetailCellManager = ({ cellKey, value }) => {
  const { id } = useParams();
  if (cellKey === "ticketID")
    return (
      <div className="col-span-1  flex flex-col  items-center   justify-center">
        <p className="text-[0.75rem] text-neutral-700 font-semibold">{id}</p>
        <p className="text-[0.6275rem] text-neutral-500 ">{cellKey}</p>
      </div>
    );
  if (cellKey !== "status")
    return (
      <div className="col-span-1  flex flex-col  items-center  justify-center">
        <p className="text-[0.75rem] text-neutral-700 font-semibold">{value}</p>
        <p className="text-[0.6275rem] text-neutral-500 ">
          {cellKey.replace("_", " ")}
        </p>
      </div>
    );

  return (
    <div className="col-span-1 flex flex-col justify-center items-center ">
      <Select defaultValue="unresolved">
        <SelectTrigger>
          <SelectValue placeholder="Select A Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="unresolved">Unresolved</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-[0.6275rem] text-neutral-400"></p>
    </div>
  );
};

const detailsData = {
  ticketID: "#01091291201201",
  status: "Unresolved",
  life_Cycle: "24 Hours",
  Consumer_Protection_Officer: "Bambi Stevens",
  Tasks: "0",
  Reminders: " ",
  Approval_Status: "Not Approved",
  Attachments: "0",
  Responded_Date: "Oct 14, 2020.12:49pm",
  Due_By: "Oct 15, 2020. 15:00pm",
  Working_Timer: "4:39:66",
  Assigner: "Clement Adigun",
};

const HistorySubAction = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="w-full h-12 focus:text-blue-400 focus-within:text-blue-400 dark:bg-white bg-white flex items-center justify-start gap-2">
          <MdHistory />
          History
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" className="w-[35vw] h-[60vh] px-4">
        <p className="text-[1.3rem] font-semibold ">History</p>
        <div className="flex items-center gap-3">
          <p className="text-[0.675rem] text-neutral-400 font-semibold ">
            Filter By
          </p>
          <Select>
            <SelectTrigger className="w-60 h-8 py-0 focus:ring-transparent text-[0.6275rem]">
              <SelectValue placeholder="Select A Value" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};
