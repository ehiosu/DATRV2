import React, { useEffect, useRef, useState } from "react";
import { CiClock1 } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { MdAssignmentInd } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { NavigateFunction, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import {
  Cell,
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DelayedFlight,
  GeneralGroup,
  GeneralTerminal,
  GeneralTicket,
  Message,
  ResolvedTicket,
  SlaGeneral,
  TicketDistribution,
  cancelledFlight,
  openTicket,
  recieptData,
  unassignedTicket,
} from "./Types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectArrow } from "@radix-ui/react-select";
import { format } from "date-fns";
import {useAxiosClient} from "../../api/useAxiosClient"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/api/useAuth";
import { toast } from "@/components/ui/use-toast";
type ExtendedColumnDef<TData extends unknown, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  accesorKey?: string; // Add your custom property
};

const columnDefinition: ExtendedColumnDef<recieptData>[] = [
  {
    accesorKey: "complainant",
    header: "Complainant",
  },
  {
    accesorKey: "complaint_type",
    header: "Complainant Type",
  },
  {
    accesorKey: "id",
    header: "ID",
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hasAssignment: boolean;
  isDraft: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border relative">
      <Table>
        <TableHeader className="  ">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id} className="text-center ">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(
                      cell.column.columnDef.accesorKey === "id"
                        ? row.original[
                            cell.column.columnDef.accesorKey
                          ].toString() // Convert ID to string
                        : cell.column.columnDef.accesorKey === "Assign"
                        ? cell.column.columnDef.cell({ row })
                        : row.original[cell.column.columnDef.accesorKey],
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const RecentTicketsTable = () => {
  const data: recieptData[] = [
    {
      complainant: "Chijioke Okonkwo",
      complaint_type: "Lost Luggage",
      id: "A1B2C3",
    },
    {
      complainant: "Ngozi Eze",
      complaint_type: "Delayed Flight",
      id: "D4E5F6",
    },
    {
      complainant: "Obi Okafor",
      complaint_type: "Poor Customer Service",
      id: "G7H8I9",
    },
    {
      complainant: "Amina Mohammed",
      complaint_type: "Security Concern",
      id: "J1K2L3",
    },
    {
      complainant: "Emeka Nwosu",
      complaint_type: "Facility Cleanliness",
      id: "M4N5O6",
    },
  ];

  return (
    <TicketsDataTable
      columns={columnDefinition}
      data={data}
      hasAssignment={true}
      isDraft={false}
      hasNav={false}
    />
  );
};

const generalTicketColumnDefiniton: ExtendedColumnDef<GeneralTicket>[] = [
  {
    accesorKey: "complainantName",
    header: "Complainant",
  },
  {
    accesorKey: "complainantType",
    header: "Complainant Type",
  },
  {
    accesorKey: "id",
    header: "ID",
  },
  {
    accesorKey: "group",
    header: "Group",
  },
  {
    accesorKey: "ticketStatus",
    header: "Status",
  },
  {
    accesorKey: "dateTimeCreated",
    header: "Date",
  },
];

const generalTicketData: GeneralTicket[] = [
  {
    id: "GT001",
    complaint_type: "Facility Issue",
    complainant: "Chijioke Okafor",
    cpo: "Jennifer Adekoya",
    group: "Customer Support",
    status: "Pending",
    date: "2023-11-15",
  },
  {
    id: "GT002",
    complaint_type: "Lost Luggage",
    complainant: "Ngozi Eze",
    cpo: "Emeka Okonkwo",
    group: "Customer Support",
    status: "Unresolved",
    date: "2023-11-16",
  },
  {
    id: "GT003",
    complaint_type: "Security Concern",
    complainant: "Abubakar Suleiman",
    cpo: "Blessing Afolayan",
    group: "Customer Support",
    status: "Resolved",
    date: "2023-11-17",
  },
  {
    id: "GT004",
    complaint_type: "Flight Delay",
    complainant: "Folake Adeyemi",
    cpo: "Daniel Obi",
    group: "Customer Support",
    status: "Pending",
    date: "2023-11-18",
  },
  {
    id: "GT005",
    complaint_type: "Quality of Service",
    complainant: "Yusuf Aliyu",
    cpo: "Chinwe Onyekachi",
    group: "Customer Support",
    status: "Unresolved",
    date: "2023-11-19",
  },
  {
    id: "GT006",
    complaint_type: "Baggage Handling",
    complainant: "Aisha Bello",
    cpo: "David Oluwaseun",
    group: "Customer Support",
    status: "Resolved",
    date: "2023-11-20",
  },
  {
    id: "GT007",
    complaint_type: "Cleanliness Concern",
    complainant: "Obinna Chukwu",
    cpo: "Mercy Eze",
    group: "Customer Support",
    status: "Pending",
    date: "2023-11-21",
  },
  // Add more data as needed
];

export const GeneralTicketsTable = ({generalTicketData}:{generalTicketData:GeneralTicket[]}) => {
  return (
    <div className="max-h-full overflow-y-auto bg-white  shadow-md">
      <TicketsDataTable
        isDraft={false}
        columns={generalTicketColumnDefiniton}
        data={generalTicketData}
        hasAssignment={false}
        hasNav={true}
      />
    </div>
  );
};
interface TicketTableProps<TData, Tvalue>
  extends DataTableProps<TData, Tvalue> {
  hasNav: boolean;
}
export function TicketsDataTable<TData, TValue>({
  columns,
  data,
  hasAssignment = false,
  hasNav = false,
}: TicketTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const nav = useNavigate();
  const {axios}=useAxiosClient()
  const {user}=useAuth()
  const [selectedCell, setSelectedCell] = useState(-1);
  const [isAssigning,setIsAssigning]=useState(false)
  const [searchedCpo,setSearchedCpo]=useState("")
  const [cellTransform, setCellTransform] = useState({ right: 0, top: 0 });
  const dropdownRef = useRef<HTMLDivElement | undefined>();
  const client=useQueryClient()

  const cposQuery = useQuery({
    queryKey: ["cpos"],
    queryFn: () =>
      axios("/cpo/all", {
        method: "GET",
      }).then((resp:any) =>{
        console.log(resp.data)
        return resp.data}),
    staleTime: Infinity,
  });

  const tryAssignTicket=(id:number,cpo:string)=>{
    if(!cpo) return
    setIsAssigning(true)
    axios("/tickets/assign",{
      method:"PUT",
      data:{
        supervisorEmail:user.email,
        cpoEmail:cpo,
        ticketId:id
      }
    }).then((resp:any)=>{
      setIsAssigning(false)
      toast({
        title:"Success!",
        description:`Ticket successfully assigned to ${cpo}`
      })
client.invalidateQueries({queryKey:["tickets", "unassigned"]})
    }).catch((err:Error)=>{
      setIsAssigning(false)
      toast({
        title:"Error!",
        description:err.message==="Request failed with status code 400"?"You need to be a terminal supervisor to assign a ticket!":err.message,
        variant:"destructive"
      })
    })
  }
  return (
    <div className="rounded-md border bg-white shadow-md  relative">
      {selectedCell != -1 && (
        <div
          ref={(el: HTMLDivElement) => (dropdownRef.current = el)}
          className="absolute w-80 h-52 bg-white rounded-md shadow-md z-[40] transition-all p-2 dropdown"
          style={{ top: cellTransform.top, right: cellTransform.right }}
        >
          <p className="text-[1.1rem]  text-darkBlue">Assign A Ticket</p>
          <input className="w-full h-7  my-2  outline-none   border-darkBlue border-2" />
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full p-2 border-2 border-neutral-300 h-8 my-2 flex justify-between text-xs  items-center">
              Filter By Group <IoMdArrowDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <p className="text-xs text-neutral-300">Test Group</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <Table>
        <TableHeader className="sticky top-0  ">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any, headerIndex: number) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`text-center ${
                      headerIndex == 0 &&
                      "sticky left-0 bg-white md:bg-transparent"
                    } `}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              {hasAssignment && data.length>0 && (
                <TableHead className="text-center">
                  <span className="t">Assign To </span>
                </TableHead>
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any, index: number) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (hasNav) {
                      nav(`/CPD/Ticket/${row.original["id"]}`);
                    }
                  }}
                >
                  {row
                    .getVisibleCells()
                    .map((cell: any, colindex: number) =>
                      cell.column.columnDef.accesorKey === "ticketStatus"   ? (
                        <StatusTableCell cell={cell} row={row} />
                      ) : cell.column.columnDef.accesorKey === "cpo" ? (
                        <CpoTableCell cell={cell} row={row} />
                      ) : (
                        <RegularTableCell
                          cell={cell}
                          index={colindex}
                          row={row}
                        />
                      )
                    )}
                  {hasAssignment &&  data.length>0 && (
                 
                    <TableCell className="grid place-items-center bg-transparent ">
                      <Popover>
                        <PopoverTrigger
                        disabled={isAssigning}
                          className="w-8 aspect-square rounded-full bg-darkBlue grid place-items-center disabled:bg-neutral-600 disabled:hover:cursor-wait  text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {" "}
                          <MdAssignmentInd />
                        </PopoverTrigger>
                       {
                        cposQuery.isSuccess &&  <PopoverContent
                        side="left"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 w-[14rem] md:w-[20rem] z-[5] "
                      >
                        <Command className="p-0 m-0 min-h-52 md:min-h-60">
                          <p className="text-[1.3rem] text-blue-300 mb-2">
                            Assign Ticket
                          </p>
                         <div className="px-1">
                         <Select  onValueChange={(value)=>{tryAssignTicket(row.original.id,value)}} defaultValue="" onOpenChange={(open)=>{if(!open)setSearchedCpo("")}}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a CPO"/>
                              </SelectTrigger>
                              <SelectContent className="p-1">
                                <Input className="my-3 w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]" onChange={(e)=>setSearchedCpo(e.target.value)}/>
                                <SelectGroup>
                                  { 
                                    cposQuery.data.filter((_cpo:any)=>_cpo.ncaaUserEmail.startsWith(searchedCpo)).map((_cpo:any)=>{
                                    return  <SelectItem value={_cpo.ncaaUserEmail}>{_cpo.ncaaUserEmail}</SelectItem>
                                    })
                                  }
                                  {
                                    cposQuery.data.filter((_cpo:any)=>_cpo.ncaaUserEmail.startsWith(searchedCpo)).length===0 && <p className="text-neutral-400 text-[0.8275rem] text-center m-auto">User Doesn't exist</p>
                                  }
                                </SelectGroup>
                              </SelectContent>
                          </Select>
                         </div>
                        
                          <div className="p-1 mt-auto">
                          <Select>
                            <SelectTrigger className="w-full my-2 ring-0 focus:ring-0  mt-auto">
                              <SelectValue placeholder="Filter By Group..." />{" "}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>User Groups</SelectLabel>
                                <SelectItem value="usd">
                                  User Supervisory Department
                                </SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          </div>
                        
                        </Command>
                      </PopoverContent>
                       }
                      </Popover>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface FlightsDataTableType<TData, TValue>
  extends DataTableProps<TData, TValue> {
  nav: (location: string) => void;
}

export function FlightsDataTable<TData, TValue>({
  columns,
  data,
  nav,
}: FlightsDataTableType<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-white shadow-md  relative">
      <Table>
        <TableHeader className="sticky top-0  ">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id} className="text-center ">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any, index: any) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: any, index: number) =>
                    cell.column.columnDef.accesorKey === "id" ? (
                      <TableCell
                        key={cell.id}
                        className={`text-center ${
                          cell.column.columnDef.accesorKey === "groupName" &&
                          "font-semibold"
                        } whitespace-nowrap hover:cursor-pointer hover:text-blue-300`}
                        onClick={() => {
                          nav(
                            row.original[
                              cell.column.columnDef.accesorKey
                            ].toString()
                          );
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.accesorKey === "id"
                            ? row.original[
                                cell.column.columnDef.accesorKey
                              ].toString() // Convert ID to string
                            : row.original[cell.column.columnDef.accesorKey],
                          cell.getContext()
                        )}
                      </TableCell>
                    ) : (
                      <RegularTableCell index={index} cell={cell} row={row} />
                    )
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
const openTicketColumnDefinition: ExtendedColumnDef<openTicket>[] = [
  {
    accesorKey: "id",
    header: "ID",
  },

  {
    accesorKey: "complainantName",
    header: "Complainant",
  },
  {
    accesorKey: "complainantType",
    header: "Complainant Type",
  },

  {
    accesorKey: "ticketStatus",
    header: "Status",
  },
  {
    accesorKey: "dateOfIncident",
    header: "Date due",
  },
];
const openTicketData: openTicket[] = [
  {
    id: "1",
    complaint_type: "Lost Luggage",
    complainant: "Chijioke Eze",
    status: "Open",
    date: "2023-11-20",
  },
  {
    id: "2",
    complaint_type: "Delayed Flight",
    complainant: "Ngozi Okonkwo",
    status: "Open",
    date: "2023-11-21",
  },
  {
    id: "3",
    complaint_type: "Poor Service",
    complainant: "Abdul Usman",
    status: "Open",
    date: "2023-11-22",
  },
  {
    id: "4",
    complaint_type: "Missing Item",
    complainant: "Nneka Adeleke",
    status: "Open",
    date: "2023-11-23",
  },
  {
    id: "5",
    complaint_type: "Cancelled Flight",
    complainant: "Oluwatobi Balogun",
    status: "Open",
    date: "2023-11-24",
  },
  {
    id: "6",
    complaint_type: "Security Concern",
    complainant: "Chinwe Okafor",
    status: "Open",
    date: "2023-11-25",
  },
  {
    id: "7",
    complaint_type: "Baggage Issue",
    complainant: "Adebayo Oni",
    status: "Open",
    date: "2023-11-26",
  },
  {
    id: "8",
    complaint_type: "Inadequate Facilities",
    complainant: "Chidinma Nwosu",
    status: "Open",
    date: "2023-11-27",
  },
  {
    id: "9",
    complaint_type: "Flight Cancellation",
    complainant: "Oluwaseun Akande",
    status: "Open",
    date: "2023-11-28",
  },
  {
    id: "10",
    complaint_type: "Damaged Luggage",
    complainant: "Osagie Ojo",
    status: "Open",
    date: "2023-11-29",
  },
  {
    id: "11",
    complaint_type: "Booking Error",
    complainant: "Adaeze Igwe",
    status: "Open",
    date: "2023-11-30",
  },
  {
    id: "12",
    complaint_type: "Customer Service Issue",
    complainant: "Yusuf Aliyu",
    status: "Open",
    date: "2023-12-01",
  },
  {
    id: "13",
    complaint_type: "Late Departure",
    complainant: "Chiamaka Ogbonna",
    status: "Open",
    date: "2023-12-02",
  },
  {
    id: "14",
    complaint_type: "Overbooking",
    complainant: "Emeka Eze",
    status: "Open",
    date: "2023-12-03",
  },
  {
    id: "15",
    complaint_type: "Flight Rescheduling",
    complainant: "Folake Adekunle",
    status: "Open",
    date: "2023-12-04",
  },
];
export const OpenTicketsTable = ({data}:{data:openTicket[]}) => {
  return (
    <div>
      <TicketsDataTable
        data={data}
        columns={openTicketColumnDefinition}
        isDraft={false}
        hasAssignment={true}
        hasNav={true}
      />
    </div>
  );
};

const RegularTableCell = ({
  cell,
  row,
  index,
}: {
  cell: any;
  row: any;
  index: number;
}) => {
  return (
    <TableCell
      key={cell.id}
      className={`text-center ${
        cell.column.columnDef.accesorKey === "groupName" && "font-semibold"
      } whitespace-nowrap ${
        cell.column.columnDef.accesorKey == "complainant" ||
        cell.column.columnDef.accesorKey == "slaName"
          ? "sticky left-0 bg-white md:bg-transparent group-hover:bg-slate-400 peer-hover:bg-slate-400"
          : ""
      }`}
    >
      {flexRender(
        cell.column.columnDef.accesorKey === "id"
          ? row.original[cell.column.columnDef.accesorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accesorKey]?.length > 0
          ?  cell.column.columnDef.accesorKey === "dateTimeCreated"? format(new Date(row.original[cell.column.columnDef.accesorKey]),'dd/MM/yyyy'): row.original[cell.column.columnDef.accesorKey]
          : "----",
        cell.getContext()
      )}
    </TableCell>
  );
};
const RegularTableCellDAS = ({
  cell,
  row,
  navto,
}: {
  cell: any;
  row: any;
  navto: (id: string) => void;
}) => {
  return cell.column.columnDef.accesorKey === "name" ? (
    <TableCell
      key={cell.id}
      onClick={() => navto(row.original["id"])}
      className={`${
        cell.column.columnDef.accesorKey === "name"
          ? "text-start"
          : "text-center"
      } whitespace-nowrap hover:text-blue-300 hover:cursor-pointer`}
    >
      {flexRender(
        cell.column.columnDef.accesorKey === "id"
          ? row.original[cell.column.columnDef.accesorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accesorKey],
        cell.getContext()
      )}
    </TableCell>
  ) : (
    <TableCell
      key={cell.id}
      className={`${
        cell.column.columnDef.accesorKey === "name"
          ? "text-start"
          : "text-center"
      } whitespace-nowrap`}
    >
      {flexRender(
        cell.column.columnDef.accesorKey === "id"
          ? row.original[cell.column.columnDef.accesorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accesorKey],
        cell.getContext()
      )}
    </TableCell>
  );
};

const CpoTableCell = ({ cell, row }: { cell: any; row: any }) => {
  return (
    <TableCell
      key={cell.id}
      className="flex  justify-center  items-center  gap-2"
    >
      {row.original[cell.column.columnDef.accesorKey] && (
        <span className="block  w-3 rounded-full  bg-green-400  aspect-square  ">
          {" "}
        </span>
      )}
      {row.original[cell.column.columnDef.accesorKey] ? (
        flexRender(
          row.original[cell.column.columnDef.accesorKey],
          cell.getContext()
        )
      ) : (
        <span className="block text-neutral-800/30">Unassigned</span>
      )}
    </TableCell>
  );
};
const FromTableCell = ({
  cell,
  row,
  isDraft = false,
}: {
  cell: any;
  row: any;
  isDraft: boolean;
}) => {
  return (
    <TableCell
      key={cell.id}
      className={`flex ${
        isDraft ? "flex-col justify-start t" : "flex-row  gap-2"
      }  ${
        !isDraft && cell.column.columnDef.header === "From"
          ? "md:justify-start   md:pl-[30%]"
          : "justify-center"
      }   items-center   `}
    >
      {cell.column.columnDef.header === "From" && (
        <span className="block  min-w-5 rounded-full  bg-darkBlue  aspect-square  ">
          {" "}
        </span>
      )}
      {isDraft && <p className="text-[0.8275rem] text-red-500">Draft</p>}
      {flexRender(
        row.original[cell.column.columnDef.accesorKey],
        cell.getContext()
      )}
    </TableCell>
  );
};
const StatusTableCell = ({ cell, row }: { cell: any; row: any }) => {
  const resolveStatus: (status: string) => string = (status = "") => {
    const btnStyles: Record<string, string> = {
      PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
      UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
      RESOLVED: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
      OPENED : "bg-[#FF585821] border-2 border-[#FF5858]",
      ESCALATED: "bg-[#D016DD21] border-2 border-[#D116DD]",
      UNASSIGNED: "",
    };


    return `${btnStyles[status]} inline h-max p-1`;
  };
  return (
    <TableCell
      key={cell.id}
      className="grid place-items-center grid-rows-1 grid-cols-1 "
    >
      <span
        className={`${resolveStatus(
          row.original[cell.column.columnDef.accesorKey]
        )} rounded-lg`}
      >
        {flexRender(
          row.original[cell.column.columnDef.accesorKey],
          cell.getContext()
        )}
      </span>
    </TableCell>
  );
};

const ResolvedTicketColumnDefinition: ExtendedColumnDef<ResolvedTicket>[] = [
  {
    accesorKey: "id",
    header: "ID",
  },

  {
    accesorKey: "complainantName",
    header: "Complainant",
  },
  {
    accesorKey: "complainantType",
    header: "Complainant Type",
  },
  {
    accesorKey: "creatorName",
    header: "CPO",
  },
  {
    accesorKey: "group",
    header: "Group",
  },
  {
    accesorKey: "ticketStatus",
    header: "Status",
  },
  {
    accesorKey: "dateOfIncident",
    header: "Date due",
  },
];
const resolvedTicketPlaceholderData: ResolvedTicket[] = [
  {
    id: "1",
    complaint_type: "Lost Luggage",
    complainant: "Chijioke Eze",
    status: "Resolved",
    date: "2023-11-20",
    group: "Customer Support",
    cpo: "John Smith",
  },
  {
    id: "2",
    complaint_type: "Delayed Flight",
    complainant: "Ngozi Okonkwo",
    status: "Resolved",
    date: "2023-11-21",
    group: "Operations",
    cpo: "Jane Doe",
  },
  {
    id: "3",
    complaint_type: "Poor Service",
    complainant: "Abdul Usman",
    status: "Resolved",
    date: "2023-11-22",
    group: "Customer Support",
    cpo: "Grace Johnson",
  },
  {
    id: "4",
    complaint_type: "Missing Item",
    complainant: "Nneka Adeleke",
    status: "Resolved",
    date: "2023-11-23",
    group: "Operations",
    cpo: "Michael Ojo",
  },
  {
    id: "5",
    complaint_type: "Cancelled Flight",
    complainant: "Oluwatobi Balogun",
    status: "Resolved",
    date: "2023-11-24",
    group: "Customer Support",
    cpo: "Fatima Ahmed",
  },
  {
    id: "6",
    complaint_type: "Security Concern",
    complainant: "Chinwe Okafor",
    status: "Resolved",
    date: "2023-11-25",
    group: "Security",
    cpo: "Emeka Eze",
  },
  {
    id: "7",
    complaint_type: "Baggage Issue",
    complainant: "Adebayo Oni",
    status: "Resolved",
    date: "2023-11-26",
    group: "Customer Support",
    cpo: "Linda Ikeji",
  },
  {
    id: "8",
    complaint_type: "Inadequate Facilities",
    complainant: "Chidinma Nwosu",
    status: "Resolved",
    date: "2023-11-27",
    group: "Facilities",
    cpo: "Daniel Ajayi",
  },
  {
    id: "9",
    complaint_type: "Flight Cancellation",
    complainant: "Oluwaseun Akande",
    status: "Resolved",
    date: "2023-11-28",
    group: "Operations",
    cpo: "Mary Johnson",
  },
  {
    id: "10",
    complaint_type: "Damaged Luggage",
    complainant: "Osagie Ojo",
    status: "Resolved",
    date: "2023-11-29",
    group: "Customer Support",
    cpo: "Blessing Okoro",
  },
  {
    id: "11",
    complaint_type: "Booking Error",
    complainant: "Adaeze Igwe",
    status: "Resolved",
    date: "2023-11-30",
    group: "Customer Support",
    cpo: "Alex Nwankwo",
  },
  {
    id: "12",
    complaint_type: "Customer Service Issue",
    complainant: "Yusuf Aliyu",
    status: "Resolved",
    date: "2023-12-01",
    group: "Customer Support",
    cpo: "Jennifer Ahmed",
  },
  {
    id: "13",
    complaint_type: "Late Departure",
    complainant: "Chiamaka Ogbonna",
    status: "Resolved",
    date: "2023-12-02",
    group: "Operations",
    cpo: "Chuka Okafor",
  },
  {
    id: "14",
    complaint_type: "Overbooking",
    complainant: "Emeka Eze",
    status: "Resolved",
    date: "2023-12-03",
    group: "Operations",
    cpo: "Ngozi Okafor",
  },
  {
    id: "15",
    complaint_type: "Flight Rescheduling",
    complainant: "Folake Adekunle",
    status: "Resolved",
    date: "2023-12-04",
    group: "Operations",
    cpo: "Kunle Ojo",
  },
];

export const ResolvedTicketsTable = ({data}:{data:ResolvedTicket[]}) => {
  return (
    <div className="w-full h-full  overflow-y-auto">
      <TicketsDataTable
        isDraft={false}
        data={data}
        columns={ResolvedTicketColumnDefinition}
        hasAssignment={false}
        hasNav={true}
      />
    </div>
  );
};

const UnresolvedTicketsColumnDefinition: ExtendedColumnDef<ResolvedTicket>[] = [
  {
    accesorKey: "id",
    header: "ID",
  },

  {
    accesorKey: "complainantName",
    header: "Complainant",
  },
  {
    accesorKey: "complainantType",
    header: "Complainant Type",
  },
  {
    accesorKey: "creatorName",
    header: "CPO",
  },
  {
    accesorKey: "group",
    header: "Group",
  },
  {
    accesorKey: "ticketStatus",
    header: "Status",
  },
  {
    accesorKey: "dateOfIncident",
    header: "Date due",
  },
];

const UnresolvedTicketsPlaceholderData: ResolvedTicket[] = [
  {
    id: "1",
    complaint_type: "Lost Luggage",
    complainant: "Chijioke Eze",
    status: "Unresolved",
    date: "2023-11-20",
    group: "Customer Support",
    cpo: "",
  },
  {
    id: "2",
    complaint_type: "Delayed Flight",
    complainant: "Ngozi Okonkwo",
    status: "Unresolved",
    date: "2023-11-21",
    group: "Operations",
    cpo: "Jane Doe",
  },
  {
    id: "3",
    complaint_type: "Poor Service",
    complainant: "Abdul Usman",
    status: "Unresolved",
    date: "2023-11-22",
    group: "Customer Support",
    cpo: "Grace Johnson",
  },
  {
    id: "4",
    complaint_type: "Missing Item",
    complainant: "Nneka Adeleke",
    status: "Unresolved",
    date: "2023-11-23",
    group: "Operations",
    cpo: "",
  },
  {
    id: "5",
    complaint_type: "Cancelled Flight",
    complainant: "Oluwatobi Balogun",
    status: "Unresolved",
    date: "2023-11-24",
    group: "Customer Support",
    cpo: "Fatima Ahmed",
  },
  {
    id: "6",
    complaint_type: "Security Concern",
    complainant: "Chinwe Okafor",
    status: "Unresolved",
    date: "2023-11-25",
    group: "Security",
    cpo: "Emeka Eze",
  },
  {
    id: "7",
    complaint_type: "Baggage Issue",
    complainant: "Adebayo Oni",
    status: "Unresolved",
    date: "2023-11-26",
    group: "Customer Support",
    cpo: "Linda Ikeji",
  },
  {
    id: "8",
    complaint_type: "Inadequate Facilities",
    complainant: "Chidinma Nwosu",
    status: "Unresolved",
    date: "2023-11-27",
    group: "Facilities",
    cpo: "Daniel Ajayi",
  },
  {
    id: "9",
    complaint_type: "Flight Cancellation",
    complainant: "Oluwaseun Akande",
    status: "Unresolved",
    date: "2023-11-28",
    group: "Operations",
    cpo: "Mary Johnson",
  },
  {
    id: "10",
    complaint_type: "Damaged Luggage",
    complainant: "Osagie Ojo",
    status: "Unresolved",
    date: "2023-11-29",
    group: "Customer Support",
    cpo: "",
  },
  {
    id: "11",
    complaint_type: "Booking Error",
    complainant: "Adaeze Igwe",
    status: "Unresolved",
    date: "2023-11-30",
    group: "Customer Support",
    cpo: "Alex Nwankwo",
  },
  {
    id: "12",
    complaint_type: "Customer Service Issue",
    complainant: "Yusuf Aliyu",
    status: "Unresolved",
    date: "2023-12-01",
    group: "Customer Support",
    cpo: "Jennifer Ahmed",
  },
  {
    id: "13",
    complaint_type: "Late Departure",
    complainant: "Chiamaka Ogbonna",
    status: "Unresolved",
    date: "2023-12-02",
    group: "Operations",
    cpo: "",
  },
  {
    id: "14",
    complaint_type: "Overbooking",
    complainant: "Emeka Eze",
    status: "Unresolved",
    date: "2023-12-03",
    group: "Operations",
    cpo: "Ngozi Okafor",
  },
  {
    id: "15",
    complaint_type: "Flight Rescheduling",
    complainant: "Folake Adekunle",
    status: "Unresolved",
    date: "2023-12-04",
    group: "Operations",
    cpo: "Kunle Ojo",
  },
];
export const UnresolvedTicketsTable = ({data}:{data:ResolvedTicket[]}) => {
  return (
    <div className="w-full h-full  overflow-y-auto">
      <TicketsDataTable
        data={data}
        isDraft={false}
        columns={UnresolvedTicketsColumnDefinition}
        hasAssignment={true}
        hasNav={true}
      />
    </div>
  );
};
const unassignedTicketColumnDefinition: ExtendedColumnDef<unassignedTicket>[] =
  [
    {
      accesorKey: "id",
      header: "ID",
    },
    {
      accesorKey: "complainantName",
      header: "Complainant",
    },
    {
      accesorKey: "complainantType",
      header: "Complainant Type",
    },
    {
      accesorKey: "creatorName",
      header: "CPO",
    },
    {
      accesorKey: "group",
      header: "Group",
    },
    {
      accesorKey: "assignStatus",
      header: "Status",
    },
    {
      accesorKey: "dateOfIncident",
      header: "Date due",
    },
  ];

const unassignedTicketData: unassignedTicket[] = [
  {
    id: "UT001",
    complainant: "Mojisola Adeleke",
    complaint_type: "Facility Issue",
    cpo: "",
    status: "Unassigned",
    date: "2023-11-22",
  },
  {
    id: "UT002",
    complainant: "Yinka Akintola",
    complaint_type: "Lost Luggage",
    cpo: "",
    status: "Unassigned",
    date: "2023-11-23",
  },
  {
    id: "UT003",
    complainant: "Adebayo Johnson",
    complaint_type: "Security Concern",
    cpo: "",
    status: "Unassigned",
    date: "2023-11-24",
  },
  {
    id: "UT004",
    complainant: "Ifeoma Nwankwo",
    complaint_type: "Flight Delay",
    cpo: "",
    status: "Unassigned",
    date: "2023-11-25",
  },
  {
    id: "UT005",
    complainant: "Bola Okeke",
    complaint_type: "Quality of Service",
    cpo: "",
    status: "Unassigned",
    date: "2023-11-26",
  },
  {
    id: "UT006",
    complainant: "Chidi Okonkwo",
    complaint_type: "Baggage Handling",
    cpo: "",
    status: "Unassigned",
    date: "2023-11-27",
  },
  {
    id: "UT007",
    complainant: "Nneka Chukwu",
    complaint_type: "Cleanliness Concern",
    cpo: "",
    status: "Unassigned",
    date: "2023-11-28",
  },
];
export const UnassignedTicketsTable = ({data}:{data:unassignedTicket[]}) => {
  return (
    <div className="w-full h-full  overflow-y-auto">
      <TicketsDataTable
        data={data}
        isDraft={false}
        columns={unassignedTicketColumnDefinition}
        hasAssignment={true}
        hasNav={true}
      />
    </div>
  );
};

const escalatedTicketsPlaceholder: ResolvedTicket[] = [
  {
    id: "1",
    complaint_type: "Lost Luggage",
    complainant: "Chijioke Eze",
    status: "Escalated",
    date: "2023-11-20",
    group: "Customer Support",
    cpo: "",
  },
  {
    id: "2",
    complaint_type: "Delayed Flight",
    complainant: "Ngozi Okonkwo",
    status: "Escalated",
    date: "2023-11-21",
    group: "Operations",
    cpo: "Jane Doe",
  },
  {
    id: "3",
    complaint_type: "Poor Service",
    complainant: "Abdul Usman",
    status: "Escalated",
    date: "2023-11-22",
    group: "Customer Support",
    cpo: "Grace Johnson",
  },
  {
    id: "4",
    complaint_type: "Missing Item",
    complainant: "Nneka Adeleke",
    status: "Escalated",
    date: "2023-11-23",
    group: "Operations",
    cpo: "",
  },
  {
    id: "5",
    complaint_type: "Cancelled Flight",
    complainant: "Oluwatobi Balogun",
    status: "Escalated",
    date: "2023-11-24",
    group: "Customer Support",
    cpo: "Fatima Ahmed",
  },
  {
    id: "6",
    complaint_type: "Security Concern",
    complainant: "Chinwe Okafor",
    status: "Escalated",
    date: "2023-11-25",
    group: "Security",
    cpo: "Emeka Eze",
  },
  {
    id: "7",
    complaint_type: "Baggage Issue",
    complainant: "Adebayo Oni",
    status: "Escalated",
    date: "2023-11-26",
    group: "Customer Support",
    cpo: "Linda Ikeji",
  },
  {
    id: "8",
    complaint_type: "Inadequate Facilities",
    complainant: "Chidinma Nwosu",
    status: "Escalated",
    date: "2023-11-27",
    group: "Facilities",
    cpo: "Daniel Ajayi",
  },
  {
    id: "9",
    complaint_type: "Flight Cancellation",
    complainant: "Oluwaseun Akande",
    status: "Escalated",
    date: "2023-11-28",
    group: "Operations",
    cpo: "Mary Johnson",
  },
  {
    id: "10",
    complaint_type: "Damaged Luggage",
    complainant: "Osagie Ojo",
    status: "Escalated",
    date: "2023-11-29",
    group: "Customer Support",
    cpo: "",
  },
  {
    id: "11",
    complaint_type: "Booking Error",
    complainant: "Adaeze Igwe",
    status: "Escalated",
    date: "2023-11-30",
    group: "Customer Support",
    cpo: "Alex Nwankwo",
  },
  {
    id: "12",
    complaint_type: "Customer Service Issue",
    complainant: "Yusuf Aliyu",
    status: "Escalated",
    date: "2023-12-01",
    group: "Customer Support",
    cpo: "Jennifer Ahmed",
  },
  {
    id: "13",
    complaint_type: "Late Departure",
    complainant: "Chiamaka Ogbonna",
    status: "Escalated",
    date: "2023-12-02",
    group: "Operations",
    cpo: "",
  },
  {
    id: "14",
    complaint_type: "Overbooking",
    complainant: "Emeka Eze",
    status: "Escalated",
    date: "2023-12-03",
    group: "Operations",
    cpo: "Ngozi Okafor",
  },
  {
    id: "15",
    complaint_type: "Flight Rescheduling",
    complainant: "Folake Adekunle",
    status: "Escalated",
    date: "2023-12-04",
    group: "Operations",
    cpo: "Kunle Ojo",
  },
];
export const EscalatedTicketsTable = ({data}:{data:ResolvedTicket[]}) => {
  return (
    <div className="w-full h-full  overflow-y-auto">
      <TicketsDataTable
        data={data}
        isDraft={false}
        columns={UnresolvedTicketsColumnDefinition}
        hasAssignment={true}
        hasNav={true}
      />
    </div>
  );
};

type MessageDataTablepProps<TData, TValue> = DataTableProps<TData, TValue> & {
  section: string;
  nav: (location: string) => void;
};
export function MessageDataTable<TData, TValue>({
  columns,
  data,
  isDraft = false,
  section,
  nav,
}: MessageDataTablepProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-white shadow-md relative">
      <Table>
        <TableHeader className="sticky top-0  ">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-center sticky top-0"
                  >
                    {header.isPlaceholder ? null : header.column.columnDef
                        .header === "time" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 ">
                          <p>Any Time</p>
                          <CiClock1 />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white rounded-md w-20 shadow-md">
                          <p>Previous 4 Hours</p>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                );
              })}
              <TableHead className="w-20"></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any, index: number) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  nav(
                    `${window.location.pathname}/${String(
                      row.original["recipient"]
                    ).replace(" ", "_")}`
                  );
                }}
              >
                {row
                  .getVisibleCells()
                  .map((cell: any, cellIndex: number) =>
                    cell.column.columnDef.accesorKey.toLowerCase().includes("status") ? (
                      <StatusTableCell cell={cell} row={row} />
                    ) : cell.column.columnDef.accesorKey === "recipient" ? (
                      <FromTableCell cell={cell} row={row} isDraft={isDraft} />
                    ) : (
                      <RegularTableCell
                        cell={cell}
                        row={row}
                        index={cellIndex}
                      />
                    )
                  )}

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <BsThreeDots />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-10 bg-white rounded-md shadow-md">
                      <DropdownMenuItem></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const InboxMessageColumnDefinition: ExtendedColumnDef<Message>[] = [
  {
    header: "From",
    accesorKey: "recipient",
  },
  {
    header: "Complain Type",
    accesorKey: "complaint_type",
  },
  {
    header: "Status",
    accesorKey: "status",
  },
  {
    header: "time",
    accesorKey: "time",
  },
];

const inboxMessageData: Message[] = [
  {
    recipient: "John Doe",
    complaint_type: "Facility Issue",
    status: "Unresolved",
    time: "2023-11-22 10:30 AM",
  },
  {
    recipient: "Jane Smith",
    complaint_type: "Lost Luggage",
    status: "Escalated",
    time: "2023-11-23 02:45 PM",
  },
  {
    recipient: "Emma Wilson",
    complaint_type: "Security Concern",
    status: "Resolved",
    time: "2023-11-24 09:15 AM",
  },
  {
    recipient: "Michael Johnson",
    complaint_type: "Flight Delay",
    status: "Unresolved",
    time: "2023-11-25 11:00 AM",
  },
  {
    recipient: "Grace Akande",
    complaint_type: "Quality of Service",
    status: "Escalated",
    time: "2023-11-26 03:30 PM",
  },
  {
    recipient: "Samuel Adewale",
    complaint_type: "Baggage Handling",
    status: "Resolved",
    time: "2023-11-27 08:45 AM",
  },
  {
    recipient: "Efe Ojo",
    complaint_type: "Cleanliness Concern",
    status: "Unresolved",
    time: "2023-11-28 01:20 PM",
  },
];

export const InboxDataTable = ({ nav }: { nav: () => void }) => {
  return (
    <div className="w-[100%]   max-h-[60vh]  overflow-y-auto">
      <MessageDataTable
        columns={InboxMessageColumnDefinition}
        isDraft={false}
        data={inboxMessageData}
        hasAssignment={false}
        section="inbox"
        nav={nav}
      />
    </div>
  );
};

const OutboundMessagesColumnDef: ExtendedColumnDef<Message>[] = [
  {
    header: "To",
    accesorKey: "recipient",
  },
  {
    header: "Complain Type",
    accesorKey: "complaint_type",
  },
  {
    header: "Status",
    accesorKey: "status",
  },
  {
    header: "time",
    accesorKey: "time",
  },
];

const DraftMessageColumnDefinition: ExtendedColumnDef<Message>[] = [
  {
    header: "To",
    accesorKey: "recipient",
  },
  {
    header: "Complain Type",
    accesorKey: "complaint_type",
  },
  {
    header: "Status",
    accesorKey: "status",
  },
  {
    header: "time",
    accesorKey: "time",
  },
];
export const OutboxDataTable = ({ nav }: { nav: () => void }) => {
  return (
    <div className="w-[100%] h-full    max-h-[60vh]  overflow-y-auto">
      <MessageDataTable
        columns={OutboundMessagesColumnDef}
        isDraft={false}
        data={inboxMessageData}
        hasAssignment={false}
        section="sent"
        nav={nav}
      />
    </div>
  );
};

export const DraftDataTable = ({ nav }: { nav: () => void }) => {
  return (
    <div className="w-[100%] h-full    max-h-[60vh]  overflow-y-auto">
      <MessageDataTable
        columns={DraftMessageColumnDefinition}
        hasAssignment={false}
        data={inboxMessageData}
        isDraft={true}
        section="drafts"
        nav={nav}
      />
    </div>
  );
};

const reportTicketDistributionColumnDef: ExtendedColumnDef<TicketDistribution>[] =
  [
    {
      header: "ID",
      accesorKey: "id",
    },
    {
      header: "CPO Name",
      accesorKey: "cpoName",
    },
    {
      header: "Assigned",
      accesorKey: "assigned",
    },
    {
      header: "Active",
      accesorKey: "active",
    },
    {
      header: "Resolved",
      accesorKey: "resolved",
    },
    {
      header: "Escalated",
      accesorKey: "escalated",
    },
    {
      header: "Stress Level",
      accesorKey: "stressLevel",
    },
  ];
interface TicketsDistributionTableProps<TData, TValue>
  extends DataTableProps<TData, TValue> {
  nav: (id: string) => void;
}
export function TicketDistributionDataTable<TData, TValue>({
  columns,
  data,
  nav,
}: TicketsDistributionTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-white shadow-xl ">
      <Table>
        <TableHeader className="sticky top-0  ">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id} className="text-center ">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              <TableHead></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row
                  .getVisibleCells()
                  .map((cell: any, cellIndex: number) =>
                    cell.column.columnDef.accesorKey === "stressLevel" ? (
                      <StressLevelCell cell={cell} row={row} />
                    ) : (
                      <RegularTableCell
                        cell={cell}
                        index={cellIndex}
                        row={row}
                      />
                    )
                  )}
                <TableCell>
                  <button
                    className="w-16 outline-none h-8 border-2 border-neutral-500 rounded-md hover:bg-black hover:text-white transition-colors duration-500"
                    onClick={() => {
                      nav(`/CPD/Tickets/CPO/${row.original["id"]}`);
                    }}
                  >
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const StressLevelCell = ({ cell, row }: any) => {
  const cellStyle: Record<string, string> = {
    High: "text-red-300",
    Medium: "text-yellow-300",
    Low: "text-blue-600",
  };
  return (
    <TableCell
      className={`${
        cellStyle[row.original[cell.column.columnDef.accesorKey]]
      } font-semibold text-center`}
    >
      {flexRender(
        row.original[cell.column.columnDef.accesorKey],
        cell.getContext()
      )}
    </TableCell>
  );
};

const ticketDistributionData: TicketDistribution[] = [
  {
    id: "TD001",
    cpoName: "Jane Smith",
    assigned: "8",
    active: "5",
    resolved: "10",
    escalated: "3",
    stressLevel: "High",
  },
  {
    id: "TD002",
    cpoName: "John Doe",
    assigned: "6",
    active: "3",
    resolved: "8",
    escalated: "2",
    stressLevel: "Medium",
  },
  {
    id: "TD003",
    cpoName: "Emma Wilson",
    assigned: "10",
    active: "7",
    resolved: "12",
    escalated: "4",
    stressLevel: "Low",
  },
  {
    id: "TD004",
    cpoName: "Michael Johnson",
    assigned: "5",
    active: "2",
    resolved: "6",
    escalated: "1",
    stressLevel: "Medium",
  },
  {
    id: "TD005",
    cpoName: "Grace Akande",
    assigned: "12",
    active: "8",
    resolved: "14",
    escalated: "6",
    stressLevel: "High",
  },
  {
    id: "TD006",
    cpoName: "Samuel Adewale",
    assigned: "7",
    active: "4",
    resolved: "9",
    escalated: "3",
    stressLevel: "Low",
  },
  {
    id: "TD007",
    cpoName: "Efe Ojo",
    assigned: "9",
    active: "6",
    resolved: "11",
    escalated: "5",
    stressLevel: "High",
  },
  {
    id: "TD008",
    cpoName: "Blessing Afolayan",
    assigned: "4",
    active: "2",
    resolved: "5",
    escalated: "1",
    stressLevel: "Medium",
  },
  {
    id: "TD009",
    cpoName: "Daniel Obi",
    assigned: "11",
    active: "7",
    resolved: "13",
    escalated: "5",
    stressLevel: "High",
  },
  {
    id: "TD010",
    cpoName: "Chinwe Onyekachi",
    assigned: "6",
    active: "3",
    resolved: "7",
    escalated: "2",
    stressLevel: "Medium",
  },
  {
    id: "TD011",
    cpoName: "Mercy Eze",
    assigned: "8",
    active: "5",
    resolved: "10",
    escalated: "3",
    stressLevel: "Low",
  },
  {
    id: "TD012",
    cpoName: "David Oluwaseun",
    assigned: "10",
    active: "6",
    resolved: "12",
    escalated: "4",
    stressLevel: "High",
  },
  {
    id: "TD013",
    cpoName: "Jennifer Adekoya",
    assigned: "5",
    active: "2",
    resolved: "6",
    escalated: "1",
    stressLevel: "Medium",
  },
  {
    id: "TD014",
    cpoName: "Emeka Okonkwo",
    assigned: "9",
    active: "4",
    resolved: "11",
    escalated: "5",
    stressLevel: "Low",
  },
  {
    id: "TD015",
    cpoName: "Folake Adeyemi",
    assigned: "7",
    active: "5",
    resolved: "8",
    escalated: "3",
    stressLevel: "High",
  },
  // Add more data as needed
];

export const TicketDistributionTable = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[40vh]">
      <TicketDistributionDataTable
        isDraft={false}
        hasAssignment={false}
        data={ticketDistributionData}
        columns={reportTicketDistributionColumnDef}
        nav={navigate}
      />
    </div>
  );
};
const slaGeneralColumnDef: ExtendedColumnDef<SlaGeneral>[] = [
  {
    accesorKey: "slaName",
    header: "SLA Name",
  },
  {
    accesorKey: "resolutionTime",
    header: "Resolution Time",
  },
  {
    accesorKey: "responseTime",
    header: "Response Time",
  },
];

const slaGeneralPlaceholderData: SlaGeneral[] = [
  {
    slaName: "High Priority",
    resolutionTime: "10 days,1 hour 50 minutes",
    responseTime: "7days 0hrs 50 minutes",
  },
  {
    slaName: "Medium Priority",
    resolutionTime: "10 days,2 hours 0 minutes",
    responseTime: "7days 0hrs 50 minutes",
  },
  {
    slaName: "Normal Priority",
    resolutionTime: "10 days,2 hours 0 minutes",
    responseTime: "7days 0hrs 50 minutes",
  },
  {
    slaName: "Low Priority",
    resolutionTime: "10 days,8 hours 0 minutes",
    responseTime: "7days 0hrs 50 minutes",
  },
  {
    slaName: "VIP Priority",
    resolutionTime: "10 days,30 minutes",
    responseTime: "7days 0hrs 50 minutes",
  },
];
interface slaTableProps<TData, TValue> extends DataTableProps<TData, TValue> {
  navUrl: string;
  navRegion: string;
  hasEdit: boolean;
}
export function SlADataTable<TData, TValue>({
  columns,
  data,
  isDraft = false,
  navUrl = "",
  navRegion = "",
  hasEdit = false,
}: slaTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const nav: NavigateFunction = useNavigate();
  return (
    <div className=" border bg-white shadow-md ">
      <Table>
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-center h-12 bg-neutral-100 "
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
             {
              hasEdit && <TableHead className="w-20 bg-neutral-100"></TableHead>
             }
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell: any, index: number) => (
                  <RegularTableCell cell={cell} index={index} row={row} />
                ))}

                {hasEdit && (
                  <TableCell>
                    <span className="block w-24">
                      <FaRegEdit
                        className="text-[1.2rem] text-blue-400 hover:cursor-pointer"
                        onClick={() => {
                          nav(
                            `${navUrl}${row.original[navRegion].replaceAll(
                              " ",
                              "_"
                            )}`
                          );
                        }}
                      />
                    </span>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


export function GroupConfigDT<TData, TValue>({
  columns,
  data,
  isDraft = false,
  navUrl = "",
  navRegion = "",
  hasEdit = false,
}: slaTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const nav: NavigateFunction = useNavigate();
  return (
    <div className=" border bg-white shadow-md ">
      <Table>
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-center h-12 bg-neutral-100 "
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
             {
              hasEdit && <TableHead className="w-20 bg-neutral-100"></TableHead>
             }
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell: any, index: number) => {
                return  cell.column.columnDef.accesorKey === "groupName"?<TableCell className="hover:text-blue-400 hover:cursor-pointer  text-center" onClick={()=>{nav(`/CPD/user_groups/?group=${row.original["groupName"].replaceAll(" ","_")}`,{replace:true})}}>
                    {
                      flexRender(row.original[cell.column.columnDef.accesorKey].toString(),cell.getContext())
                    }
                  </TableCell>:
                  <RegularTableCell cell={cell} index={index} row={row} />
})}

                {hasEdit && (
                  <TableCell>
                    <span className="block w-24">
                      <FaRegEdit
                        className="text-[1.2rem] text-blue-400 hover:cursor-pointer"
                        onClick={() => {
                          nav(
                            `${navUrl}${row.original[navRegion].replaceAll(
                              " ",
                              "_"
                            )}`
                          );
                        }}
                      />
                    </span>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const GeneralSlaDataTable = () => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <SlADataTable
        isDraft={false}
        hasAssignment={false}
        columns={slaGeneralColumnDef}
        data={slaGeneralPlaceholderData}
        navUrl="/CPD/Configuration/Sla/Edit/"
        navRegion="slaName"
        hasEdit={true}
      />
    </div>
  );
};

const generalGroupColumnDef: ExtendedColumnDef<GeneralGroup>[] = [
  {
    accesorKey: "groupName",
    header: "Group Name",
  },
  {
    accesorKey: "groupDescription",
    header: "Group Description",
  },
  {
    accesorKey: "members",
    header: "Members",
  },
];

const generalGroupPlaceholderData: GeneralGroup[] = [
  {
    groupName: "User / Supervisory Department",
    groupDescription: "Short Description of group Properties",
    members: "400",
  },
  {
    groupName: "Regional Head / Terminal Head",
    groupDescription: "Short Description of group Properties",
    members: "30",
  },
  {
    groupName: "Area Managers",
    groupDescription: "Short Description of group Properties",
    members: "10",
  },
  {
    groupName: "General Managers / Directors",
    groupDescription: "Short Description of group Properties",
    members: "400",
  },
];
export const  GeneralGroupTable = ({data}:{data:GeneralGroup[]}) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <GroupConfigDT
        hasAssignment={false}
        isDraft={false}
        columns={generalGroupColumnDef}
        data={data}
        navRegion="groupName"
        navUrl="/CPD/Configuration/Groups/"
        hasEdit={false}
      />
    </div>
  );
};

const generalTerminalColumnDef: ExtendedColumnDef<GeneralTerminal>[] = [
  {
    accesorKey: "id",
    header: "ID",
  },
  {
    accesorKey: "name",
    header: "Name",
  },
];

interface GeneralTerminalDataTableType<TData, Tvalue>
  extends DataTableProps<TData, Tvalue> {
  navTo: (location: string) => void;
}
export function GeneralTerminalDataTable<TData, TValue>({
  columns,
  data,
  isDraft = false,
  navTo,
}: GeneralTerminalDataTableType<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className=" border bg-white shadow-md ">
      <Table>
        <TableHeader className="sticky top-0  ">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`text-center h-12 bg-neutral-100 ${
                      header.column.columnDef.header !== "Name"
                        ? "w-20"
                        : "text-start"
                    } `}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              <TableHead className="w-20 bg-neutral-100"></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <RegularTableCellDAS cell={cell} navto={navTo} row={row} />
                ))}

                <TableCell>
                  <span className=" w-24 flex items-center justify-end">
                    <FaRegEdit className="text-[1.2rem] text-blue-400" />
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const generalTerminalData: GeneralTerminal[] = [
  {
    name: "Abuja",
    id: "ABJ",
  },
  {
    id: "ILL",
    name: "Illorin",
  },
  {
    id: "LAG",
    name: "Lagos",
  },
];
type terminalCompProps = {
  data: GeneralTerminal[];
  navTo: () => {};
};

export const TerminalDataTable: React.FC<terminalCompProps> = ({
  data,
  navTo,
}) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <GeneralTerminalDataTable
        hasAssignment={false}
        isDraft={false}
        columns={generalTerminalColumnDef}
        data={data}
        navTo={navTo}
      />
    </div>
  );
};

export const DelayedFlightsColumnDef: ExtendedColumnDef<DelayedFlight>[] = [
  {
    accesorKey: "id",
    header: "Airline",
  },
  {
    accesorKey: "numberOfFlights",
    header: "Number Of Flights",
  },
  {
    accesorKey: "delays",
    header: "Delays",
  },
  {
    accesorKey: "delayL1",
    header: "Delays < 1 Hour",
  },
  {
    accesorKey: "delay1_2",
    header: "Delays Between 1 and 2 Hours",
  },
  {
    accesorKey: "delayg2",
    header: "Delays > 2 Hours",
  },
];

export const DelayedFlightData: DelayedFlight[] = [
  {
    id: "Air Peace",
    numberOfFlights: "26",
    delays: "23",
    delayL1: "11",
    delay1_2: "1",
    delayg2: "1",
  },
  {
    id: "Arik Air",
    numberOfFlights: "26",
    delays: "2",
    delayL1: "1",
    delay1_2: "0",
    delayg2: "0",
  },
  {
    id: "Max Air",
    numberOfFlights: "32",
    delays: "16",
    delayL1: "1",
    delay1_2: "6",
    delayg2: "0",
  },
  {
    id: "Aero",
    numberOfFlights: "28",
    delays: "4",
    delayL1: "1",
    delay1_2: "1",
    delayg2: "0",
  },
  {
    id: "Dana Air",
    numberOfFlights: "20",
    delays: "4",
    delayL1: "2",
    delay1_2: "0",
    delayg2: "0",
  },
  {
    id: "Azman Air",
    numberOfFlights: "0",
    delays: "0",
    delayL1: "0",
    delay1_2: "0",
    delayg2: "0",
  },
  {
    id: "Overland",
    numberOfFlights: "14",
    delays: "7",
    delayL1: "1",
    delay1_2: "1",
    delayg2: "2",
  },
  {
    id: "Ibom Air",
    numberOfFlights: "28",
    delays: "8",
    delayL1: "5",
    delay1_2: "1",
    delayg2: "0",
  },
  {
    id: "United Nigeria",
    numberOfFlights: "14",
    delays: "2",
    delayL1: "1",
    delay1_2: "0",
    delayg2: "0",
  },
  {
    id: "Overland",
    numberOfFlights: "12",
    delays: "4",
    delayL1: "2",
    delay1_2: "0",
    delayg2: "0",
  },
  {
    id: "Valeu Jet",
    numberOfFlights: "6",
    delays: "1",
    delayL1: "0",
    delay1_2: "0",
    delayg2: "0",
  },
];
type flightDataTableProps = {
  columns: [];
  data: [];
  nav: () => {};
};

export const FlightDataTable: React.FC<flightDataTableProps> = ({
  columns,
  data,
  nav,
}) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <FlightsDataTable
        isDraft={false}
        hasAssignment={false}
        columns={columns}
        data={data}
        nav={nav}
      />
    </div>
  );
};

export const cancelledFlightColumnDef: ExtendedColumnDef<cancelledFlight>[] = [
  {
    accesorKey: "id",
    header: "Airline",
  },
  {
    accesorKey: "cancelledFlights",
    header: "Cancelled Flights",
  },
  {
    accesorKey: "numberOfFlights",
    header: "Number of Cancelled Flights",
  },
];

export const cancelledFlightPlaceholderData: cancelledFlight[] = [
  {
    id: "Air Peace",
    cancelledFlights: "12",
    numberOfFlights: "26",
  },
  {
    id: "Arik Air",
    numberOfFlights: "26",
    cancelledFlights: "18",
  },
  {
    id: "Max Air",
    numberOfFlights: "32",
    cancelledFlights: "13",
  },
  {
    id: "Aero",
    numberOfFlights: "28",
    cancelledFlights: "22",
  },
  {
    id: "Dana Air",
    numberOfFlights: "20",
    cancelledFlights: "14",
  },
  {
    id: "Azman Air",
    numberOfFlights: "0",
    cancelledFlights: "0",
  },
  {
    id: "Overland",
    numberOfFlights: "14",
    cancelledFlights: "5",
  },
  {
    id: "Ibom Air",
    numberOfFlights: "28",
    cancelledFlights: "10",
  },
  {
    id: "United Nigeria",
    numberOfFlights: "14",
    cancelledFlights: "8",
  },
  {
    id: "Overland",
    numberOfFlights: "12",
    cancelledFlights: "4",
  },
  {
    id: "Valeu Jet",
    numberOfFlights: "6",
    cancelledFlights: "2",
  },
];

const reportsColumnDef: ExtendedColumnDef<Report>[] = [
  {
    accesorKey: "fltNo",
    header: "Flight Number",
  },
  {
    accesorKey: "route",
    header: "Route",
  },
  {
    accesorKey: "sta",
    header: "STA",
  },
  {
    accesorKey: "ata",
    header: "ATA",
  },
  {
    accesorKey: "delay",
    header: "Delay",
  },
  {
    accesorKey: "isDelayed",
    header: "Is Delayed",
  },
  {
    accesorKey: "isOnTime",
    header: "Is On Time",
  },
  {
    accesorKey: "isCancelled",
    header: "isCancelled",
  },
  {
    accesorKey: "type",
    header: "Type",
  },
];

export function ReportsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-white shadow-md  relative">
      <Table>
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id} className="text-center ">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              <TableHead></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any, index: number) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: any, index: number) =>
                    cell.column.columnDef.accesorKey === "isOnTime" ||
                    cell.column.columnDef.accesorKey === "isDelayed" ||
                    cell.column.columnDef.accesorKey === "isCancelled" ? (
                      <TableCell
                        key={cell.id}
                        className={`text-center ${
                          cell.column.columnDef.accesorKey === "groupName" &&
                          "font-semibold"
                        } whitespace-nowrap hover:cursor-pointer hover:text-blue-300`}
                      >
                        {row.original[cell.column.columnDef.accesorKey] ? (
                          <CiCircleCheck className="text-green-600" />
                        ) : (
                          <IoMdClose className="text-red-600" />
                        )}
                      </TableCell>
                    ) : (
                      <RegularTableCell index={index} cell={cell} row={row} />
                    )
                  )}
                  <TableCell className="w-12">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full p-2   ">
                        <BsThreeDots />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Download Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

type reportProps = {
  data: [];
};
export const ReportsTable: React.FC<reportProps> = ({ data }) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <ReportsDataTable
        hasAssignment={false}
        isDraft={false}
        data={data}
        columns={reportsColumnDef}
      />
    </div>
  );
};

type cpo = {
  name: string;
  id: string;
  email: string;
};

export const cpoTableColumnDef: ExtendedColumnDef<cpo>[] = [
 
  {
    accesorKey: "id",
    header: "ID",
  },
  {
    accesorKey: "email",
    header: "Email",
  },
  {
    accesorKey: "firstName",
    header: "First Name",
  },
  {
    accesorKey:"lastName",
    header:"Last Name"
  }
];

export function CpoViewTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const navTo = useNavigate();
  const [searchParams,setSearchParams]=useSearchParams()
  const group = searchParams.get("group")
  console.log(data)
  return (
    <div className="rounded-md border bg-white shadow-md  relative ">
      <Table>
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center ">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              <TableHead className=""></TableHead>
            </TableRow>
          ))}
        </TableHeader>

        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row: Row<TData>) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row
                .getVisibleCells()
                .map((cell: Cell<TData, unknown>, index: number) => (
                  <RegularTableCellCPO cell={cell} group={group||""} navto={navTo} row={row} />
                ))}

              <TableCell>
                <span className="w-20 ">
                  <BsThreeDots />
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
}
export const cpoViewPlaceholderData: cpo[] = [
  {
    name: "Adamu Musa",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Mahmud Malami",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Amir Amosu",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Bashir Salubi",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Chike Johnson",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Chijoke Adewale",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Charles Davies",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Semako Samuel",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Adebola Adewale",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
  {
    name: "Southy Soul",
    id: "#7894392",
    email: "example@ncaacpd.com",
  },
];

const RegularTableCellCPO = ({
  cell,
  row,
  navto,
  group
}: {
  cell: any;
  row: any;
  navto: (id: string) => void;
  group:string
}) => { 
  return cell.column.columnDef.accesorKey.toLowerCase().includes("email")  ? (
    <TableCell
      key={cell.id}
      onClick={() => {
        if (cell.column.columnDef.accesorKey.toLowerCase().includes("email") ) {
          navto(`/CPD/Tickets/CPO/${row.original["id"]}?group=${group}`);
        }
      }}
      className={`${
        cell.column.columnDef.accesorKey.toLowerCase().includes("email")  &&
        "text-center whitespace-nowrap hover:text-blue-300 hover:cursor-pointer"
      } text-center`}
    >
      {flexRender(
        cell.column.columnDef.accesorKey === "id"
          ? row.original[cell.column.columnDef.accesorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accesorKey],
        cell.getContext()
      )}
    </TableCell>
  ) : (
    <TableCell
      key={cell.id}
      className={`${
        cell.column.columnDef.accesorKey === "name"
          ? "text-start"
          : "text-center"
      } whitespace-nowrap`}
    >
      {flexRender(
        cell.column.columnDef.accesorKey === "id"
          ? row.original[cell.column.columnDef.accesorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accesorKey],
        cell.getContext()
      )}
    </TableCell>
  );
};
