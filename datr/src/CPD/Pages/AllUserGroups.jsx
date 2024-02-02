import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { GeneralGroupTable } from "../Components/DataTable";

export const AllUserGroups = () => {
  return (
    <section className="w-full">
      <SearchPage heading={"User Groups"}>
        <div className="w-full my-5 shadow-md md:max-h-[30vh] max-h-[40vh] overflow-y-auto">
          <GeneralGroupTable />
        </div>

        <div className="w-full h-8 my-3 grid place-items-center relative">
          <span className="block bg-neutral-400 h-[1px] w-full"></span>
          <p className="absolute w-40 h-8 border-2 border-neutral-200 flex items-center justify-center text-[0.7275rem] text-neutral-600 bg-white px-3 py-2 rounded-full left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2">
            Unassigned Members
          </p>
        </div>
        <Timer />
        <div className="w-full my-5 shadow-md md:max-h-[50vh] max-h-[40vh] overflow-y-auto"></div>
      </SearchPage>
    </section>
  );
};

const Timer = () => {
  const [time, setTime] = useState("");
  const deadline = new Date();
  deadline.setHours(21, 0, 0, 0);
  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    return {
      total,
      hours,
      minutes,
      seconds,
    };
  }
  setInterval(() => {
    const { hours, minutes, seconds } = getTimeRemaining(deadline);
    setTime(`${hours}H - ${minutes}M - ${seconds}S`);
  }, 1000);
  return (
    <div>
      <p className="text-darkBlue font-semibold ">
        Time to synchronization: {time}
      </p>
    </div>
  );
};
