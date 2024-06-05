import React, { useEffect, useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { AiOutlineArrowDown, AiOutlineClose } from "react-icons/ai";
import { GeneralTicketsTable } from "../Components/DataTable";
import { useQuery as useLocalQuery } from "../Sidebar/Hooks/useQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../api/useAuth";
import { NewTicketBtn } from "../../components/NewTicketBtn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
export const AllTickets = () => {
  const cpo = useLocalQuery().get("cpo");
  const from = useLocalQuery().get("from");
  const to = useLocalQuery().get("to");
  const status = useLocalQuery().get("status");
  const assignee = useLocalQuery().get("assignee");
  const { axios } = useAxiosClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [itemCount, setItemCount] = useState(10);
  const nav = useNavigate();
  const { user } = useAuth();
  const isAirline = user.roles.includes("AIRLINE");
  const ticketsQuery = useQuery({
    queryKey: ["tickets", "all", `${currentPage}`, `${itemCount}`],
    retry: false,
    staleTime: Infinity,
    queryFn: () => {
      if (to && from) {
        return axios(
          `tickets/date-range?start=${from}&end=${to}&page=${currentPage}&size=${itemCount}`
        ).then((resp) => {
          setMaxPages(() => resp.data.totalPages);
          return resp.data;
        });
      }
      if (!cpo && !status && !assignee) {
        return axios(
          isAirline
            ? "tickets/airline?page=0&size=10"
            : `tickets/all?page=${currentPage}&size=${itemCount}`,
          {
            method: "GET",
          }
        ).then((resp) => {
          setMaxPages(() => resp.data.totalPages);
          return resp.data;
        });
      }
      if (cpo && !status && !assignee) {
        return axios(
          `/tickets/cpo?email=${cpo}&page=${currentPage}&size=${itemCount}`
        ).then((resp) => {
          setMaxPages(() => resp.data.totalPages);
          return resp.data;
        });
      }
      if (!cpo && status && !assignee) {
        return axios(
          `/tickets/status?value=${status}&page=${currentPage}&size=10`
        ).then((resp) => {
          setMaxPages(() => resp.data.totalPages);
          return resp.data;
        });
      }
      if (!cpo && !status && assignee) {
        return axios(
          `/tickets/assignee?email=${assignee}&page=${currentPage}&size=10`
        ).then((resp) => {
          setMaxPages(() => resp.data.totalPages);
          return resp.data;
        });
      }
      if (cpo && status && !assignee) {
        return axios(
          `/tickets/cpo-status?email=${cpo}&status=${status}&page=${
            currentPage - 1
          }&size=10`
        ).then((resp) => {
          setMaxPages(() => resp.data.totalPages);
          return resp.data;
        });
      }
      if (!cpo && assignee && status) {
        return axios(
          `/tickets/assignee?email=${assignee}&status=${status}&page=${
            currentPage - 1
          }&size=10`
        ).then((resp) => {
          setMaxPages(() => resp.data.totalPages);
          return resp.data;
        });
      } else {
        return axios("tickets/all?page=0&size=10", {
          method: "GET",
        }).then((resp) => {
          setMaxPages(() => resp.data.totalPages);
          return resp.data;
        });
      }
    },
  });

  useEffect(() => {
    ticketsQuery.refetch();
  }, [cpo, assignee, status, from, to]);
  return (
    <section className="w-full">
      <SearchPage heading={"All Tickets"}>
        <div className="w-full  flex-wrap   flex justify-between md:gap-0 ">
          <div className="flex    gap-4   items-center">
            <NewTicketBtn />
          </div>
          <div className="md:ml-auto flex    gap-3  flex-wrap md:my-0 my-2">
            <FilterButton assignee={assignee} cpo={cpo} status={status} />
            <RangeSelectButton setCurrentPage={setCurrentPage} />
          </div>
        </div>
        <div className="flex items-center md:justify-end flex-wrap md:space-x-4">
          {cpo && (
            <div className="flex flex-col  bg-white rounded-md py-1 px-3 space-y-0 ">
              <div className="flex justify-between items-center text-[0.8rem] my-0  space-x-2">
                <p className="font-semibold"> {cpo}</p>
                <Button
                  className="p-1 w-4 h-4"
                  onClick={() => {
                    nav(
                      `/CPD/Tickets/All?cpo=${""}&status=${status}&assignee=${assignee}`
                    );
                  }}
                  variant={"ghost"}
                >
                  <AiOutlineClose />
                </Button>
              </div>
              <span className="font-semibold text-xs text-neutral-400">
                Active CPO:
              </span>
            </div>
          )}
          {from && to && (
            <div className="flex flex-col  bg-white rounded-md py-1 px-3 space-y-0 ">
              <div className="flex justify-between items-center text-[0.8rem] my-0  space-x-2">
                <p className="font-semibold">
                  {" "}
                  {from} - {to}
                </p>
                <Button
                  className="p-1 w-4 h-4"
                  onClick={() => {
                    nav(`/CPD/Tickets/All`);
                  }}
                  variant={"ghost"}
                >
                  <AiOutlineClose />
                </Button>
              </div>
              <span className="font-semibold text-xs text-neutral-400">
                Range:
              </span>
            </div>
          )}
          {status && (
            <div className="flex flex-col  bg-white rounded-md py-1 px-3 space-y-0 ">
              <div className="flex justify-between items-center text-[0.8rem] my-0  space-x-2">
                <p className="font-semibold"> {status}</p>
                <Button
                  className="p-1 w-4 h-4"
                  onClick={() => {
                    nav(
                      `/CPD/Tickets/All?cpo=${cpo}&status=${""}&assignee=${assignee}`
                    );
                  }}
                  variant={"ghost"}
                >
                  <AiOutlineClose />
                </Button>
              </div>
              <span className="font-semibold text-xs text-neutral-400">
                Active Status:
              </span>
            </div>
          )}

          {assignee && (
            <div className="flex flex-col  bg-white rounded-md py-1 px-3 space-y-0 ">
              <div className="flex justify-between items-center text-[0.8rem] my-0  space-x-2">
                <p className="font-semibold"> {assignee}</p>
                <Button
                  className="p-1 w-4 h-4"
                  onClick={() => {
                    nav(
                      `/CPD/Tickets/All?cpo=${cpo}&status=${status}&assignee=${""}`
                    );
                  }}
                  variant={"ghost"}
                >
                  <AiOutlineClose />
                </Button>
              </div>
              <span className="font-semibold text-xs text-neutral-400">
                Active Assignee:
              </span>
            </div>
          )}
        </div>
        <div className="w-full  flex-1 ">
          {ticketsQuery.data && (
            <div className="flex justify-end my-2">
              <div className="flex items-center space-x-2 mx-2">
                <Button
                  disabled={currentPage === 0}
                  className="hover:bg-slate-100 h-8 px-2 dark:hover:bg-slate-200"
                  onClick={() => {
                    setCurrentPage((state) => state - 1);
                  }}
                >
                  Previous
                </Button>
                {currentPage === 0 ? (
                  <PaginationEllipsis className="mt-1" />
                ) : (
                  <>
                    <Button
                      className="hover:bg-slate-200 h-8 px-2 dark:hover:bg-slate-200"
                      onClick={() => {
                        setCurrentPage(0);
                      }}
                    >
                      1
                    </Button>
                    {currentPage + 1 < maxPages && currentPage !== 0 && (
                      <PaginationEllipsis className="mt-1" />
                    )}
                    <Button
                      className={`${
                        currentPage + 1 === maxPages
                          ? "bg-slate-200 dark:bg-slate-300 h-8 px-2"
                          : "hover:bg-slate-200 h-8 px-2 dark:hover:bg-slate-200"
                      }  cursor-default`}
                    >
                      {currentPage + 1}
                    </Button>
                    {/* {currentPage + 1 !== maxPages && (
                      <PaginationEllipsis className="mt-1" />
                    )} */}
                  </>
                )}
                <Button
                  onClick={() => {
                    setCurrentPage((state) => state + 1);
                  }}
                  className="hover:bg-slate-200 h-8 px-2 dark:hover:bg-slate-200"
                  disabled={currentPage + 1 === maxPages}
                >
                  Next
                </Button>
              </div>
              <Select value={itemCount.toString()} onValueChange={setItemCount}>
                <SelectTrigger className="dark:bg-slate-50 bg-slate-50 hover:bg-neutral-200 transition-all w-32 text-black">
                  <SelectValue className=" text-black" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {ticketsQuery.isSuccess && (
            <>
              <GeneralTicketsTable
                currentPage={currentPage}
                generalTicketData={ticketsQuery.data.tickets}
              />
            </>
          )}
          {ticketsQuery.isLoading && (
            <Skeleton className="w-full h-[60vh] mt-8"></Skeleton>
          )}
          {ticketsQuery.isError && (
            <div className="w-full h-full grid place-items-center  min-h-[60vh]">
              <p className="Font-semibold text-[2rem] text-neutral-500">
                {ticketsQuery.error.message ===
                "Request failed with status code 401"
                  ? "You don't have access to this resource!"
                  : " "}
              </p>
            </div>
          )}
        </div>
      </SearchPage>
    </section>
  );
};

const ViewChangeBtn = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-[#EEEEEE] flex justify-center items-center  w-24 outline-none h-10    rounded-md  shadow-md  gap-3   font-semibold   text-[0.8275rem]">
        Views <AiOutlineArrowDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-white w-28   rounded-md     z-50 my-2">
        <DropdownMenuItem className="h-6">
          <p className="text-[0.8275rem] text-neutral-400    text-center">
            List
          </p>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-500" />
        <DropdownMenuItem className="h-6">
          <p className="text-[0.8275rem] text-neutral-400    text-center">
            Grid
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterButton = ({
  assignee,
  status,
  cpo,
  options = { status: false, cpo: false, assignee: false },
}) => {
  const { axios } = useAxiosClient();
  const [searchedName, setSearchedName] = useState("");
  const { user } = useAuth();
  const statusQuery = useQuery({
    queryKey: ["Tickets", "statuses"],
    queryFn: () =>
      axios("tickets/statuses", {
        method: "GET",
      })
        .then((resp) => {
          console.log(resp.data);
          return resp.data;
        })
        .catch((err) => {
          console.log(err);
        }),
    staleTime: Infinity,
  });
  if (user.roles.includes("AIRLINE")) return <></>;
  const cposQuery = useQuery({
    queryKey: ["cpos"],
    retry: false,
    queryFn: () =>
      axios("cpo/all", {
        method: "GET",
      }).then((resp) => resp.data),
    staleTime: Infinity,
  });
  const nav = useNavigate();
  const navTo = (_email = cpo, _assignee = assignee, _status = status) => {
    nav(
      `/CPD/Tickets/All?cpo=${_email || ""}&assignee=${
        _assignee || ""
      }&status=${_status || ""}`,
      {
        replace: true,
      }
    );
  };

  return (
    <Popover>
      <PopoverTrigger
        className="w-max px-4 flex flex-row gap-2 items-center bg-white rounded-lg border-2 border-neutral-100 shadow-sm text-[0.8275rem]"
        disabled={!user.roles.includes("CPO") && !user.roles.includes("ADMIN")}
      >
        Filter <AiOutlineArrowDown />
      </PopoverTrigger>
      <PopoverContent
        className="w-40 flexflex-col items-center dark:w-40 px-2 h-max dark:h-max py-2"
        side="bottom"
      >
        <Popover>
          <PopoverTrigger className="text-[0.85rem] w-full hover:bg-blue-100 p-1 grid  place-items-center cursor-pointer hover:border-b-2  hover:font-semibold hover:text-neutral-600 hover:border-b-purple-300 rounded-md">
            Filter by Creator
          </PopoverTrigger>
          {true && (
            <PopoverContent className="px-2 py-2 pb-6" side="left">
              {/* {cpo && (
                <div className="flex items-center">
                  <p className="text-[0.8275rem] flex flex-col whitespace-nowrap ">
                    Active CPO: <span className="font-semibold">{cpo}</span>
                  </p>
                  <Button
                    onClick={() => {
                      navTo("", assignee, status);
                    }}
                    className="w-4 grid place-items-center aspect-square ml-auto"
                    variant={"ghost"}
                  >
                    <AiOutlineClose />
                  </Button>
                </div>
              )} */}
              <Input
                placeholder="Search CPO email"
                className="text-[0.8275rem]  dark:bg-white dark:focus:bg-neutral-200 dark:border-2 dark:border-neutral-500 transition-colors my-5 h-8 text-neutral-400 placeholder:text-neutral-600"
                onChange={(e) => {
                  setSearchedName(e.target.value);
                }}
              />
              <ul>
                {cposQuery.data
                  ?.filter((_cpo) =>
                    _cpo.ncaaUserEmail.startsWith(searchedName)
                  )
                  .map((_cpo, index) => (
                    <li
                      onClick={() => {
                        if (_cpo === cpo) return;
                        navTo(_cpo.ncaaUserEmail);
                      }}
                      aria-disabled={cpo === _cpo.ncaaUserEmail}
                      className="text-[0.8275rem] my-2 h-8 grid place-items-center rounded-md  aria-disabled:bg-neutral-400 aria-disabled:hover:cursor-not-allowed text-center hover:cursor-pointer hover:border-b-2 hover:border-b-blue-400 hover:py-1 transition-all font-semibold text-neutral-500"
                      key={_cpo.id}
                    >
                      {_cpo.ncaaUserEmail}
                    </li>
                  ))}
              </ul>
            </PopoverContent>
          )}
        </Popover>
        <Popover>
          <PopoverTrigger className="text-[0.85rem] w-full hover:bg-blue-100 p-1 grid  place-items-center cursor-pointer hover:border-b-2  hover:font-semibold hover:text-neutral-600 hover:border-b-purple-300 rounded-md">
            Filter by Status
          </PopoverTrigger>
          {cposQuery.isSuccess && (
            <PopoverContent className="px-2 " side="left">
              {/* {status && (
                <div className="flex items-center">
                  <p className="text-[0.8275rem] flex flex-col whitespace-nowrap ">
                    Active Status:{" "}
                    <span className="font-semibold">{status}</span>
                  </p>
                  <Button
                    onClick={() => {
                      navTo(cpo, assignee, "");
                    }}
                    className="w-4 grid place-items-center aspect-square ml-auto"
                    variant={"ghost"}
                  >
                    <AiOutlineClose />
                  </Button>
                </div>
              )} */}
              <Input
                placeholder="Search for a status"
                className="text-[0.8275rem]  dark:bg-white dark:focus:bg-neutral-200 dark:border-2 dark:border-neutral-500 transition-colors my-5 h-8 text-neutral-400 placeholder:text-neutral-600"
                onChange={(e) => {
                  setSearchedName(e.target.value);
                }}
              />
              <ul>
                {statusQuery.isSuccess &&
                  statusQuery.data
                    ?.filter((_status) =>
                      _status
                        .toLowerCase()
                        .startsWith(searchedName.toLowerCase())
                    )
                    .map((_status, index) => (
                      <li
                        onClick={() => {
                          if (_status === status) return;
                          navTo(cpo, assignee, _status);
                        }}
                        aria-disabled={_status === status}
                        className="text-[0.8275rem] h-8 grid place-items-center my-2 aria-disabled:text-white aria-disabled:font-semibold  aria-disabled:bg-neutral-400 aria-disabled:hover:cursor-not-allowed text-center hover:cursor-pointer hover:border-b-2 hover:border-b-blue-400 hover:py-1 transition-all font-semibold text-neutral-500"
                        key={_status}
                      >
                        {_status}
                      </li>
                    ))}
              </ul>
            </PopoverContent>
          )}
        </Popover>

        <Popover>
          <PopoverTrigger className="text-[0.85rem] w-full hover:bg-blue-100 p-1 grid  place-items-center cursor-pointer hover:border-b-2  hover:font-semibold hover:text-neutral-600 hover:border-b-purple-300 rounded-md">
            Filter by Assignee
          </PopoverTrigger>
          {cposQuery.isSuccess && (
            <PopoverContent className="px-2 py-2 pb-6" side="left">
              {/* {assignee && (
                <div className="flex items-center">
                  <p className="text-[0.8275rem] flex flex-col whitespace-nowrap ">
                    Active Assignee:{" "}
                    <span className="font-semibold">{assignee}</span>
                  </p>
                  <Button
                    onClick={() => {
                      navTo(cpo, "", status);
                    }}
                    className="w-4 grid place-items-center aspect-square ml-auto"
                    variant={"ghost"}
                  >
                    <AiOutlineClose />
                  </Button>
                </div>
              )} */}
              <Input
                placeholder="Search for a status"
                className="text-[0.8275rem]  dark:bg-white dark:focus:bg-neutral-200 dark:border-2 dark:border-neutral-500 transition-colors my-5 h-8 text-neutral-400 placeholder:text-neutral-600"
                onChange={(e) => {
                  setSearchedName(e.target.value);
                }}
              />
              <ul>
                {cposQuery.data
                  ?.filter((_cpo) =>
                    _cpo.ncaaUserEmail
                      .toLowerCase()
                      .startsWith(searchedName.toLowerCase())
                  )
                  .map((_cpo, index) => (
                    <li
                      onClick={() => {
                        if (_cpo === assignee) return;
                        navTo(cpo, _cpo.ncaaUserEmail, status);
                      }}
                      aria-disabled={_cpo === assignee}
                      className="text-[0.8275rem] my-2 aria-disabled:text-white aria-disabled:font-semibold  aria-disabled:bg-neutral-400 aria-disabled:hover:cursor-not-allowed text-center hover:cursor-pointer hover:border-b-2 hover:border-b-blue-400 hover:py-1 transition-all font-semibold text-neutral-500"
                      key={_cpo.ncaaUserEmail}
                    >
                      {_cpo.ncaaUserEmail}
                    </li>
                  ))}
              </ul>
            </PopoverContent>
          )}
        </Popover>
        <Button
          className="w-full dark:py-1 py-1 h-8 my-1"
          onClick={() => {
            nav("/CPD/Tickets/All");
          }}
          variant={"ghost"}
        >
          Clear filters
        </Button>
      </PopoverContent>
    </Popover>
  );
};
import { DateRangePicker } from "../../components/ui/Datepicker";
import { differenceInDays, parse } from "date-fns";
import { Skeleton } from "../../components/ui/skeleton";
const RangeSelectButton = ({ setCurrentPage }) => {
  const from = useLocalQuery().get("from");
  const to = useLocalQuery().get("to");
  const [date, setDate] = useState({
    from: from ? parse(from, "dd-MM-yyyy", new Date()) : new Date(), // Parse the 'from' query parameter
    to: to ? parse(to, "dd-MM-yyyy", new Date()) : null,
  });
  useEffect(() => {
    setDate({
      from: from ? parse(from, "dd-MM-yyyy", new Date()) : new Date(), // Parse the 'from' query parameter
      to: to ? parse(to, "dd-MM-yyyy", new Date()) : null,
    });
  }, [from, to]);
  return (
    <DateRangePicker
      className="bg-white dark:bg-white hover:bg-slate-200 dark:hover:bg-slate-200 hover:text-black dark:hover:text-black outline-none "
      date={date}
      setDate={setDate}
      mode={"range"}
      setCurrentPage={setCurrentPage}
      displayDate={(value) => {
        return value
          ? `showing data from ${differenceInDays(value.from, value.to)}`
          : "Select a Date Range";
      }}
    />
  );
};
