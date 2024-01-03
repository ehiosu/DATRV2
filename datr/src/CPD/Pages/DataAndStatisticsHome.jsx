import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { CurrentDASDatat, terminals } from "../data/data";
import { StatCard } from "../Components/DashboardStats";
import {
  TerminalDataTable,
  generalTerminalData,
} from "../Components/DataTable";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router";

export const DataAndStatisticsHome = () => {
  const [filteredData, setFilteredData] = useState(generalTerminalData);
    const nav=useNavigate()
  const handleFilter = (value) => {
    if (!value) {
      setFilteredData(generalTerminalData);
    } else {
      setFilteredData((state) =>
        state.filter((datum) =>
          datum.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };
  const navto=(to)=>{
    nav(`/DAS/${to}/Dashboard`)
  }
  return (
    <section className="w-full max-h-screen p-2">
      <SearchPage heading={"Data and Statistics Department"}>
        <p className="font-semibold text-[1.3rem]">All Terminals</p>
        <div className="w-72 p-2 relative  outline-none">
          <input
            type="text"
            name=""
            className="w-full rounded-xl border-2 border-gray-400  outline-none focus:outline-none focus-within:outline-none "
            onChange={(e) => handleFilter(e.target.value)}
            placeholder="Search..."
            id=""
          />

          <AiOutlineSearch className="absolute top-1/2 -translate-y-1/2 right-4" />
        </div>
        <div className="w-[60%] mx-auto max-h-[60vh]">
          <TerminalDataTable data={filteredData} navTo={navto} />
        </div>
      </SearchPage>
    </section>
  );
};
