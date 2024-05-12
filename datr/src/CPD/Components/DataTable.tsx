import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { CiClock1, CiWarning } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { MdAssignmentInd } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

import {
  Cell,
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Filters,
  getFilteredRowModel,
  ColumnFilter
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
  Report,
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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectArrow } from "@radix-ui/react-select";
import { format } from "date-fns";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/api/useAuth";
import { toast } from "@/components/ui/use-toast";
import { Archive, ArrowDownToLine, Check, CheckCheck, Pencil, Trash, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import SelectionContext from "../context/SelectionContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
type ExtendedColumnDef<TData extends unknown, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  accesorKey?: string; // Add your custom property
};

const columnDefinition: ExtendedColumnDef<recieptData>[] = [
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

export const RecentTicketsTable = ({ data }: { data: recieptData[] }) => {
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

export const GeneralTicketsTable = ({
  generalTicketData,
}: {
  generalTicketData: GeneralTicket[];
}) => {
  return (
    <div className=" overflow-y-auto bg-white  shadow-md max-h-[60vh]">
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
  currentPage?: number;
}

import { toast as sonnerToast } from "sonner";
import { createWordReport } from "@/lib/utils";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { removeTags } from "@/lib/utils";
import { AiOutlineClose } from "react-icons/ai";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export function TicketsDataTable<TData, TValue>({
  columns,
  data,
  hasAssignment = false,
  hasNav = false,
  currentPage,
}: TicketTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const nav = useNavigate();
  const { axios } = useAxiosClient();
  const { user } = useAuth();
  const [selectedCell, setSelectedCell] = useState(-1);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchedCpo, setSearchedCpo] = useState("");
  const [cellTransform, setCellTransform] = useState({ right: 0, top: 0 });
  const dropdownRef = useRef<HTMLDivElement | undefined>();
  const [isDownloading, setIsDownloading] = useState({
    pdf: false,
    doc: false,
  });
  const client = useQueryClient();

  const cposQuery = useQuery({
    queryKey: ["cpos"],
    queryFn: () =>
      axios("cpo/all", {
        method: "GET",
      }).then((resp: any) => {
        console.log(resp.data);
        return resp.data;
      }),
    staleTime: Infinity,
  });
  const deleteMutation = useMutation({
    mutationKey: ["ticket", "delete"],
    mutationFn: (id: string) =>
      new Promise((resolve, reject) =>
        axios(`tickets/remove/${id}`, {
          method: "DELETE",
        })
          .then((resp: any) => resolve(resp.data))
          .catch((err: any) => reject(err))
      ),
  });

  const tryDelete = (id: string) => {
    console.log(id);
    sonnerToast.promise(
      new Promise((resolve, reject) =>
        deleteMutation.mutate(id, {
          onSuccess: (res) => {
            resolve(res);
            client.invalidateQueries({
              queryKey: ["tickets"],
              exact: false,
            });
          },
          onError: (err) => {
            console.log(err);
            reject(err);
          },
        })
      ),
      {
        loading: "Trying to delete ticket...",
        success: "Ticket Deleted Succesfully.",
        error: "Error deleting ticket.",
      }
    );
  };
  const tryAssignTicket = (id: number, cpo: string) => {
    if (!cpo) return;
    setIsAssigning(true);
    axios("tickets/assign", {
      method: "PUT",
      data: {
        supervisorEmail: user.email,
        cpoEmail: cpo,
        ticketId: id,
      },
    })
      .then((resp: any) => {
        setIsAssigning(false);
        toast({
          title: "Success!",
          description: `Ticket successfully assigned to ${cpo}`,
        });
        client.invalidateQueries({ queryKey: ["tickets", "unassigned"] });
      })
      .catch((err: Error) => {
        setIsAssigning(false);
        toast({
          title: "Error!",
          description:
            err.message === "Request failed with status code 400"
              ? "You need to be a terminal supervisor to assign a ticket!"
              : err.message,
          variant: "destructive",
        });
      });
  };
  const requestWordDocument = async (id: string) => {
    const ticketDataPromise = new Promise((resolve) =>
      resolve(getTicketData(id))
    );
    const commentsPromise = new Promise((resolve) =>
      resolve(getTicketComments(id))
    );
    let comments: any;
    let ticketData: any;
    let hasPulled = false;
    setIsDownloading((state) => ({ ...state, doc: true }));
    sonnerToast.promise(
      Promise.all([ticketDataPromise, commentsPromise])
        .then((values) => {
          ticketData = values[0];
          comments = values[1];
          console.log(values);
          hasPulled = true;

          const report = createWordReport(values[0], values[1]);
          Packer.toBlob(report).then((blob) => {
            console.log("report complete");
            saveAs(
              blob,
              `${ticketData.complainantName}-${ticketData.id}-${format(
                new Date(ticketData.dateTimeCreated),
                "dd/mmmm/yyyy"
              )}`
            );
          });
          console.log("downloaded report");
          setIsDownloading((state) => ({ ...state, doc: false }));
        })
        .catch((err) => {
          hasPulled = true;
          setIsDownloading((state) => ({ ...state, doc: false }));

          return err;
        }),
      {
        loading: "Trying to Create your document...",
        success: "Document Created Successfully!",
        error: "Error Creating document...",
      }
    );
  };

  const requestPdfDocument = async (id: string) => {
    const ticketDataPromise = new Promise((resolve) =>
      resolve(getTicketData(id))
    );
    const commentsPromise = new Promise((resolve) =>
      resolve(getTicketComments(id))
    );

    let ticketData: any;
    setIsDownloading((state) => ({ ...state, pdf: true }));
    sonnerToast.promise(
      Promise.all([ticketDataPromise, commentsPromise])
        .then((values) => {
          ticketData = values[0];
          const comments: any = values[1];
          let _ticketContent = "";
          const _ticketContentInfo = [
            { key: "id", title: "Ticket ID" },
            { key: "assignerName", title: "Assignee" },
            { key: "complainantType", title: "Complaint Type" },
            { key: "slaName", title: "SLA Type" },
            { key: "airline", title: "Airline" },
            { key: "route", title: "Route" },
            { key: "dateOfIncident", title: "Date Of Incident" },
            {
              key: "dateTimeCreated",
              title: "Ticket Creation Date",
              text: (value: any) =>
                `${format(new Date(value), "dd / MM / yyyy")}`,
            },
            { key: "redress", title: "Redress Sought" },
          ];
          _ticketContentInfo.map(
            (ticketContent) =>
              (_ticketContent += `
    <div class="w-44 flex flex-row items-center h-4 ">
    <div class="w-1/3  flex flex-row bg-neutral-200 items-center justify-start h-full">
        <p class="text-[0.2rem] mb-1 ml-1">${ticketContent.title}</p>
    </div>
    <div class="w-2/3 bg-[#FAFAFA] flex flex-row items-center justify-start h-full">
        <p class="text-[0.2rem]  mb-1 ml-1">${
          ticketContent.text
            ? ticketContent.text(ticketData[ticketContent.key])
            : ticketData[ticketContent.key] || "None"
        }</p>
    </div>
    </div>
    
    `)
          );
          let _messages = "";
          comments.map(
            (comment: any, index: number) =>
              (_messages += `
  <div class="w-48 flex flex-col  ${index !== 0 && ""} justify-center">
  <div class="flex flex-col w-40 ${index === 0 && ""}  my-1 outline'>
    <div class="w-full h-3 p-2 flex-1 bg-neutral-300">
      <p class="text-[0.23rem] px-[0.1rem] font-semibold  h-3 bg-neutral-200 whitespace-nowrap">
        ${
          comment.commentType === "COMMENT"
            ? "Comment sent by:"
            : "Message sent by :"
        }${"  "}<span class="font-bold">${comment.authorName}</span>
      </p>
    </div>
    <div class="w-40 px-[0.2rem]   flex-1">
  <p class="text-[0.2rem] mb-1 font-semibold"> ${removeTags(
    comment.content
  )}</p>

    </div>
    <div>

    </div>    
    
    `)
          );

          const doc = new jsPDF();
          doc.html(
            `<div class="flex flex-col p-2 w-48">
      <div class="flex flex-col h-7  justify-center  items-center  bg-neutral-100 w-full space-x-2 ">
        <p class="text-[0.3rem] tracking-widest ">${
          ticketData.complainantName
        }'s ${" "} ${ticketData.complainantType} ${" "} Ticket </>
        <p class="text-[0.18rem] text-center tracking-widest mt-1 font-thin flex flex-row flex-wrap justify-center items-center "><span>Contact Mail: ${
          ticketData.complainantEmail
        }</span> ${" "} <span>Complainant Phone Number: ${
              ticketData.complainantPhoneNo
            }</span> ${" "}  </>
      </div>
    <p class="my-2 tracking-wider underline-2 text-[0.26rem] font-semibold text-darkBlue">
    Ticket Information:
    </p>
<div class="">
${_ticketContent}
</div>
<p class="my-2 tracking-wider underline-2 text-[0.26rem] font-semibold text-darkBlue w-40 ">
Ticket Messages / Comments:
</p>

${_messages}

    </div>`,
            {
              callback: (_doc) => {
                _doc.save(
                  `${ticketData.complainantName}-${ticketData.id}-${format(
                    new Date(ticketData.dateTimeCreated),
                    "dd/mmmm/yyyy"
                  )}`
                );
                setIsDownloading((state) => ({ ...state, pdf: false }));
              },

              autoPaging: "slice",
              margin: 10,
              width: 170,
            }
          );

          console.log("downloaded report");
        })
        .catch((err) => {
          setIsDownloading((state) => ({ ...state, pdf: false }));

          return err;
        }),
      {
        loading: "Trying to Create your document...",
        success: "Document Created Successfully!",
        error: "Error Creating document...",
      }
    );
  };
  const getTicketData = async (id: string) => {
    const ticketInformation = await axios(`tickets/${id}`, {
      method: "GET",
    }).then((resp: any) => resp.data);
    return ticketInformation;
  };
  const getTicketComments = async (id: string) => {
    const comments = await axios(`comments/ticket-id?value=${id}`).then(
      (resp: any) => resp.data
    );
    return comments;
  };
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
            <TableRow
              key={headerGroup.id}
              className="dark:hover:bg-neutral-100 hover:bg-neutral-100"
            >
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
              {user.roles.includes("ADMIN") &&
                hasAssignment &&
                data.length > 0 && (
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
                  className="dark:hover:bg-neutral-50 hover:bg-neutral-100"
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
                      cell.column.columnDef.accesorKey === "ticketStatus" ? (
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
                  {user.roles.includes("ADMIN") &&
                    hasAssignment &&
                    data.length > 0 && (
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
                          {cposQuery.isSuccess && (
                            <PopoverContent
                              side="left"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-1 w-[14rem] md:w-[20rem] z-[5] "
                            >
                              <Command className="p-0 m-0 min-h-52 md:min-h-60">
                                <p className="text-[1.3rem] text-blue-300 mb-2">
                                  Assign Ticket
                                </p>
                                <div className="px-1">
                                  <Select
                                    onValueChange={(value) => {
                                      tryAssignTicket(row.original.id, value);
                                    }}
                                    defaultValue=""
                                    onOpenChange={(open) => {
                                      if (!open) setSearchedCpo("");
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a CPO" />
                                    </SelectTrigger>
                                    <SelectContent className="p-1">
                                      <Input
                                        className="my-3 w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                                        onChange={(e) =>
                                          setSearchedCpo(e.target.value)
                                        }
                                      />
                                      <SelectGroup>
                                        {cposQuery.data
                                          .filter((_cpo: any) =>
                                            _cpo.ncaaUserEmail.startsWith(
                                              searchedCpo
                                            )
                                          )
                                          .map((_cpo: any) => {
                                            return (
                                              <SelectItem
                                                value={_cpo.ncaaUserEmail}
                                              >
                                                {_cpo.ncaaUserEmail}
                                              </SelectItem>
                                            );
                                          })}
                                        {cposQuery.data.filter((_cpo: any) =>
                                          _cpo.ncaaUserEmail.startsWith(
                                            searchedCpo
                                          )
                                        ).length === 0 && (
                                          <p className="text-neutral-400 text-[0.8275rem] text-center m-auto">
                                            User Doesn't exist
                                          </p>
                                        )}
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
                                        <SelectItem value="none">
                                          None
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </Command>
                            </PopoverContent>
                          )}
                        </Popover>
                      </TableCell>
                    )}

                  <TableCell>
                    <Popover>
                      <PopoverTrigger
                        className="hover:bg-neutral-100/40 rounded-md p-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BsThreeDots />
                      </PopoverTrigger>
                      <PopoverContent className="p-1 w-48">
                        {user.roles.includes("ADMIN") && (
                          <AlertDialog>
                            <AlertDialogTrigger
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <div
                                role="button"
                                className="hover:bg-neutral-50 transition rounded-lg py-2 px-3 flex items-center  space-x-2 text-sm"
                              >
                                <Trash className="w-5 h-5 shrink" />
                                <p>Delete Ticket</p>
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your account and remove
                                  your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    tryDelete(row.original["id"]);
                                  }}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        <Popover>
                          <PopoverTrigger
                            className="hover:bg-neutral-50 transition rounded-lg py-2 px-3 flex items-center  space-x-2 text-sm mt-1 w-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowDownToLine className="w-5 h-5 shrink  mr-1" />
                            Download Report
                          </PopoverTrigger>
                          <PopoverContent
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-0 w-40"
                            side="left"
                          >
                            <div
                              aria-disabled={isDownloading.pdf}
                              onClick={(e) => {
                                e.stopPropagation();
                                requestPdfDocument(row.original["id"]);
                              }}
                              role="button"
                              className="hover:bg-neutral-50 transition rounded-lg py-2 px-3 flex items-center  space-x-2 text-sm mt-1 w-full"
                            >
                              <p>Download as PDF</p>
                            </div>
                            <div
                              aria-disabled={isDownloading.doc}
                              onClick={(e) => {
                                e.stopPropagation();
                                requestWordDocument(row.original["id"]);
                              }}
                              role="button"
                              className="hover:bg-neutral-50 transition rounded-lg py-2 px-3 flex items-center  space-x-2 text-sm mt-1 w-full"
                            >
                              <p>Download as Word</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </PopoverContent>
                    </Popover>
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
                            row.original[cell.column.columnDef.accesorKey]
                              .toString()
                              .replaceAll(" ", "_")
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
export const OpenTicketsTable = ({ data }: { data: openTicket[] }) => {
  return (
    <div>
      <TicketsDataTable
        data={data}
        columns={openTicketColumnDefinition}
        isDraft={false}
        hasAssignment={false}
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
          ? cell.column.columnDef.accesorKey === "dateTimeCreated"
            ? format(
                new Date(row.original[cell.column.columnDef.accesorKey]),
                "dd/MM/yyyy"
              )
            : row.original[cell.column.columnDef.accesorKey]
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
      OPENED: "bg-[#FF585821] border-2 border-[#FF5858]",
      ESCALATED: "bg-[#D016DD21] border-2 border-[#D116DD]",
      UNASSIGNED: "",
      NEW: "bg-blue-200 border-2 border-blue-400",
      CLOSED: "bg-neutral-200 border-2 border-neutral-400",
    };

    return `${btnStyles[status]} inline h-max p-1`;
  };

  if (row.original["slaMode"] === "EXPIRED") {
    return (
      <TableCell
        key={cell.id}
        className="grid place-items-center grid-rows-1 grid-cols-1 relative"
      >
        <div className=" " />

        <span
          className={`${resolveStatus(
            row.original[cell.column.columnDef.accesorKey]
          )} rounded-lg my-auto relative z-[2]  ${
            row.original["slaMode"] === "EXPIRED" && "expiredSla"
          }`}
        >
          {flexRender(
            row.original[cell.column.columnDef.accesorKey],
            cell.getContext()
          )}
        </span>
      </TableCell>
    );
  }

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

export const ResolvedTicketsTable = ({ data }: { data: ResolvedTicket[] }) => {
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
export const UnresolvedTicketsTable = ({
  data,
}: {
  data: ResolvedTicket[];
}) => {
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
export const UnassignedTicketsTable = ({
  data,
}: {
  data: unassignedTicket[];
}) => {
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
export const EscalatedTicketsTable = ({ data }: { data: ResolvedTicket[] }) => {
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
                    cell.column.columnDef.accesorKey
                      .toLowerCase()
                      .includes("status") ? (
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
    id: "Select",
    header: ({ table }) => {
      const { selectedSlas, setSelectedSlas } = useContext(SelectionContext);
      const toggeleChecked = (value: boolean) => {
        if (value) {
          let selected = table
            .getCoreRowModel()
            .rows.map((row) => row.original["slaName"]);
          console.log(selected);
          setSelectedSlas([...selected]);
        } else {
          setSelectedSlas([]);
        }
        table.toggleAllPageRowsSelected(!!value);
      };
      return (
        <Checkbox
          className="border-neutral-400  bg-white dark:border-neutral-400 border-2"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={toggeleChecked}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      const { selectedSlas, setSelectedSlas } = useContext(SelectionContext);
      const toggleSlaSelection = (value: boolean) => {
        console.log(value);
        let _temp = [...selectedSlas];
        const id = row.original["slaName"];

        if (value) {
          _temp.push(id);
          setSelectedSlas([..._temp]);
        } else {
          setSelectedSlas((state) => state.filter((item) => item != id));
        }
        row.toggleSelected(!!value);
        console.log(selectedSlas);
      };
      return (
        <div className="w-full flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={toggleSlaSelection}
            aria-label="Select row"
            className="border-neutral-400  bg-white dark:border-neutral-400 border-2"
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accesorKey: "slaName",
    header: "SLA Name",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <p>{row.original["slaName"]}</p>
        </div>
      );
    },
  },
  {
    accesorKey: "resolutionHour",
    header: "Resolution Time",
    cell: ({ row }) => {
      const resolutionTime = `${row.original["resolutionHour"]} hour(s) ${row.original["resolutionMinute"]} minute(s) `;
      return (
        <div className="text-center">
          <p>{resolutionTime}</p>
        </div>
      );
    },
  },
  {
    accesorKey: "responseTime",
    header: "Response Time",
    cell: ({ row }) => {
      const resolutionTime = `${row.original["responseHour"]} hour(s) ${row.original["responseMinute"]} minute(s) `;
      return (
        <div className="text-center">
          <p>{resolutionTime}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "resolutionTime",
    header: "",
    cell: ({ row }) => {
      const nav = useNavigate();
      return (
        <div
          className="grid place-items-center group-hover:text-black"
          role="button"
          onClick={() => {
            nav(
              `/CPD/Configuration/Sla/edit/?slaName=${row.original[
                "slaName"
              ].replace(" ", "_")}`
            );
          }}
        >
          <Pencil
            size={14}
            className="hover:scale-115 transition text-neutral-500 hover:text-blue-300 hover:font-semibold"
          />
        </div>
      );
    },
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
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="data-[state=selected]:bg-neutral-200 dark:data-[state=selected]:bg-neutral-200"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    <div className=" border bg-white shadow-md relative">
      <Table>
        <TableHeader className="">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow className="sticky top-0" key={headerGroup.id}>
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
              {hasEdit && (
                <TableHead className="w-20 bg-neutral-100"></TableHead>
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

export const GeneralSlaDataTable = ({ data }: { data: SlaGeneral[] }) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <SlADataTable
        isDraft={false}
        hasAssignment={false}
        columns={slaGeneralColumnDef}
        data={data}
        navUrl="/CPD/Configuration/Sla/Edit/"
        navRegion="slaName"
        hasEdit={true}
      />
    </div>
  );
};

const generalGroupColumnDef: ExtendedColumnDef<GeneralGroup>[] = [
  {
    accesorKey: "name",
    header: "Group Name",
    cell: ({ row }) => {
      const groupMap = {
        USER: "All",
        ADMIN: "Admin",
        CPO: "Consumer Protection Officer",
        TERMINAL_SUPERVISOR: "Terminal Supervisor",
        SHIFT_SUPERVISOR: "Shift Supervisor",
        DATA_STATISTIC: "Data Statistic",
        DGO: "Director General ",
        CPD_D: "CPD Director",
        CPD_GM: "CPD General Manager",
        AIRLINE: "Airline",
        FOU:"Flight Operation Unit"
      };
      const nav = useNavigate();
      return (
        <div
          className="w-full flex items-center justify-center hover:text-blue-300 transition"
          role="button"
          onClick={() => {
            nav(`/CPD/user_groups/?group=${row.original["name"]}`);
          }}
        >
          <p>{groupMap[row.original["name"] as keyof typeof groupMap]}</p>
        </div>
      );
    },
  },
  {
    accesorKey: "groupDescription",
    header: "Group Description",
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <p>Short group Description</p>
      </div>
    ),
  },
  {
    accesorKey: "count",
    header: "Members",
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <p>{row.original["count"]}</p>
      </div>
    ),
  },
];

export const GeneralGroupTable = ({ data }: { data: GeneralGroup[] }) => {
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
    cell: ({ row }) => {
      return (
        <div>
          <p>{row.original["id"]}</p>
        </div>
      );
    },
  },
  {
    accesorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const nav = useNavigate();
      return (
        <div
          onClick={() => {
            if (row.original.abbreviation) {
              nav(`/DAS/${row.original.name}/Dashboard`);
            }
          }}
          role="button"
          className="hover:text-blue-300"
        >
          <p>{row.original.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end">
          <Popover>
            <PopoverTrigger>
              <BsThreeDots />
            </PopoverTrigger>
            <PopoverContent side="left" className="p-1">
              <ConfirmationDialog onClick={()=>{}}>
                <div
                  role="button"
                  className="flex items-center space-x-2 hover:bg-neutral-100 group p-2"
                >
                  <Trash className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <p className="text-[0.8275rem] group-hover:font-semibold">
                    Delete Terminal
                  </p>
                </div>
              </ConfirmationDialog>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
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
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="hover:bg-neutral-100 dark:hover:bg-neutral-100"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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




type flightDataTableProps = {
  data: DelayedFlight[];
};

const flightsColumnDef:ColumnDef<DelayedFlight>[]=[
  {
    accessorKey:"airline",
    header:"Airline",
    cell:({row})=> {
      const nav=useNavigate();
      const {Location}=useParams();
      return(
        <div role="button" className="group-hover:text-blue-500 group-hover:cursor-pointer" onClick={()=>{nav(`/DAS/${Location}/Report/${row.original.airline.replace(" ","_")}`)}}>
          <p className="">{row.original["airline"]}</p>
        </div>
      )
    },
  },
  {
    accessorKey:"numberOfFlight",
    header:"Number Of Flights"
  },
  {
    accessorKey:"numberOfDelays",
    header:"Number Of Delays"
  },
  {
    accessorKey:"delayLessThanHour",
    header:"Delay < 1 hour"
  },
  {
    accessorKey:"delayInBetweenOneAndTwoHour",
    header:"Delay 1-2 hours"
  },
  {
    accessorKey:"delayGreaterThanTwoHour",
    header:"Delay > 2 hours"
  },
  
]
export const FlightDataTable: React.FC<flightDataTableProps> = ({
  data
}) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
    <GenericDataTable data={data} columns={flightsColumnDef}/>
    </div>
  );
};
export const CancelledFlightsDataTable: React.FC<flightDataTableProps> = ({
  data
}) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
    <GenericDataTable data={data} columns={cancelledFlightColumnDef}/>
    </div>
  );
};

export const cancelledFlightColumnDef: ColumnDef<cancelledFlight>[] = [
  {
    accessorKey: "airline",
    header: "Airline",
  },
  {
    accessorKey: "cancelledFlights",
    header: "Cancelled Flights",
  },
  {
    accessorKey: "numberOfFlights",
    header: "Number of Flights",
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
    accessorKey: "flightNumber",
    header: "Flight Number",
  },
  {
    accessorKey: "route",
    header: "Route",
  },
  {
    accessorKey: "sta",
    header: "STA / STD",
    cell:({row})=> {
     return( <div>
        <p className="text-sm">{row.original["stipulatedTimeArrived"] || row.original.stipulatedTimeDeparted}</p>
      </div>)
    },
  },
  {
    accessorKey: "ata",
    header: "ATA / ATD",
    cell:({row})=> {
      return( <div>
         <p className="text-sm">{row.original.actualTimeArrived || row.original.actualTimeDeparted}</p>
       </div>)
    }
  },
  {
    accessorKey: "delayedDifferenceInHour",
    header: "Delay",
    cell:({row})=> {
      const hours = Math.floor(parseInt(row.original["delayedDifferenceInHour"]!)/3600)
      const remainingSeconds =Math.floor(parseInt(row.original["delayedDifferenceInHour"]!)%3600)
      const minutes = Math.floor(remainingSeconds/60);
      return( <div>
         <p className="text-sm">{row.original["delayedDifferenceInHour"]?`${hours} hours , ${minutes} minutes`:'----'}</p>
       </div>)
    }
  },
  {
    accessorKey: "isDelayed",
    header: "Is Delayed",
    cell:({row})=>{
      return (
        <div className="w-full flex flex-row items-center justify-center">
          {
            row.original["delayed"]?<Check className="w-5 h-5 shrink text-green-600 "/>:<X className="w-5 h-5 shrink text-red-500"/>
          }
        </div>
      )
    }
  },
  {
    accessorKey: "isOnTime",
    header: "Is On Time",
    cell:({row})=>{
      return (
        <div className="w-full flex flex-row items-center justify-center">
          {
            row.original["onTime"]?<Check className="w-5 h-5 shrink text-green-600 "/>:<X className="w-5 h-5 shrink text-red-500"/>
          }
        </div>
      )
    }
  },
  {
    accessorKey: "isCancelled",
    header: "isCancelled",
    cell:({row})=>{
      return (
        <div className="w-full flex flex-row items-center justify-center">
          {
            row.original["cancelled"]?<Check className="w-5 h-5 shrink text-green-600 "/>:<X className="w-5 h-5 shrink text-red-500"/>
          }
        </div>
      )
    }
  },
  {
    accessorKey: "reportType",
    enableColumnFilter:true,
  header:({table})=> {
    const {currentFilters,setCurrentFilters}=useContext(FilterContext)
    return (
      <Select onValueChange={(value)=>{setCurrentFilters((state)=>([...state,{
        id:"reportType",
        value
      }]))}}>
        <SelectTrigger className="dark:bg-transparent bg-transparent border-transparent dark:border-transparent">
          <SelectValue placeholder="Select A Reprot Type."/>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="ARRIVAL">
              Arrival
            </SelectItem>
            <SelectItem value="DEPARTURE">
              Departure
            </SelectItem>
        </SelectContent>
      </Select>
    )
  },
    cell:({row})=>{
      return (
        <div className="w-full flex flex-row items-center justify-center">
          <p className="text-sm">
          {
            row.original["reportType"]==="ARRIVAL"?'Arrival':'Departure'
          }
          </p>
        </div>
      )
    }
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
  data: any[];
};
export const ReportsTable: React.FC<reportProps> = ({ data }) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <GenericDataTable data={data} columns={reportsColumnDef}/>
    </div>
  );
};

type cpo = {
  name: string;
  id: string;
  email: string;
};

type airline={
  id:string,
  email:string,
  firstName:string,
  lastName:string,
  airline:string
}
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
    accesorKey: "lastName",
    header: "Last Name",
  },
];

export const AirlineTableColumnDef:ColumnDef<airline>[]=[
  {
    accesorKey: "id",
    header: "ID",
  },
  {
    accesorKey:"airline",
    header:"Airline"
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
    accesorKey: "lastName",
    header: "Last Name",
  },

]
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
  const [searchParams, setSearchParams] = useSearchParams();
  const group = searchParams.get("group");
  console.log(data);
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
                  <RegularTableCellCPO
                    cell={cell}
                    group={group || ""}
                    navto={navTo}
                    row={row}
                  />
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
  group,
}: {
  cell: any;
  row: any;
  navto: (id: string) => void;
  group: string;
}) => {
  return cell.column.columnDef.accesorKey.toLowerCase().includes("email") ? (
    <TableCell
      key={cell.id}
      onClick={() => {
        if (cell.column.columnDef.accesorKey.toLowerCase().includes("email")) {
          navto(`/CPD/Tickets/CPO/${row.original["id"]}?group=${group}`);
        }
      }}
      className={`${
        cell.column.columnDef.accesorKey.toLowerCase().includes("email") &&
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

type accountRequest = {
  id:string;
  email: string;
  contactNumber: string;
  contactmail: string;
  airlineName: string;
};

const accountRequestTableColumnDef: ColumnDef<accountRequest>[] = [
  {
    accessorKey:"id",
    header:"ID"
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "airlineName",
    header: "Airline Name",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { axios } = useAxiosClient();
      const client = useQueryClient();
      const [handlingRequest, setHandlingRequest] = useState(false);
      const handleReview = (id: string, status: boolean) => {
        sonnerToast.promise(
          new Promise((resolve, reject) => {
            if(handlingRequest)return;
            axios(`airlines/accounts/review/${id}?approved=${status}`,{
              method:"PUT",
            })
              .then((resp: any) => {
                resolve(resp.data);
                setHandlingRequest(false);
                client.invalidateQueries({
                  queryKey: ["airline", "account", "request"],
                });
              })
              .catch((err:any) => {
                setHandlingRequest(false);
                reject(err);
              });
          }),
          {
            loading:status?"Trying to create airline account...":"Deleting request...",
            success:status?"Request accepted successfully!":"Request deleted successfully!",
            error:(error)=> {
              return (
                <div className="flex flex-col space-y-2 text-black">
                  <div className="flex items-center">
                    <CiWarning className="w-5 h-5 shrink"/> <p className="font-semibold text-[0.8275rem]">Error</p>
                  </div>
                  <p>{error.response.data.message}</p>
                </div>
              )
            },
          }
        );
      };
      return (
        <div>
          <Popover>
            <PopoverTrigger disabled={handlingRequest} className="">
              <BsThreeDots />
            </PopoverTrigger>
            <PopoverContent
              className="bg-white  rounded-md px-0 py-0 w-40 divide-y-2 divide-y-neutral-100"
              side="left"
            >
              <ConfirmationDialog title="Are you sure you want to reject it?" onClick={()=>{handleReview(row.original["id"],false)}}>
                <div
                  role="button"
              
                  className="flex items-center space-x-2 hover:bg-neutral-100 group p-2"
                >
                  <Trash className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <p className="text-[0.8275rem] group-hover:font-semibold">
                    Reject Request
                  </p>
                </div>
              </ConfirmationDialog>
              <ConfirmationDialog title="Are you sure you want to accept it?" onClick={()=>{handleReview(row.original["id"],true)}}>
                <div
                  role="button"
                  
                  className="flex items-center space-x-2 hover:bg-neutral-100 group p-2"
                >
                  <CheckCheck className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <p className="text-[0.8275rem] group-hover:font-semibold">
                    Accept Request
                  </p>
                </div>
              </ConfirmationDialog>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];

export const AccountRequestsTable = ({ data }: { data: accountRequest[] }) => {
  const table = useReactTable({
    data,
    columns: accountRequestTableColumnDef,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="rounded-md border bg-white shadow-md  relative ">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="hover:bg-neutral-100 dark:hover:bg-neutral-100"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={accountRequestTableColumnDef.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export const ConfirmationDialog = ({
  children,
  onClick,
  title
}: {
  children: React.ReactElement;
  onClick:()=>void;
  title?:string
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title||"Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>onClick()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
 type filterContextProviderType={
  currentFilters:ColumnFilter[],
  setCurrentFilters:React.Dispatch<React.SetStateAction<ColumnFilter[]>>
 }
 const FilterContext=createContext<filterContextProviderType>({
  currentFilters:[],
  setCurrentFilters:()=>{}
})
export function GenericDataTable<TData, TValue>({columns,data,hasAssignment=false,isDraft=false}:DataTableProps<TData, TValue>){
  
  const [currentFilters,setCurrentFilters]=useState<ColumnFilter[]>([])
  const table=useReactTable(
    {
      data,
      columns,
      getCoreRowModel:getCoreRowModel(),
      getFilteredRowModel:getFilteredRowModel(),
      state:{
        columnFilters:currentFilters
      }
    },
    
  )
  
 return(
  <FilterContext.Provider value={{currentFilters,setCurrentFilters}}>
  <Table>
  <TableHeader>
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => {
          return (
            <TableHead className="text-center" key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          )
        })}
      </TableRow>
    ))}
  </TableHeader>
  <TableBody>
    {table.getRowModel().rows?.length ? (
      table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell className="text-center" key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell
          colSpan={columns.length}
          className="h-24 text-center"
        >
          No results.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
</FilterContext.Provider>
 )
}

type airlineReportsTableEntry ={
  airline:string,
  numberOfComplaints:string,
  numberOfResolvedComplaints:string,
  resolutionRating:string,
}

const airlineReportsTableColumnDef:ColumnDef<airlineReportsTableEntry>[]=[
  {
    accessorKey:"airline",
    header:"Airline",
    
  },{
    accessorKey:"numberOfComplaints",
    header:"Number Of Complaints"
  },
  {
    accessorKey:"numberOfResolvedComplaints",
    header:"Number of Resolved Complaints"
  },
  {
    accessorKey:"resolutionRating",
    header:({header})=>{
      return (
        <div>
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm cursor-pointer">Resolution Rating</p>
          </TooltipTrigger>
          <TooltipContent className=" dark:bg-white bg-white text-black w-60 p-1 cursor-pointer">
            <p className="text-[0.75rem] text-neutral-600">
              Dervied from dividing the account's total number of complaints/ the account's number of resolved complaints.
            </p>
          </TooltipContent>
         </Tooltip>
        </TooltipProvider>
        </div>
      )
    }
  }
]

export const AirlineReportsDataTable:React.FC<{
  data:airlineReportsTableEntry[]
}>=({data})=>{
  return(
    <div>
<GenericDataTable hasAssignment={false} isDraft={false}  data={data.sort((a,b)=>parseFloat(b.resolutionRating)-parseFloat(a.resolutionRating))} columns={airlineReportsTableColumnDef}/>
    </div>
  )
}