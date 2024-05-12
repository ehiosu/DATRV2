import React, { createContext, useContext, useState } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Outlet, useNavigate, useParams } from "react-router";
import { create } from "zustand";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useQuery } from "@tanstack/react-query";

const AirlineContext = createContext({
  isOpen: false,
  setOpen: () => {},
  toggle: () => {},
});

export const useAirlineContext = () => useContext(AirlineContext);
export const DASLayout = () => {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen((state) => !state);
  return (
    <AirlineContext.Provider value={{ isOpen, setOpen, toggle }}>
      <main className="flex w-full bg-my-gray max-w-screen-2xl">
        <Sidebar />
        <AirlineBrowseDialog />

        <div className="lg:w-[75%] w-full mx-auto  overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </AirlineContext.Provider>
  );
};

const AirlineBrowseDialog = () => {
  const { isOpen, setOpen } = useContext(AirlineContext);
  const { axios } = useAxiosClient();
  const { Location } = useParams();
  const nav = useNavigate();
  const navToAirlineReports = (airline) => {
    nav(`/DAS/${Location}/Report/${airline.replace(" ", "_")}`);
    setOpen(false);
  };
  const GetAirlinesQuery = useQuery({
    queryKey: ["airlines", "all"],
    queryFn: () =>
      axios("airlines/active", {
        method: "GET",
      }).then((resp) => resp.data),
  });
  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput className="my-2" placeholder="Search for an Airline..." />
      {GetAirlinesQuery.isSuccess && (
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Airlines">
            {GetAirlinesQuery.data.map((airline) => (
              <CommandItem onSelect={navToAirlineReports} key={airline.id}>
                <span>{airline.airlineName}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </CommandDialog>
  );
};
