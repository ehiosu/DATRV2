import {
  GenericDataTable,
  ResolvedTicketColumnDefinition,
  UnresolvedTicketsColumnDefinition,
  generalTicketColumnDefiniton,
  openTicketColumnDefinition,
} from "@/CPD/Components/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTickets } from "@/v3/hooks/useTickets";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { AuthorizedComponent } from "../Components/AuthorizedComponent";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { NcPagination } from "@/components/ui/NcPagination";
import { useAuth } from "@/api/useAuth";
import { useTerminal } from "@/v3/hooks/useTerminal";
const statusColumnMap = {
  OPENED: openTicketColumnDefinition,
  ALL: generalTicketColumnDefiniton,
  RESOLVED: ResolvedTicketColumnDefinition,
  ESCALATED: UnresolvedTicketsColumnDefinition,
  NEW: generalTicketColumnDefiniton,
  AWAITING_ESCALATION_APPROVAL: generalTicketColumnDefiniton,
  AWAITING_APPROVAL: generalTicketColumnDefiniton,
};
export const Tickets = () => {
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [date, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [terminal, setTerminal] = useState("All");
  const { user } = useAuth();
  const query = useTickets(filter, date, currentPage, pageSize, setMaxPages);
  const terminalQuery = useTerminal();
  const nav = useNavigate();

  return (
    <section className="w-full px-6 py-2 ">
      <div className="flex items-center w-full justify-between md:flex-row flex-col">
        <p className="text-2xl font-semibold mb-2">Complaints</p>
        {user.roles[user.roles.length - 1] !== "CPO" && (
          <Select
            value={filter}
            onValueChange={(value: string) => {
              setCurrentPage(1);
              setFilter(value);
            }}
          >
            <SelectTrigger className="w-32 h-10 bg-ncBlue dark:bg-ncBlue text-white dark:text-white hover:bg-slate-500 focus:outline-none outline-none dark:focus:outline-none ring-0 focus:ring-0 dark:focus:ring-0 dark:hover:bg-slate-500 transition">
              <SelectValue placeholder="Filter By Status" />
            </SelectTrigger>
            <SelectContent className="bg-ncBlue dark:bg-ncBlue text-white">
              <SelectItem
                className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                value="ALL"
              >
                All
              </SelectItem>
              <SelectItem
                className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                value="OPENED"
              >
                Open
              </SelectItem>
              <SelectItem
                className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                value="RESOLVED"
              >
                Resolved
              </SelectItem>
              <SelectItem
                className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                value="ESCALATED"
              >
                Escalated
              </SelectItem>
              <SelectItem
                className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                value="NEW"
              >
                New
              </SelectItem>
              <AuthorizedComponent
                roles={["SHIFT_SUPERVISOR", "TERMINAL_SUPERVISOR", "ADMIN"]}
              >
                <SelectItem
                  className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                  value="AWAITING_ESCALATION_APPROVAL"
                >
                  Awaiting Escalation Approval
                </SelectItem>
              </AuthorizedComponent>
              <AuthorizedComponent
                roles={["SHIFT_SUPERVISOR", "TERMINAL_SUPERVISOR", "ADMIN"]}
              >
                <SelectItem
                  className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                  value="AWAITING_APPROVAL"
                >
                  Awaiting Approval
                </SelectItem>
              </AuthorizedComponent>
            </SelectContent>
          </Select>
        )}
      </div>
      <AuthorizedComponent
        roles={["ADMIN", "TERMINAL_HEAD", "SHIFT_HEAD", "CPO"]}
      >
        <div className="flex flex-col md:items-end md:justify-end justify-center items-center mt-2">
          <AuthorizedComponent roles={["ADMIN", "REGIONAL_HEAD"]}>
            <Select
              value={terminal}
              onValueChange={(value: string) => {
                setCurrentPage(0);
                setTerminal(value);
              }}
            >
              <SelectTrigger className="w-32 h-10 bg-ncBlue dark:bg-ncBlue text-white dark:text-white hover:bg-slate-500 focus:outline-none outline-none dark:focus:outline-none ring-0 focus:ring-0 dark:focus:ring-0 dark:hover:bg-slate-500 transition">
                <SelectValue placeholder="Filter By Terminal" />
              </SelectTrigger>
              <SelectContent className="bg-ncBlue dark:bg-ncBlue text-white">
                <SelectItem
                  className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                  value="ALL"
                >
                  All
                </SelectItem>
                {terminalQuery.isLoading ? (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                ) : terminalQuery.isError ? (
                  <SelectItem disabled value="error">
                    Error loading terminals
                  </SelectItem>
                ) : (
                  terminalQuery.data.map(
                    (terminal: { id: string; name: string }) => (
                      <SelectItem
                        key={terminal.id}
                        className="text-white hover:bg-slate-100/10 dark:hover:bg-slate-100/10 focus:bg-slate-100/10 dark:focus:bg-slate-100/10 dark:focus:text-white focus:text-white"
                        value={terminal.name}
                      >
                        {terminal.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </Select>
          </AuthorizedComponent>
          <button
            onClick={() => {
              nav("/CPD/New-Ticket");
            }}
            className="w-40 h-9 hover:bg-slate-400 transition-all rounded-md bg-ncBlue text-white flex items-center space-x-2 justify-center  my-2"
          >
            New Ticket <Plus className="w-4 h-4 ml-2 shrink" />
          </button>
        </div>
      </AuthorizedComponent>

      {query.isLoading ? (
        <Skeleton className="w-full h-[60vh]" />
      ) : (
        query.isSuccess && (
          <div className="max-h-[60vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full gap-y-4">
            {" "}
            <GenericDataTable
              tableClassname=""
              headerClassname="rounded-lg"
              filterHeader="Complainant Name"
              columns={
                statusColumnMap[filter as keyof typeof statusColumnMap] as any
              }
              data={query.data || []}
              filterColumn="complainantName"
              hasFilter
            />
          </div>
        )
      )}
      <NcPagination
        setPage={setCurrentPage}
        currentPage={currentPage}
        maxPage={maxPages}
        className="my-2 mx-auto w-full gap-x-3 justify-center mt-2"
      />
    </section>
  );
};
