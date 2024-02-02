import React from "react";
import { BreadCrumb } from "./CPOView";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaArrowRight } from "react-icons/fa";
import {
  pauseSlaEntries,
  slaEntry,
  startSlaEntries,
  stopEntries,
} from "../data/data.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
const TSBreadCrum: React.FC<{
  last: string;
  previous: string;
  current: string;
}> = BreadCrumb;
export const NewSla: React.FC = () => {
  return (
    <div className="w-full">
      <TSBreadCrum
        last={"Configuration"}
        previous={"SLAs"}
        current={"New SLA"}
      />
      <div className="flex flex-col gap-2 my-4">
        <Label htmlFor="Name">Sla Name</Label>
        <Input className="w-56 border-neutral-200 border-2 outline-none dark:border-neutral-200 dark:bg-white bg-white text-neutral-500 h-8 px-3" />
      </div>
      <p className="my-4 text-[0.725rem] font-semibold">
        Time will be measured between Start and Stop conditions below.
      </p>

      <div className="flex flex-wrap gap-4">
        <SingleSlaWrapper
          data={startSlaEntries}
          name="Start"
          subtext="Begin counting time when"
          first={true}
        />
        <SingleSlaWrapper
          data={pauseSlaEntries}
          first={false}
          name="Pause"
          subtext="Time is not counted during"
        />
        <SingleSlaWrapper
          data={stopEntries}
          first={false}
          name="Stop"
          subtext="Finish counting time when"
        />
      </div>
      <p className="text-[0.9275rem] font-semibold mt-2">Goals</p>
      <p className="text-[0.7275rem] text-neutral-500 my-1">
        Issues will be checked against this list,top to bottom and assigned a
        time target.
      </p>
      <DataEntries />
      <div className="flex flex-wrap gap-2  mt-[1rem] ">
        <button className="md:w-48 w-full  h-9 rounded-md bg-darkBlue text-white hover:font-semibold hover:scale-105 transition-all hover:bg-purple-400 hover:shadow-md flex-grow-1 md:flex-grow-0">
          Save
        </button>
        <button className="md:w-48 flex-grow  rounded-md h-9 border-2 border-darkBlue bg-white hover:bg-lightPink hover:border-lightPink hover:text-white hover:scale-105 transition-all md:flex-grow-0">
          Cancel
        </button>
      </div>
    </div>
  );
};

const EntryComponent = ({ title, state }: slaEntry) => {
  return (
    <div className="flex items-center gap-2 my-2 group">
      <p className="text-[0.7275rem] text-neutral-500 peer peer-aria-checked:text-blue-400 peer-checked:text-blue-400 group-checked:text-blue-400">
        {title}
      </p>
      <Checkbox
        className="ml-auto border-2 ring-[1px] dark:checked:text-blue-500 dark:aria-checked:text-blue-500  ring-neutral-200 checked:ring-0 aria-checked:ring-0 peer"
        defaultChecked={state}
      />
    </div>
  );
};

const SingleSlaWrapper = ({
  first = true,
  data,
  name,
  subtext,
}: {
  first: boolean;
  data: slaEntry[];
  name: string;
  subtext: string;
}) => {
  return (
    <div className="flex items-start gap-2 md:mx-0 mx-auto">
      {!first && <FaArrowRight className="grid place-items-center mt-4 " />}

      <div className="flex flex-col">
        <p className="text-[0.9275rem] font-semibold">{name}</p>
        <p className="text-[0.7275rem] text-neutral-500 my-1">{subtext}</p>
        <div className="w-60  max-h-80 bg-white rounded-md border-2 border-neutral-200 my-2 p-2">
          <Input
            placeholder="Search"
            className="dark:bg-white rounded-md border-neutral-200 dark:border-neutral-200 "
          />
          <div className="flex flex-col">
            {data.map((entry) => {
              return <EntryComponent {...entry} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const DataEntries = () => {
  return (
    <div className="flex  mt-2 flex-wrap lg:gap-4 gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[0.75rem] text-darkBlue font-semibold">
          Resolution Time
        </p>
        <Input
          className="w-48 h-9 border-2 md:flex-grow-0  border-neutral-200 bg-white outline-none ring-0 dark:ring-0 dark:bg-white px-2 text-[0.75rem]"
          placeholder="e.g 4h 30m"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[0.75rem] text-darkBlue font-semibold">
          Response Time
        </p>
        <Input
          className="w-48 h-9 border-2 border-neutral-200 bg-white outline-none ring-0 dark:ring-0 dark:bg-white px-2 text-[0.75rem]"
          placeholder="e.g 4h 30m"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[0.75rem] text-darkBlue font-semibold">Calendar</p>
        <Select>
          <SelectTrigger className="text-[0.75rem] text-neutral-600 border-2 border-neutral-200 bg-white w-48 h-9 rounded-md dark:bg-white focus:ring-0 dark:focus:ring-0 dark:focus-visible:ring-0 dark:focus-within:ring-0 dark:focus:outline-none dark:focus:ring-transparent dark:focus-visible:ring-transparent dark:focus-within:ring-transparent dark:focus:shadow-none dark:focus-within:shadow-none dark:focus-visible:shadow-none dark:focus-within:border-none dark:focus:border-none dark:focus-visible:border-none">
            <SelectValue placeholder="Default 24/7 calendar" />
            <SelectContent></SelectContent>
          </SelectTrigger>
        </Select>
      </div>
    </div>
  );
};
