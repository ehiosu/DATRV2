import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useTerminalStore } from "../../store/terminalstore";
export const TerminalSelector = ({}) => {
  const { axios } = useAxiosClient();
  const { terminal, setTerminal } = useTerminalStore();
  const getTerminalsQuery = useQuery({
    queryKey: ["terminals", "all"],
    queryFn: () =>
      axios("terminals/active", {
        method: "GET",
      }).then((resp) => resp.data),
  });
  return (
    <Select value={terminal} onValueChange={setTerminal}>
      <SelectTrigger
        className="w-48 h-7  mt-2 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
        disabled={!getTerminalsQuery.isSuccess}
      >
        <SelectValue placeholder="Select A terminal" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {getTerminalsQuery.isSuccess &&
          getTerminalsQuery.data.map((terminal) => (
            <SelectItem value={terminal.name}>{terminal.name}</SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
