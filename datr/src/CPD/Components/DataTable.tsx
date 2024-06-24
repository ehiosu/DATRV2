import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CiClock1, CiWarning } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { MdAssignmentInd, MdClose, MdError } from "react-icons/md";
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
  ColumnFilter,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";


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
  airlineConfig,
  cancelledFlight,
  openTicket,
  recieptData,
  route,
  unassignedTicket,
} from "./Types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { endOfDay, format } from "date-fns";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/api/useAuth";
import { toast } from "@/components/ui/use-toast";
import {
  Archive,
  ArrowDownToLine,
  ArrowUpDown,
  Ban,
  Check,
  CheckCheck,
  Download,
  Pencil,
  Trash,
  User,
  X,
} from "lucide-react";
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
  accessorKey?: string; // Add your custom property
};

export const recentTicketcolumnDefinition: ColumnDef<recieptData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "complainantName",
    header: "Complainant",
  },
  {
    accessorKey: "complainantType",
    header: "Complainant Type",
  },
  {
    id:"actions",
    cell:({row})=>{
      return(
        <AuthorizedComponent roles={["ADMIN","SHIFT_HEAD","TERMINAL_HEAD"]}>
          <Popover>
            <PopoverTrigger>
              <BsThreeDots className="w-5 h-5 shrink"/>
            </PopoverTrigger>
            <PopoverContent side="left" className="px-2 py-2 bg-ncBlue dark:bg-ncBlue rounded-lg w-max space-y-1">
              <AlertDialog>
                <AlertDialogTrigger className="p-1 dark:hover:bg-slate-100/20 flex items-center hover:bg-slate-100/20 text-sm text-start w-full h-8 text-white rounded-t-lg">
                <User className="w-4 h-4 shrink mr-2"/>
                  Assign ticket
                </AlertDialogTrigger>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger className="dark:hover:bg-slate-100/20 flex items-center hover:bg-slate-100/20 text-sm text-start w-full h-8 text-white rounded-b-lg p-1">
                <Trash className="w-4 h-4 mr-2 shrink"/>
                Delete Ticket
                </AlertDialogTrigger>
              </AlertDialog>
            </PopoverContent>
          </Popover>
      </AuthorizedComponent>
      )
    }
  }
 
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hasAssignment?: boolean;
  isDraft?: boolean;
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
                      cell.column.columnDef.accessorKey === "id"
                        ? row.original[
                            cell.column.columnDef.accessorKey
                          ].toString() // Convert ID to string
                        : cell.column.columnDef.accessorKey === "Assign"
                        ? cell.column.columnDef.cell({ row })
                        : row.original[cell.column.columnDef.accessorKey],
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
      columns={[]}
      data={data}
      hasAssignment={true}
      isDraft={false}
      hasNav={false}
    />
  );
};

export const generalTicketColumnDefiniton: ColumnDef<GeneralTicket>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "complainantName",
    header: "Complainant",
  },
  {
    accessorKey: "complainantType",
    header: "Complainant Type",
  },
  {
    accessorKey: "group",
    header: "Group",
    cell:({row})=>{
     return(
      <div>
      <p>{row.original.group || "----"}</p>
    </div>
     )
    }
  },
  
  {
    accessorKey: "ticketStatus",
    header: "Status",
    cell:({row})=>{
      const btnStyles: Record<string, string> = {
        PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
        UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
        NEW: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
        ESCALATED: "bg-[#FF585821] border-2 border-[#FF5858]",
        OPENED: "bg-[#D016DD21] border-2 border-[#D116DD]",
        UNASSIGNED: "",
        RESOLVED: "bg-blue-200 border-2 border-blue-400",
        CLOSED: "bg-neutral-200 border-2 border-neutral-400",
      }
      return (
       <div className="flex items-center justify-center">
         <div className={cn("w-max px-3  h-8 flex items-center justify-center text-sm text-center rounded-full",btnStyles[row.original["ticketStatus"] as keyof typeof btnStyles])}>
          <p>{row.original.ticketStatus}</p>
        </div>
       </div>
      )
    }
   
  },
  {
    accessorKey: "dateTimeCreated",
    header: "Date",
    cell:({row})=>{
      return(
        <div>
          <p className="">{format(new Date(row.original["dateTimeCreated"] as string),'dd-MM-yyyy')}</p>
        </div>
      )
    }
  },
  {
    id:"actions",
    cell:({row})=>{
      const nav =useNavigate()
      return(
        <AuthorizedComponent roles={["SHIFT_SUPERVISOR","TERMINAL_SUPERVISOR","ADMIN"]}>
            <Popover>
              <PopoverTrigger>
                <BsThreeDots/>
              </PopoverTrigger>
              <PopoverContent className="bg-ncBlue dark:bg-ncBlue rounded-lg  px-1.5 py-1 w-48">
                <div onClick={()=>{nav(`/CPD/Ticket/${row.original.id}`)}} role="button" className="text-white hover:bg-slate-100/10 text-sm h-8 flex items-center pl-2">View Ticket Details</div>
                <AuthorizedComponent roles={["ADMIN"]}>
                <div role="button" className="text-red-500 hover:bg-slate-100/10 text-sm h-8 flex items-center pl-2">Delete Ticket</div>
                </AuthorizedComponent>

              </PopoverContent>
            </Popover>
        </AuthorizedComponent>
      )
    }
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
import { cn, createWordReport } from "@/lib/utils";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { removeTags } from "@/lib/utils";
import { AiOutlineClose } from "react-icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AuthorizedComponent } from "@/v3/CPD/Components/AuthorizedComponent";
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
              className=" dark:hover:bg-neutral-50 hover:bg-neutral-100 "
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
              {user.roles.includes("TERMINAL_SUPERVISOR") &&
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
                  className="dark:hover:bg-neutral-50 hover:bg-neutral-100 "
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
                      cell.column.columnDef.accessorKey === "ticketStatus" ? (
                        <StatusTableCell cell={cell} row={row} />
                      ) : cell.column.columnDef.accessorKey === "cpo" ? (
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
                  {user.roles.includes("TERMINAL_SUPERVISOR") &&
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

                  <TableCell className="peer-hover:bg-neutral-200">
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
                    cell.column.columnDef.accessorKey === "id" ? (
                      <TableCell
                        key={cell.id}
                        className={`text-center ${
                          cell.column.columnDef.accessorKey === "groupName" &&
                          "font-semibold"
                        } whitespace-nowrap hover:cursor-pointer hover:text-blue-300`}
                        onClick={() => {
                          nav(
                            row.original[cell.column.columnDef.accessorKey]
                              .toString()
                              .replaceAll(" ", "_")
                          );
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.accessorKey === "id"
                            ? row.original[
                                cell.column.columnDef.accessorKey
                              ].toString() // Convert ID to string
                            : row.original[cell.column.columnDef.accessorKey],
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
export const openTicketColumnDefinition: ExtendedColumnDef<openTicket>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },

  {
    accessorKey: "complainantName",
    header: "Complainant",
  },
  {
    accessorKey: "complainantType",
    header: "Complainant Type",
  },
  
  {
    accessorKey: "ticketStatus",
    header: "Status",
    cell:({row})=>{
      const btnStyles: Record<string, string> = {
        PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
        UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
        RESOLVED: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
        OPENED: "bg-[#FF585821] border-2 border-[#FF5858]",
        ESCALATED: "bg-[#D016DD21] border-2 border-[#D116DD]",
        UNASSIGNED: "",
        NEW: "bg-blue-200 border-2 border-blue-400",
        CLOSED: "bg-neutral-200 border-2 border-neutral-400",
      }
      return (
       <div className="flex items-center justify-center">
         <div className={cn("w-max px-3  h-8 flex items-center justify-center text-sm text-center rounded-full",btnStyles[row.original["ticketStatus" as any] as keyof typeof btnStyles])}>
          <p>{row.original.ticketStatus}</p>
        </div>
       </div>
      )
    }
   
  },
  {
    accessorKey: "dateOfIncident",
    header: "Date due",
  },
  {
    id:"actions",
    cell:({row})=>{
      const nav =useNavigate()
      return(
        <AuthorizedComponent roles={["SHIFT_SUPERVISOR","TERMINAL_SUPERVISOR","ADMIN"]}>
            <Popover>
              <PopoverTrigger>
                <BsThreeDots/>
              </PopoverTrigger>
              <PopoverContent className="bg-ncBlue dark:bg-ncBlue rounded-lg  px-1.5 py-1 w-48">
                <div onClick={()=>{nav(`/CPD/Ticket/${row.original.id}`)}} role="button" className="text-white hover:bg-slate-100/10 text-sm h-8 flex items-center pl-2">View Ticket Details</div>
                <AuthorizedComponent roles={["ADMIN"]}>
                <div role="button" className="text-red-500 hover:bg-slate-100/10 text-sm h-8 flex items-center pl-2">Delete Ticket</div>
                </AuthorizedComponent>

              </PopoverContent>
            </Popover>
        </AuthorizedComponent>
      )
    }
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
        cell.column.columnDef.accessorKey === "groupName" && "font-semibold"
      } whitespace-nowrap ${
        cell.column.columnDef.accessorKey == "complainant" ||
        cell.column.columnDef.accessorKey == "slaName"
          ? "sticky left-0 bg-white md:bg-transparent group-hover:bg-slate-400 peer-hover:bg-slate-400"
          : ""
      }`}
    >
      {flexRender(
        cell.column.columnDef.accessorKey === "id"
          ? row.original[cell.column.columnDef.accessorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accessorKey]?.length > 0
          ? cell.column.columnDef.accessorKey === "dateTimeCreated"
            ? format(
                new Date(row.original[cell.column.columnDef.accessorKey]),
                "dd/MM/yyyy"
              )
            : row.original[cell.column.columnDef.accessorKey]
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
  return cell.column.columnDef.accessorKey === "name" ? (
    <TableCell
      key={cell.id}
      onClick={() => navto(row.original["id"])}
      className={`${
        cell.column.columnDef.accessorKey === "name"
          ? "text-start"
          : "text-center"
      } whitespace-nowrap hover:text-blue-300 hover:cursor-pointer`}
    >
      {flexRender(
        cell.column.columnDef.accessorKey === "id"
          ? row.original[cell.column.columnDef.accessorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accessorKey],
        cell.getContext()
      )}
    </TableCell>
  ) : (
    <TableCell
      key={cell.id}
      className={`${
        cell.column.columnDef.accessorKey === "name"
          ? "text-start"
          : "text-center"
      } whitespace-nowrap`}
    >
      {flexRender(
        cell.column.columnDef.accessorKey === "id"
          ? row.original[cell.column.columnDef.accessorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accessorKey],
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
      {row.original[cell.column.columnDef.accessorKey] && (
        <span className="block  w-3 rounded-full  bg-green-400  aspect-square  ">
          {" "}
        </span>
      )}
      {row.original[cell.column.columnDef.accessorKey] ? (
        flexRender(
          row.original[cell.column.columnDef.accessorKey],
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
        row.original[cell.column.columnDef.accessorKey],
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
      NEW: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
      ESCALATED: "bg-[#FF585821] border-2 border-[#FF5858]",
      OPENED: "bg-[#D016DD21] border-2 border-[#D116DD]",
      UNASSIGNED: "",
      RESOLVED: "bg-blue-200 border-2 border-blue-400",
      CLOSED: "bg-neutral-200 border-2 border-neutral-400",
    }

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
            row.original[cell.column.columnDef.accessorKey]
          )} rounded-lg my-auto relative z-[2]  ${
            row.original["slaMode"] === "EXPIRED" && "expiredSla"
          }`}
        >
          {flexRender(
            row.original[cell.column.columnDef.accessorKey],
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
          row.original[cell.column.columnDef.accessorKey]
        )} rounded-lg`}
      >
        {flexRender(
          row.original[cell.column.columnDef.accessorKey],
          cell.getContext()
        )}
      </span>
    </TableCell>
  );
};

export const ResolvedTicketColumnDefinition: ExtendedColumnDef<ResolvedTicket>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },

  {
    accessorKey: "complainantName",
    header: "Complainant",
  },
  {
    accessorKey: "complainantType",
    header: "Complainant Type",
  },
  {
    accessorKey: "creatorName",
    header: "CPO",
  },
  {
    accessorKey: "group",
    header: "Group",
  },

  
  {
    accessorKey: "ticketStatus",
    header: "Status",
    cell:({row})=>{
      const btnStyles: Record<string, string> = {
        PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
        UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
        NEW: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
        ESCALATED: "bg-[#FF585821] border-2 border-[#FF5858]",
        OPENED: "bg-[#D016DD21] border-2 border-[#D116DD]",
        UNASSIGNED: "",
        RESOLVED: "bg-blue-200 border-2 border-blue-400",
        CLOSED: "bg-neutral-200 border-2 border-neutral-400",
      }
      return (
       <div className="flex items-center justify-center">
         <div className={cn("w-max px-3  h-8 flex items-center justify-center text-sm text-center rounded-full",btnStyles[row.original["ticketStatus" as any] as keyof typeof btnStyles])}>
          <p>{row.original.ticketStatus}</p>
        </div>
       </div>
      )
    }
   
  },
  {
    accessorKey: "dateOfIncident",
    header: "Date due",
  },
  {
    id:"actions",
    cell:({row})=>{
      const nav =useNavigate()
      return(
        <AuthorizedComponent roles={["SHIFT_SUPERVISOR","TERMINAL_SUPERVISOR","ADMIN"]}>
            <Popover>
              <PopoverTrigger>
                <BsThreeDots/>
              </PopoverTrigger>
              <PopoverContent className="bg-ncBlue dark:bg-ncBlue rounded-lg  px-1.5 py-1 w-48">
                <div onClick={()=>{nav(`/CPD/Ticket/${row.original.id}`)}} role="button" className="text-white hover:bg-slate-100/10 text-sm h-8 flex items-center pl-2">View Ticket Details</div>
                <AuthorizedComponent roles={["ADMIN"]}>
                <div role="button" className="text-red-500 hover:bg-slate-100/10 text-sm h-8 flex items-center pl-2">Delete Ticket</div>
                </AuthorizedComponent>

              </PopoverContent>
            </Popover>
        </AuthorizedComponent>
      )
    }
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

export const UnresolvedTicketsColumnDefinition: ExtendedColumnDef<ResolvedTicket>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },

  {
    accessorKey: "complainantName",
    header: "Complainant",
  },
  {
    accessorKey: "complainantType",
    header: "Complainant Type",
  },
  {
    accessorKey: "creatorName",
    header: "CPO",
  },
  {
    accessorKey: "group",
    header: "Group",
    cell:({row})=>{
     return(
      <div>
      <p>{row.original.group || "----"}</p>
    </div>
     )
    }
  },
  
  {
    accessorKey: "ticketStatus",
    header: "Status",
    cell:({row})=>{
      const btnStyles: Record<string, string> = {
        PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
        UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
        NEW: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
        ESCALATED: "bg-[#FF585821] border-2 border-[#FF5858]",
        OPENED: "bg-[#D016DD21] border-2 border-[#D116DD]",
        UNASSIGNED: "",
        RESOLVED: "bg-blue-200 border-2 border-blue-400",
        CLOSED: "bg-neutral-200 border-2 border-neutral-400",
      }
      return (
       <div className="flex items-center justify-center">
         <div className={cn("w-max px-3  h-8 flex items-center justify-center text-sm text-center rounded-full",btnStyles[row.original["ticketStatus" as any] as keyof typeof btnStyles])}>
          <p>{row.original.ticketStatus}</p>
        </div>
       </div>
      )
    }
   
  },
  {
    accessorKey: "dateOfIncident",
    header: "Date due",
  },
  {
    id:"actions",
    cell:({row})=>{
      const nav =useNavigate()
      return(
        <AuthorizedComponent roles={["SHIFT_SUPERVISOR","TERMINAL_SUPERVISOR","ADMIN"]}>
            <Popover>
              <PopoverTrigger>
                <BsThreeDots/>
              </PopoverTrigger>
              <PopoverContent className="bg-ncBlue dark:bg-ncBlue rounded-lg  px-1.5 py-1 w-48">
                <div onClick={()=>{nav(`/CPD/Ticket/${row.original.id}`)}} role="button" className="text-white hover:bg-slate-100/10 text-sm h-8 flex items-center pl-2">View Ticket Details</div>
                <AuthorizedComponent roles={["ADMIN"]}>
                <div role="button" className="text-red-500 hover:bg-slate-100/10 text-sm h-8 flex items-center pl-2">Delete Ticket</div>
                </AuthorizedComponent>

              </PopoverContent>
            </Popover>
        </AuthorizedComponent>
      )
    }
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
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "complainantName",
      header: "Complainant",
    },
    {
      accessorKey: "complainantType",
      header: "Complainant Type",
    },
    {
      accessorKey: "creatorName",
      header: "CPO",
    },
    {
      accessorKey: "group",
      header: "Group",
    },
    {
      accessorKey: "assignStatus",
      header: "Status",
    },
    {
      accessorKey: "dateOfIncident",
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
                    cell.column.columnDef.accessorKey
                      .toLowerCase()
                      .includes("status") ? (
                      <StatusTableCell cell={cell} row={row} />
                    ) : cell.column.columnDef.accessorKey === "recipient" ? (
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
    accessorKey: "recipient",
  },
  {
    header: "Complain Type",
    accessorKey: "complaint_type",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "time",
    accessorKey: "time",
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
    accessorKey: "recipient",
  },
  {
    header: "Complain Type",
    accessorKey: "complaint_type",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "time",
    accessorKey: "time",
  },
];

const DraftMessageColumnDefinition: ExtendedColumnDef<Message>[] = [
  {
    header: "To",
    accessorKey: "recipient",
  },
  {
    header: "Complain Type",
    accessorKey: "complaint_type",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "time",
    accessorKey: "time",
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
      accessorKey: "id",
    },
    {
      header: "CPO Name",
      accessorKey: "cpoName",
    },
    {
      header: "Assigned",
      accessorKey: "assigned",
    },
    {
      header: "Active",
      accessorKey: "active",
    },
    {
      header: "Resolved",
      accessorKey: "resolved",
    },
    {
      header: "Escalated",
      accessorKey: "escalated",
    },
    {
      header: "Stress Level",
      accessorKey: "stressLevel",
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
                    cell.column.columnDef.accessorKey === "stressLevel" ? (
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
        cellStyle[row.original[cell.column.columnDef.accessorKey]]
      } font-semibold text-center`}
    >
      {flexRender(
        row.original[cell.column.columnDef.accessorKey],
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
export const slaGeneralColumnDef: ExtendedColumnDef<SlaGeneral>[] = [
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
    accessorKey: "slaName",
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
    accessorKey: "resolutionHour",
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
    accessorKey: "responseTime",
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
        <div>
          <div
          className="grid w-6 h-6 place-items-center group-hover:text-black hover:bg-slate-100/80 transition-all"
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

export const generalGroupColumnDef: ExtendedColumnDef<GeneralGroup>[] = [
  {
    accessorKey: "name",
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
        FOU: "Flight Operation Unit",
      };
      const nav = useNavigate();
      return (
        <div
          className="w-full flex items-center justify-center hover:text-blue-300 transition"
          role="button"
          onClick={() => {
            nav(`/CPD/Configuration/user_groups/?group=${row.original["name"]}`);
          }}
        >
          <p>{groupMap[row.original["name"] as keyof typeof groupMap]}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "groupDescription",
    header: "Group Description",
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <p>Short group Description</p>
      </div>
    ),
  },
  {
    accessorKey: "count",
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

export const generalTerminalColumnDef: ExtendedColumnDef<GeneralTerminal>[] = [
  {
    accessorKey: "id",
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
    accessorKey: "name",
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
    id:"active",
    header:"State",
    cell:({row})=>{
      return(
        <div>
          <p>{row.original["active"]?"Active":"Inactive"}</p>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {axios}=useAxiosClient()
      const client = useQueryClient()
      const toggleActivenessMutation=useMutation({
        mutationKey:["terminal",row.original["id"],"activeness"],
        mutationFn:()=>new Promise((resolve,reject)=>{
          axios(`terminals/${row.original["id"]}`,{
            method:"PUT"
          }).then((resp:any)=>resolve(resp.data)).catch((err:Error)=>reject(err))
        })
      })
      return (
        <div className="flex items-center justify-end">
          <Popover>
            <PopoverTrigger>
              <BsThreeDots />
            </PopoverTrigger>
            <PopoverContent side="left" className="p-1">
              <ConfirmationDialog onClick={() => {}}>
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
              <ConfirmationDialog message="This action will permanently change the state of this terminal." onClick={() => {
                sonnerToast.promise(new Promise((resolve,reject)=>{
                  toggleActivenessMutation.mutate(undefined,{
                    onSuccess:(data, variables, context) =>{
                      resolve(data)
                      client.invalidateQueries({
                        queryKey:["terminals","all"],
                       
                      })
                    },
                    onError:(error, variables, context)=> {
                      reject(error)
                    },
                  })
                }),{
                  loading:"Changing Terminal State...",
                  success:"State Updated Successfully!",
                  error:(error)=> {
                    return (
                      <div className="text-black flex flex-col">
                        <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                          <MdError className="w-4 h-4 shrink " /> Error
                        </p>
                        <p>{error.response.data.message || error.response.data.detail}</p>
                      </div>
                    );
                  }
                })


              }}>
                <div
                  role="button"
                  className="flex items-center space-x-2 hover:bg-neutral-100 group p-2"
                >
                 {
                  row.original["active"]?<Ban className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>: <Check className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 }
                  <p className="text-[0.8275rem] group-hover:font-semibold">
                    {row.original["active"]?"Deactivate Terminal":"Activate Terminal"} 
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
export const airlineColumnDef: ExtendedColumnDef<airlineConfig>[] = [
  {
    accessorKey: "id",
    header: "ID",

  },
  {
    accessorKey: "airlineName",
    header: "Name",
   
  },
  {
    id:"active",
    header:"State",
    cell:({row})=>{
      return(
        <div>
          <p>{row.original.active?"Active":"Inactive"}</p>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {axios}=useAxiosClient()
      const client = useQueryClient()
      const toggleActivenessMutation=useMutation({
        mutationKey:["airlines",row.original["id"],"activeness"],
        mutationFn:()=>new Promise((resolve,reject)=>{
          axios(`airlines/${row.original["id"]}`,{
            method:"PUT"
          }).then((resp:any)=>resolve(resp.data)).catch((err:Error)=>reject(err))
        })
      })
      return (
        <div className="flex items-center justify-end">
          <Popover>
            <PopoverTrigger>
              <BsThreeDots />
            </PopoverTrigger>
            <PopoverContent side="left" className="p-1">
             
              <ConfirmationDialog message="This action will permanently change the state of this Airline." onClick={() => {
                sonnerToast.promise(new Promise((resolve,reject)=>{
                  toggleActivenessMutation.mutate(undefined,{
                    onSuccess:(data, variables, context) =>{
                      resolve(data)
                      client.invalidateQueries({
                        queryKey:["airlines","all","config"],
                       
                      })
                    },
                    onError:(error, variables, context)=> {
                      reject(error)
                    },
                  })
                }),{
                  loading:"Changing Airline State...",
                  success:"State Updated Successfully!",
                  error:(error)=> {
                    return (
                      <div className="text-black flex flex-col">
                        <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                          <MdError className="w-4 h-4 shrink " /> Error
                        </p>
                        <p>{error.response.data.message || error.response.data.detail}</p>
                      </div>
                    );
                  }
                })


              }}>
                <div
                  role="button"
                  className="flex items-center space-x-2 hover:bg-neutral-100 group p-2"
                >
                 {
                  row.original["active"]?<Ban className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>: <Check className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 }
                  <p className="text-[0.8275rem] group-hover:font-semibold">
                    {row.original["active"]?"Deactivate Airline":"Activate Airline"} 
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
export const routesColumnDef: ExtendedColumnDef<route>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "routeName",
    header: "Name",
  },
  {
    id:"active",
    header:"State",
    cell:({row})=>{
      return(
        <div>
          <p>{row.original["active"]?"Active":"Inactive"}</p>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {axios}=useAxiosClient()
      const client = useQueryClient()
      const toggleActivenessMutation=useMutation({
        mutationKey:["routes",row.original["id"],"activeness"],
        mutationFn:()=>new Promise((resolve,reject)=>{
          axios(`routes/${row.original["id"]}`,{
            method:"PUT"
          }).then((resp:any)=>resolve(resp.data)).catch((err:Error)=>reject(err))
        })
      })
      return (
        <div className="flex items-center justify-end">
          <Popover>
            <PopoverTrigger>
              <BsThreeDots />
            </PopoverTrigger>
            <PopoverContent side="left" className="p-1">
              
              <ConfirmationDialog message="This action will permanently change the state of this route." onClick={() => {
                sonnerToast.promise(new Promise((resolve,reject)=>{
                  toggleActivenessMutation.mutate(undefined,{
                    onSuccess:(data, variables, context) =>{
                      resolve(data)
                      client.invalidateQueries({
                        queryKey:["routes","all"],
                       
                      })
                    },
                    onError:(error, variables, context)=> {
                      reject(error)
                    },
                  })
                }),{
                  loading:"Changing Terminal State...",
                  success:"State Updated Successfully!",
                  error:(error)=> {
                    return (
                      <div className="text-black flex flex-col">
                        <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                          <MdError className="w-4 h-4 shrink " /> Error
                        </p>
                        <p>{error.response.data.message || error.response.data.detail}</p>
                      </div>
                    );
                  }
                })


              }}>
                <div
                  role="button"
                  className="flex items-center space-x-2 hover:bg-neutral-100 group p-2"
                >
                 {
                  row.original["active"]?<Ban className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>: <Check className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 }
                  <p className="text-[0.8275rem] group-hover:font-semibold">
                    {row.original["active"]?"Deactivate Route":"Activate Route"} 
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
  navTo?: () => {};
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
  date?: {
    from: Date | null;
  };
};

export const flightsColumnDef: ColumnDef<DelayedFlight>[] = [
  {
    accessorKey: "airline",
    header:({header,column})=>{
      return (
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Airline <ArrowUpDown className="w-4 h-4 shrink ml-2" />
      </Button>
      )
    },
    cell: ({ row }) => {
      const nav = useNavigate();
      const { Location } = useParams();
      return (
        <div
          role="button"
          className="group-hover:text-blue-500 group-hover:cursor-pointer"
          onClick={() => {
            nav(
              `/DAS/Delays/Reports/${row.original.airline.replace(" ", "_")}`
            );
          }}
        >
          <p className="">{row.original["airline"]}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "numberOfFlight",
    header:({header,column})=>{
      return (
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Number Of Flights <ArrowUpDown className="w-4 h-4 shrink ml-2" />
      </Button>
      )
    },
  },
  {
    accessorKey: "numberOfDelays",
    header:({header,column})=>{
      return (
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Number Of Delays <ArrowUpDown className="w-4 h-4 shrink ml-2" />
      </Button>
      )
    },
  },
  {
    accessorKey: "delayLessThanHour",
    header:({header,column})=>{
      return (
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        {"Delays < 1 hour"} <ArrowUpDown className="w-4 h-4 shrink ml-2" />
      </Button>
      )
    },
  },
  {
    accessorKey: "delayInBetweenOneAndTwoHour",
    header:({header,column})=>{
      return (
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Delays 1-2 hours <ArrowUpDown className="w-4 h-4 shrink ml-2" />
      </Button>
      )
    },
  },
  {
    accessorKey: "delayGreaterThanTwoHour",
    header:({header,column})=>{
      return (
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        {"Delays > 2 hours"} <ArrowUpDown className="w-4 h-4 shrink ml-2" />
      </Button>
      )
    },
  },
];
export const FlightDataTable: React.FC<flightDataTableProps> = ({ data }) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <GenericDataTable
        isExcelPresentable={false}
        data={data}
        columns={flightsColumnDef}
      />
    </div>
  );
};
export const CancelledFlightsDataTable: React.FC<flightDataTableProps> = ({
  data,
}) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <GenericDataTable data={data} columns={cancelledFlightColumnDef} />
    </div>
  );
};

export const cancelledFlightColumnDef: ColumnDef<cancelledFlight>[] = [
  {
    accessorKey: "airline",
    header: ({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Airline <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    },
    cell: ({ row }) => {
      const nav = useNavigate();
      return (
        <div
        className="hover:text-blue-400 transition-all"
          role="button"
          onClick={() => {
            nav(
              `/Das/Cancelled/Reports/${row.original.airline.replace(" ", "_")}`
            );
          }}
        >
          <p>{row.original.airline}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "numberOfCancelled",
    header: ({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Cancelled Flights <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    },
  },
  {
    accessorKey: "numberOfFlight",
    header: ({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Total Flights <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    },
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

const statusFilterFn = (row:Row<Report>, id:string, filterValue:string) => {
  console.log(filterValue,row.original)
 if(filterValue==="" as any) return true
 if(filterValue==="Delayed") return row.original["delayed" as keyof Report]
 if(filterValue==="On Time") return row.original["onTime" as keyof Report]
 if(filterValue==="Cancelled") return row.original["cancelled" as keyof Report]
 else{
  return true
 }
};

export const arrivalReportsColumnDef: ColumnDef<Report>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "airline",
    header: "Airline",
  },
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
    header: "STA",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm">
            {row.original["stipulatedTimeArrived"] ||
              row.original.stipulatedTimeDeparted}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "ata",
    header: "ATA",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm">
            {row.original.actualTimeArrived || row.original.actualTimeDeparted}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "delayedDifferenceInHour",
    header: "Delay",
    cell: ({ row }) => {
      const hours = Math.floor(
        parseInt(row.original["delayedDifferenceInHour"]!) / 3600
      );
      const remainingSeconds = Math.floor(
        parseInt(row.original["delayedDifferenceInHour"]!) % 3600
      );
      const minutes = Math.floor(remainingSeconds / 60);
      return (
        <div>
          <p className="text-sm">
            {row.original["delayedDifferenceInHour"]
              ? `${hours} hours , ${minutes} minutes`
              : "----"}
          </p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "isDelayed",
  //   header: "Is Delayed",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="w-full flex flex-row items-center justify-center">
  //         {row.original["delayed"] ? (
  //           <Check className="w-5 h-5 shrink text-green-600 " />
  //         ) : (
  //           <X className="w-5 h-5 shrink text-red-500" />
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "isOnTime",
  //   header: "Is On Time",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="w-full flex flex-row items-center justify-center">
  //         {row.original["onTime"] ? (
  //           <Check className="w-5 h-5 shrink text-green-600 " />
  //         ) : (
  //           <X className="w-5 h-5 shrink text-red-500" />
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "isCancelled",
  //   header: "is Cancelled",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="w-full flex flex-row items-center justify-center">
  //         {row.original["cancelled"] ? (
  //           <Check className="w-5 h-5 shrink text-green-600 " />
  //         ) : (
  //           <X className="w-5 h-5 shrink text-red-500" />
  //         )}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey:"Status",
    id:"status",
    enableColumnFilter:true,
    filterFn:statusFilterFn as any,
    header:({column,table})=>{
      const {setCurrentFilters}=useContext(FilterContext)
      return(
        <Select
          onValueChange={(value) => {
            setCurrentFilters((state) => [
              ...state.filter(filter => filter.id !== 'status'),
              { id: "status", value: value === "ALL" ? "" : value },
            ]);
          }}
        >
        <SelectTrigger className="dark:bg-transparent bg-transparent border-transparent dark:border-transparent ">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="ALL">ALL</SelectItem>
            <SelectItem value="On Time">On Time</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      )
    },
    cell: ({ row }) => {
      let status = "On Time";
      if (row.original.cancelled) {
        status = "Cancelled";
      } else if (row.original.delayed) {
        status = "Delayed";
      }
      return (
        <div className="w-full flex flex-row items-center justify-center">
          <p className="text-sm">{status}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "reportType",
    enableColumnFilter: true,
    header: ({ table,column, }) => {
      const { currentFilters, setCurrentFilters } = useContext(FilterContext);
      return (
        <Select
        onValueChange={(value) => {
          setCurrentFilters((state) => [
            ...state.filter(filter => filter.id !== 'reportType'),
            { id: "reportType", value: value === "ALL" ? "" : value },
          ]);
        }}
        >
          <SelectTrigger className="dark:bg-transparent bg-transparent border-transparent dark:border-transparent w-40">
            <SelectValue placeholder="Reprot Type." />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="ALL">ALL</SelectItem>
            <SelectItem value="ARRIVAL">Arrival</SelectItem>
            <SelectItem value="DEPARTURE">Departure</SelectItem>
          </SelectContent>
        </Select>
      );
    },
    sortingFn:(row:Row<Report>,id:string,value:string)=>{
      if(value==="ALL")return true
      else{
        return row.original["reportType"].includes(value)
      }
    },
    cell: ({ row }) => {
      return (
        <div className="w-full flex flex-row items-center justify-center">
          <p className="text-sm">
            {row.original["reportType"] === "ARRIVAL" ? "Arrival" : "Departure"}
          </p>
        </div>
      );
    },
  },
];
export const departureReportsColumnDef: ColumnDef<Report>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "airline",
    header: "Airline",
  },
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
    header: "STD",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm">
            {row.original["stipulatedTimeArrived"] ||
              row.original.stipulatedTimeDeparted}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "ata",
    header: "ATD",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm">
            {row.original.actualTimeArrived || row.original.actualTimeDeparted}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "delayedDifferenceInHour",
    header: "Delay",
    cell: ({ row }) => {
      const hours = Math.floor(
        parseInt(row.original["delayedDifferenceInHour"]!) / 3600
      );
      const remainingSeconds = Math.floor(
        parseInt(row.original["delayedDifferenceInHour"]!) % 3600
      );
      const minutes = Math.floor(remainingSeconds / 60);
      return (
        <div>
          <p className="text-sm">
            {row.original["delayedDifferenceInHour"]
              ? `${hours} hours , ${minutes} minutes`
              : "----"}
          </p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "isDelayed",
  //   header: "Is Delayed",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="w-full flex flex-row items-center justify-center">
  //         {row.original["delayed"] ? (
  //           <Check className="w-5 h-5 shrink text-green-600 " />
  //         ) : (
  //           <X className="w-5 h-5 shrink text-red-500" />
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "isOnTime",
  //   header: "Is On Time",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="w-full flex flex-row items-center justify-center">
  //         {row.original["onTime"] ? (
  //           <Check className="w-5 h-5 shrink text-green-600 " />
  //         ) : (
  //           <X className="w-5 h-5 shrink text-red-500" />
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "isCancelled",
  //   header: "is Cancelled",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="w-full flex flex-row items-center justify-center">
  //         {row.original["cancelled"] ? (
  //           <Check className="w-5 h-5 shrink text-green-600 " />
  //         ) : (
  //           <X className="w-5 h-5 shrink text-red-500" />
  //         )}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey:"Status",
    id:"status",
    enableColumnFilter:true,
    filterFn:statusFilterFn as any,
    header:({column,table})=>{
      const {setCurrentFilters}=useContext(FilterContext)
      return(
        <Select
          onValueChange={(value) => {
            setCurrentFilters((state) => [
              ...state.filter(filter => filter.id !== 'status'),
              { id: "status", value: value === "ALL" ? "" : value },
            ]);
          }}
        >
        <SelectTrigger className="dark:bg-transparent bg-transparent border-transparent dark:border-transparent ">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="ALL">ALL</SelectItem>
            <SelectItem value="On Time">On Time</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      )
    },
    cell: ({ row }) => {
      let status = "On Time";
      if (row.original.cancelled) {
        status = "Cancelled";
      } else if (row.original.delayed) {
        status = "Delayed";
      }
      return (
        <div className="w-full flex flex-row items-center justify-center">
          <p className="text-sm">{status}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "reportType",
    enableColumnFilter: true,
    header: ({ table,column, }) => {
      const { currentFilters, setCurrentFilters } = useContext(FilterContext);
      return (
        <Select
        onValueChange={(value) => {
          setCurrentFilters((state) => [
            ...state.filter(filter => filter.id !== 'reportType'),
            { id: "reportType", value: value === "ALL" ? "" : value },
          ]);
        }}
        >
          <SelectTrigger className="dark:bg-transparent bg-transparent border-transparent dark:border-transparent w-40">
            <SelectValue placeholder="Reprot Type." />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="ALL">ALL</SelectItem>
            <SelectItem value="ARRIVAL">Arrival</SelectItem>
            <SelectItem value="DEPARTURE">Departure</SelectItem>
          </SelectContent>
        </Select>
      );
    },
    sortingFn:(row:Row<Report>,id:string,value:string)=>{
      if(value==="ALL")return true
      else{
        return row.original["reportType"].includes(value)
      }
    },
    cell: ({ row }) => {
      return (
        <div className="w-full flex flex-row items-center justify-center">
          <p className="text-sm">
            {row.original["reportType"] === "ARRIVAL" ? "Arrival" : "Departure"}
          </p>
        </div>
      );
    },
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
                    cell.column.columnDef.accessorKey === "isOnTime" ||
                    cell.column.columnDef.accessorKey === "isDelayed" ||
                    cell.column.columnDef.accessorKey === "isCancelled" ? (
                      <TableCell
                        key={cell.id}
                        className={`text-center ${
                          cell.column.columnDef.accessorKey === "groupName" &&
                          "font-semibold"
                        } whitespace-nowrap hover:cursor-pointer hover:text-blue-300`}
                      >
                        {row.original[cell.column.columnDef.accessorKey] ? (
                          <CiCircleCheck className="text-green-600" />
                        ) : (
                          <IoMdClose className="text-red-500 " />
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
  reportConfig:any[]
};
export const ReportsTable: React.FC<reportProps> = ({ data,reportConfig }) => {
  return (
    <div className="w-full h-full  overflow-y-auto max-h-[60vh]">
      <GenericDataTable
        isExcelPresentable={false}
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

type airline = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  airline: string;
};
export const cpoTableColumnDef: ExtendedColumnDef<cpo>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell:({row})=>{
      const nav=useNavigate()
      const group = new URLSearchParams(useLocation().search).get("group")
      return(
        <div onClick={()=>{nav(`/CPD/Configuration/User/${row.original["id"]}?group=${group}`)}} role="button" className="hover:text-blue-400 transition-all">
          <p>{row.original.email}</p>
          </div>
      )
    }
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
];

export const AirlineTableColumnDef: ColumnDef<airline>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "airline",
    header: "Airline",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
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
  return cell.column.columnDef.accessorKey.toLowerCase().includes("email") ? (
    <TableCell
      key={cell.id}
      onClick={() => {
        if (cell.column.columnDef.accessorKey.toLowerCase().includes("email")) {
          navto(`/CPD/Tickets/CPO/${row.original["id"]}?group=${group}`);
        }
      }}
      className={`${
        cell.column.columnDef.accessorKey.toLowerCase().includes("email") &&
        "text-center whitespace-nowrap hover:text-blue-300 hover:cursor-pointer"
      } text-center`}
    >
      {flexRender(
        cell.column.columnDef.accessorKey === "id"
          ? row.original[cell.column.columnDef.accessorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accessorKey],
        cell.getContext()
      )}
    </TableCell>
  ) : (
    <TableCell
      key={cell.id}
      className={`${
        cell.column.columnDef.accessorKey === "name"
          ? "text-start"
          : "text-center"
      } whitespace-nowrap`}
    >
      {flexRender(
        cell.column.columnDef.accessorKey === "id"
          ? row.original[cell.column.columnDef.accessorKey].toString() // Convert ID to string
          : row.original[cell.column.columnDef.accessorKey],
        cell.getContext()
      )}
    </TableCell>
  );
};

type accountRequest = {
  id: string;
  email: string;
  contactNumber: string;
  contactmail: string;
  airlineName: string;
};

export const accountRequestTableColumnDef: ColumnDef<accountRequest>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
            if (handlingRequest) return;
            axios(`airlines/accounts/review/${id}?approved=${status}`, {
              method: "PUT",
            })
              .then((resp: any) => {
                resolve(resp.data);
                setHandlingRequest(false);
                client.invalidateQueries({
                  queryKey: ["airline", "account", "request"],
                });
              })
              .catch((err: any) => {
                setHandlingRequest(false);
                reject(err);
              });
          }),
          {
            loading: status
              ? "Trying to create airline account..."
              : "Deleting request...",
            success: status
              ? "Request accepted successfully!"
              : "Request deleted successfully!",
            error: (error) => {
              return (
                <div className="flex flex-col space-y-2 text-black">
                  <div className="flex items-center">
                    <CiWarning className="w-5 h-5 shrink" />{" "}
                    <p className="font-semibold text-[0.8275rem]">Error</p>
                  </div>
                  <p>{error.response.data.message}</p>
                </div>
              );
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
              <ConfirmationDialog
                message="This action cannot be undone.This Account Request will be deleted and the user will have no access to the system."
                title="Are you sure you want to reject it?"
                onClick={() => {
                  handleReview(row.original["id"], false);
                }}
              >
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
              <ConfirmationDialog
                message="This action cannot be undone.This Account will be created and granted access to the system."
                title="Are you sure you want to accept it?"
                onClick={() => {
                  handleReview(row.original["id"], true);
                }}
              >
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
  title,
  message,
}: {
  children: React.ReactElement;
  onClick: () => void;
  title?: string;
  message?: string;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {message ||
              " This action cannot be undone. This will permanently delete your account and remove your data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onClick()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
type filterContextProviderType = {
  currentFilters: ColumnFiltersState;
  setCurrentFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
};
const FilterContext = createContext<filterContextProviderType>({
  currentFilters: [],
  setCurrentFilters: () => {},
});
interface GenericDataTableProps<TData, TValue>
  extends DataTableProps<TData, TValue> {
  isExcelPresentable?: boolean;
  isHeaderSticky?:boolean;
  showColumnFilter?:boolean;
  downloadExcel?:boolean;
  hasFilter?:boolean;
  filterColumn?:string;
  headerClassname?:string;
  rowClassname?:string;
  tableClassname?:string;
  reportConfig?:any[];
  DownloadComponent?:React.FC<{data:any[]}>,
  filterHeader?:string
}

export function GenericDataTable<TData, TValue>({
  columns,
  data,
  hasAssignment = false,
  isDraft = false,
  isExcelPresentable = false,
  isHeaderSticky=false,
  showColumnFilter=false,
  downloadExcel=false,
  hasFilter=false,
  filterColumn="",
  headerClassname="",
  rowClassname="",
  tableClassname="",
  reportConfig=[],
  filterHeader="",
  DownloadComponent
}: GenericDataTableProps<TData, TValue>) {
   const [currentFilters, setCurrentFilters] = useState<ColumnFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility,setColumnVisibility]=useState<VisibilityState>({})
  const [columnFilters,setColumnFilters]=useState<ColumnFiltersState>([])
  const {user}=useAuth()
  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange:setColumnVisibility,
    onColumnFiltersChange:setColumnFilters,
    state: {
      columnFilters: columnFilters,
      sorting,
      columnVisibility:columnVisibility
    },
  });




  return (
    <>
  <div className="flex items-center justify-end gap-x-3 my-2 px-1.5">
    {
      hasFilter && <input type="text" value={table.getColumn(filterColumn)?.getFilterValue() as string} onChange={(e)=>{table.getColumn(filterColumn as string)?.setFilterValue(e.target.value)}} name="" className="w-56 h-10 rounded-lg outline-none border-2 border-neutral-300 text-sm" placeholder={`Filter: ${filterHeader}`} id="" />
    }
   {
    downloadExcel && DownloadComponent? <DownloadComponent data={data}/>:<></>
   }
  {showColumnFilter&& 
   <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className=" dark:bg-ncBlue bg-ncBlue text-white dark:text- ">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible() as boolean}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
         }
   </div>
 
    <FilterContext.Provider value={{ currentFilters:columnFilters, setCurrentFilters:setColumnFilters }}>
      <Table className={cn(tableClassname)}>
        <TableHeader className={cn(isHeaderSticky&&"sticky top-0",headerClassname)}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={cn(isHeaderSticky&&"sticky top-0 r",headerClassname)}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className={cn(
                      "text-center",
                      isExcelPresentable &&
                        "border-2 border-neutral-200 min-w-4 p-1 h-4 text-black dark:text-black whitespace-nowrap",isHeaderSticky && "sticky top-0"
                    )}
                    key={header.id}
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
            table.getRowModel().rows.map((row,index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(isExcelPresentable && "",rowClassname,index%2===1?"bg-[#F4F5FF]":"bg-white")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className={cn(
                      "text-center",
                      isExcelPresentable &&
                        "border-2 border-neutral-200 min-w-4 p-1 h-4  whitespace-nowrap "
                    )}
                    key={cell.id}
                  >
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
    </FilterContext.Provider>
    </>
  );
}

type airlineReportsTableEntry = {
  airline: string;
  numberOfComplaints: string;
  numberOfResolvedComplaints: string;
  resolutionRating: string;
};

const airlineReportsTableColumnDef: ColumnDef<airlineReportsTableEntry>[] = [
  {
    accessorKey: "airline",
    header: "Airline",
  },
  {
    accessorKey: "numberOfComplaints",
    header: "Number Of Complaints",
  },
  {
    accessorKey: "numberOfResolvedComplaints",
    header: "Number of Resolved Complaints",
  },
  {
    accessorKey: "resolutionRating",
    header: ({ header }) => {
      return (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm cursor-pointer">Resolution Rating</p>
              </TooltipTrigger>
              <TooltipContent className=" dark:bg-white bg-white text-black w-60 p-1 cursor-pointer">
                <p className="text-[0.75rem] text-neutral-600">
                  Dervied from dividing the account's total number of
                  complaints/ the account's number of resolved complaints.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];

export const AirlineReportsDataTable: React.FC<{
  data: airlineReportsTableEntry[];
}> = ({ data }) => {
  return (
    <div>
      <GenericDataTable
        hasAssignment={false}
        isDraft={false}
        data={data.sort(
          (a, b) =>
            parseFloat(b.resolutionRating) - parseFloat(a.resolutionRating)
        )}
        columns={airlineReportsTableColumnDef}
      />
    </div>
  );
};

type backlogTicket = {
  airline: string;
  activeTickets: string;
  unresolvedTickets: string;
  total: string;
};
export const ticketBacklogColumnDef: ColumnDef<backlogTicket>[] = [
  {
    accessorKey: "airline",
    header: "Airline",
    cell: ({ row }) => {
      return (
        <div>
          <p className="whitespace-nowrap">{row.original.airline}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "activeTickets",
    header: ({ header, column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Assigned Tickets <ArrowUpDown className="w-4 h-4 shrink ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "unresolvedTickets",
    sortingFn: (rowA, rowB, columnId) => {
      return (
        parseInt(rowA.original.unresolvedTickets) -
        parseInt(rowB.original.unresolvedTickets)
      );
    },
    invertSorting: true,
    header: ({ column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Unassigned Tickets <ArrowUpDown className="w-4 h-4 shrink ml-2" />
        </Button>
      );
    },
  },
  {
    id: "Backlog",
    sortingFn: (rowA, rowB, columnId) => {
      const unresolvedRatioA = parseFloat(
        (
          (parseFloat(rowA.original.unresolvedTickets) /
            parseFloat(rowA.original.activeTickets)) *
          100
        ).toPrecision(2)
      );
      const unresolvedRatioB = parseFloat(
        (
          (parseFloat(rowB.original.unresolvedTickets) /
            parseFloat(rowB.original.activeTickets)) *
          100
        ).toPrecision(2)
      );
      return unresolvedRatioA - unresolvedRatioB;
    },
    header: ({ column }) => {
      return (
        <Button
          className="flex group items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          % Backlog{" "}
          <ArrowUpDown className="w-4 opacity-0 group-hover:opacity-100 transition-all h-4 shrink ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <p>{`${(
          (parseFloat(row.original.unresolvedTickets) /
            parseFloat(row.original.activeTickets)) *
          100
        ).toPrecision(3)}%`}</p>
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: "% Total",
    cell: ({ row }) => (
      <div>
        <p>{`${(
          (parseFloat(row.original.unresolvedTickets) /
            parseFloat(row.original.total)) *
          100
        ).toPrecision(3)}%`}</p>
      </div>
    ),
  },
];

type flightPerformanceColumnEntry = {
  airline: string;
  totalFlights: string;
  delayedFlights:string;
  cancelledFlights:string;
  onTimeFlights: string;
  disruptedFlights: string;
};

export const OnTimeTableColumnDef: ColumnDef<flightPerformanceColumnEntry>[] = [
  {
    accessorKey: "airline",
    header: "Airline",
  },
  {
    accessorKey: "totalFlights",
    header: ({ header, column }) => {
      return (
       <div className="flex justify-center items-center">
         <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 group "
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Total Flights{" "}
          <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
       </div>
      );
    },
    sortingFn:(rowA,rowB,column)=>{
      return parseInt(rowA.original.totalFlights)-parseInt(rowB.original.totalFlights)
    }
  },
  {
    accessorKey: "delayedFlights",
    header: ({ header, column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 group"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Delayed Flights{" "}
          <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
      );
    },
    sortingFn:(rowA,rowB,column)=>{
      return parseInt(rowA.original.delayedFlights)-parseInt(rowB.original.delayedFlights)
    }
  },
  {
    accessorKey: "cancelledFlights",
    header: ({ header, column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 group"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Cancelled Flights{" "}
          <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
      );
    },
    sortingFn:(rowA,rowB,column)=>{
      return parseInt(rowA.original.cancelledFlights)-parseInt(rowB.original.cancelledFlights)
    }
  },
  {
    accessorKey: "onTimeFlights",
    header: ({ header, column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 group"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          On Time Flights{" "}
          <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
      );
    },
    sortingFn:(rowA,rowB,column)=>{
      return parseInt(rowA.original.onTimeFlights)-parseInt(rowB.original.onTimeFlights)
    }
  },
  {
    accessorKey: "disruptedFlights",
    header: ({ header, column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 group"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Disrupted Flights{" "}
          <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
      );
    },
    sortingFn:(rowA,rowB,column)=>{
      return parseInt(rowA.original.disruptedFlights)-parseInt(rowB.original.disruptedFlights)
    }
  },
  {
    id: "onTimePercentage",
    header: ({ header, column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 group"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          % On Time{" "}
          <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const onTimePercentage = (parseFloat(row.original.onTimeFlights) / parseFloat(row.original.totalFlights) * 100).toPrecision(3);
      return (
        <div>
          <p>{`${onTimePercentage}%`}</p>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const onTimePercentageA = parseInt((parseFloat(rowA.original.onTimeFlights) / parseFloat(rowA.original.totalFlights) * 100).toPrecision(2));
      const onTimePercentageB = parseInt((parseFloat(rowB.original.onTimeFlights) / parseFloat(rowB.original.totalFlights) * 100).toPrecision(2));
      console.log(onTimePercentageA-onTimePercentageB)
      return onTimePercentageA - onTimePercentageB;
    }
  },  
  {
    id: "disruptionPercent",
    header: ({ header, column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 group"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          % Disrupted{" "}
          <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const disruptionPercentage = (parseFloat(row.original.disruptedFlights) / parseFloat(row.original.totalFlights) * 100).toPrecision(3);
      return (
        <div>
          <p>{`${disruptionPercentage}%`}</p>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const disruptionPercentageA = parseFloat((parseFloat(rowA.original.disruptedFlights) / parseFloat(rowA.original.totalFlights) * 100).toPrecision(3));
      const disruptionPercentageB = parseFloat((parseFloat(rowB.original.disruptedFlights) / parseFloat(rowB.original.totalFlights) * 100).toPrecision(3));
      
      return disruptionPercentageA - disruptionPercentageB;
    }
  }
];

type disruptionLeaderEntry = {
  airline: string;
  totalFlights: string;
  disruptedFlights: string;
};
type bestPerformingEntry = {
  airline: string;
  activeTickets: string;
  resolvedTickets: string;
};

export const disruptionLeaderColumnDef: ColumnDef<disruptionLeaderEntry>[] = [
  {
    accessorKey: "airline",
    header: "Airline",
  },
  {
    accessorKey: "totalFlights",
    header: "Total Flights",
  },
  {
    accessorKey: "disruptedFlights",
    header: "Disrupted Flights",
  },
  {
    id: "disruptionPercent",
    header: ({ header, column }) => {
      return (
        <Button
          className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent hover:bg-slate-200 dark:hover:bg-slate-200 group"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          % Disrupted{" "}
          <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const disruptionPercentage = (parseFloat(row.original.disruptedFlights) / parseFloat(row.original.totalFlights) * 100).toPrecision(3);
      return (
        <div>
          <p>{`${disruptionPercentage}%`}</p>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const disruptionPercentageA = parseFloat((parseFloat(rowA.original.disruptedFlights) / parseFloat(rowA.original.totalFlights) * 100).toPrecision(3));
      const disruptionPercentageB = parseFloat((parseFloat(rowB.original.disruptedFlights) / parseFloat(rowB.original.totalFlights) * 100).toPrecision(3));
      
      return disruptionPercentageA - disruptionPercentageB;
    }
  }
  ,
];
export const bestPerformingColumnDef: ColumnDef<bestPerformingEntry>[] = [
  {
    accessorKey: "airline",
    header: "Airline",
  },
  {
    accessorKey: "activeTickets",
    header: "Active Tickets",
  },
  {
    accessorKey: "resolvedTickets",
    header: "Resolved Tickets",
  },
  {
    id: "resolved percent",
    header: "% resolved",
    cell: ({ row }) => {
      const unresolvedTickets=parseFloat(row.original.resolvedTickets)
      const activeTickets= parseFloat(row.original.activeTickets)
      const value = (unresolvedTickets/activeTickets).toPrecision(2)*100
      return (
        <div>
          <p>{`${value}%`}</p>
        </div>
      );
    },
  },
];

type fdrEntry = {
  airline: string;
  dateOfIncidence: string;
  route: string;
  scheduledTimeDeparture: string;
  scheduledTimeArrival: string;
  expectedTimeDeparture: string;
  expectedTimeArrival: string;
  complianceList: any[];
  reasonForDelay?: string;
  reasonForCancellation?: string;
  reasonForTarmacDelay?: string;
};
export const fdrColumnDef: ColumnDef<fdrEntry>[] = [
  {
    accessorKey: "airline",
    header: "Airline",
  },
  {
    accessorKey: "dateOfIncidence",
    header: "Date of Incidence",
  },
  {
    accessorKey: "route",
    header: "Route",
  },
  {
    accessorKey: "scheduledTimeArrival",
    header: "Scheduled Time Of Arrival",
  },
  {
    accessorKey: "scheduledTimeDeparture",
    header: "Scheduled Time Of Departure",
  },
  {
    accessorKey: "expectedTimeArrival",
    header: "Expected Time Of Arrival",
  },
  {
    accessorKey: "expectedTimeDeparture",
    header: "Expected Time Of Departure",
  },
  {
    id: "reasonForDelay",
    header: "Reason For Delay",
    cell({ row }) {
      return (
        <div>
          <p>
            {row.original["reasonForDelay" as keyof typeof row.original] ||
              "-----"}
          </p>
        </div>
      );
    },
  },
  {
    id: "reasonForCancellation",
    header: "Reason For Cabcellation",
    cell({ row }) {
      return (
        <div>
          <p>{row.original["reasonForCancellation"] || "-----"}</p>
        </div>
      );
    },
  },
  {
    id: "reasonForTarmacDelay",
    header: "Reason For Tarmac Delay",
    cell({ row }) {
      return (
        <div>
          <p>{row.original["reasonForTarmacDelay"] || "-----"}</p>
        </div>
      );
    },
  },
  {
    id: "information",
    header: "Information Shared",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          {row.original["complianceList"][0].isRequired ? (
            <>
              <p>{`${row.original["complianceList"][0].numberOfPassengers} passengers communicated with`}</p>
            </>
          ) : (
            <MdClose className="text-red-500 " />
          )}
        </div>
      );
    },
  },
  {
    id: "refreshment",
    header: "Refreshments Given",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          {row.original["complianceList"][1].isRequired ? (
            <>
              <p>{`${row.original["complianceList"][1].numberOfPassengers} passengers attended to`}</p>
            </>
          ) : (
            <MdClose className="text-red-500 " />
          )}
        </div>
      );
    },
  },
  {
    id: "refund",
    header: "Refund processed",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          {row.original["complianceList"][2].isRequired ? (
            <>
              <p>{`${row.original["complianceList"][2].numberOfPassengers} passengers refunded`}</p>
            </>
          ) : (
            <MdClose className="text-red-500 " />
          )}
        </div>
      );
    },
  },
  {
    id: "REPROTECTION",
    header: "Reprotection",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          {row.original["complianceList"][3].isRequired ? (
            <>
              <p>{`${row.original["complianceList"][3].numberOfPassengers} passengers attended to`}</p>
            </>
          ) : (
            <MdClose className="text-red-500 " />
          )}
        </div>
      );
    },
  },
  {
    id: "RESCHEDULE",
    header: "Flight Rescheduled",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          {row.original["complianceList"][3].isRequired ? (
            <>
              <p>{`${
                row.original["complianceList"][3]
                  .numberOfPassengers as keyof typeof row.original
              } passengers attended to`}</p>
            </>
          ) : (
            <MdClose className="text-red-500 " />
          )}
        </div>
      );
    },
  },
  {
    id: "compensation",
    header: "Compensation",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          {row.original["complianceList"][3].isRequired ? (
            <>
              <p>{`${row.original["complianceList"][3].numberOfPassengers} passengers compensated`}</p>
            </>
          ) : (
            <MdClose className="text-red-500 " />
          )}
        </div>
      );
    },
  },
];

type delayreport = {
  id: string;
  flightNumber: string;
  Route: string;
  sta: string;
  ata: string;
  delayedDifferenceInHour: string;
  stipulatedTimeArrived?: string;
  stipulatedTimeDeparted?: string;
  actualTimeArrived?: string;
  actualTimeDeparted?: string;
};

export const delayReportColumnDef: ColumnDef<delayreport>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
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
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm">
            {row.original["stipulatedTimeArrived"] ||
              row.original.stipulatedTimeDeparted}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "ata",
    header: "ATA / ATD",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm">
            {row.original.actualTimeArrived || row.original.actualTimeDeparted}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "delayedDifferenceInHour",
    header: "Delay",
    cell: ({ row }) => {
      const hours = Math.floor(
        parseInt(row.original["delayedDifferenceInHour"]!) / 3600
      );
      const remainingSeconds = Math.floor(
        parseInt(row.original["delayedDifferenceInHour"]!) % 3600
      );
      const minutes = Math.floor(remainingSeconds / 60);
      return (
        <div>
          <p className="text-sm">
            {row.original["delayedDifferenceInHour"]
              ? `${hours} hours , ${minutes} minutes`
              : "----"}
          </p>
        </div>
      );
    },
  },
];
const cancelledReportColumnDef: ColumnDef<delayreport>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
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
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm">
            {row.original["stipulatedTimeArrived"] ||
              row.original.stipulatedTimeDeparted}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "ata",
    header: "ATA / ATD",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm">
            {row.original.actualTimeArrived || row.original.actualTimeDeparted}
          </p>
        </div>
      );
    },
  },
];

export const DelayReportsTable = ({ data }: { data: any[] }) => {
  return (
    <div>
      <GenericDataTable
        hasAssignment={false}
        isDraft={false}
        data={data}
        columns={delayReportColumnDef}
      />
    </div>
  );
};
export const CancelledReportsTable = ({ data }: { data: any[] }) => {
  return (
    <div>
      <GenericDataTable
        hasAssignment={false}
        isDraft={false}
        data={data}
        columns={cancelledReportColumnDef}
      />
    </div>
  );
};

type onTimeFlightEntry ={
  airline:string,
  numberOfFlights:string;
  numberOfFlightsOnTime:string
}
export const onTimeFlightsColumnDef:ColumnDef<onTimeFlightEntry>[]=[
  {
    accessorKey: "airline",
    header: ({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Airline <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    },
    cell: ({ row }) => {
      const nav = useNavigate();
      return (
        <div
        className="hover:text-blue-400 transition-all"
          role="button"
          onClick={() => {
            nav(
              `/Das/OnTime/Reports/${row.original.airline.replace(" ", "_")}`
            );
          }}
        >
          <p>{row.original.airline}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "numberOfFlightsOnTime",
    header: ({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        On Time Flights <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    },
  },
  {
    accessorKey: "numberOfFlights",
    header: ({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Total Flights <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    },
  },
]

type ReportEntry={
  id:string,
  terminal:string,
  airline:string,
  acType:string,
  flightNumber:string,
  reportType:string,
  dateOfIncidence:string,

}

interface delayedReportEntry extends ReportEntry{
  delayedDifferenceInHour:string,
  stipulatedTimeArrived:string,
  actualTimeArrived:string,
}

interface onTimeReportEntry extends ReportEntry{
  stipulatedTimeArrived:string,
  actualTimeArrived:string,
}

export const reportEntryColumnDef:ColumnDef<ReportEntry>[]=[{
  accessorKey:"id",
  header:"ID"
},
{
  accessorKey:"terminalName",
  header:"Terminal"
},
{
  accessorKey:"airline",
  header:"Airline"
},
{
  accessorKey:"dateOfIncidence",
  header:"Date"
},
{
  accessorKey:"acType",
  header:"Aircraft Type"
},
{
  accessorKey:"flightNumber",
  header:"Flight Number"
},
{
  accessorKey:"reportType",
  header:"Report Type"
},

]
export const delayedReportColumnDef:ColumnDef<delayedReportEntry>[]=[{
  accessorKey:"id",
  header:"ID"
},
{
  accessorKey:"terminalName",
  header:"Terminal"
},
{
  accessorKey:"airline",
  header:"Airline"
},
{
  accessorKey:"dateOfIncidence",
  header:"Date"
},
{
  accessorKey:"acType",
  header:"Aircraft Type"
},
{
  accessorKey:"flightNumber",
  header:"Flight Number"
},
{
  accessorKey:"delayedDifferenceInHour",
  header:"Delay Amount",
  cell: ({ row }) => {
    const hours = Math.floor(
      parseInt(row.original["delayedDifferenceInHour"]!) / 3600
    );
    const remainingSeconds = Math.floor(
      parseInt(row.original["delayedDifferenceInHour"]!) % 3600
    );
    const minutes = Math.floor(remainingSeconds / 60);
    return (
      <div>
        <p className="text-sm">
          {row.original["delayedDifferenceInHour"]
            ? `${hours} hours , ${minutes} minutes`
            : "----"}
        </p>
      </div>
    );
  },
},
{
  accessorKey:"stipulatedTimeArrived",
  header:"STA"
},
{
  accessorKey:"actualTimeArrived",
  header:"ATA"
},
{
  accessorKey:"reportType",
  header:"Report Type"
},

]
export const delayedReportColumnDefDeparture:ColumnDef<delayedReportEntry>[]=[{
  accessorKey:"id",
  header:"ID"
},
{
  accessorKey:"terminalName",
  header:"Terminal"
},
{
  accessorKey:"airline",
  header:"Airline"
},
{
  accessorKey:"dateOfIncidence",
  header:"Date"
},
{
  accessorKey:"acType",
  header:"Aircraft Type"
},
{
  accessorKey:"flightNumber",
  header:"Flight Number"
},
{
  accessorKey:"delayedDifferenceInHour",
  header:"Delay Amount",
  cell: ({ row }) => {
    const hours = Math.floor(
      parseInt(row.original["delayedDifferenceInHour"]!) / 3600
    );
    const remainingSeconds = Math.floor(
      parseInt(row.original["delayedDifferenceInHour"]!) % 3600
    );
    const minutes = Math.floor(remainingSeconds / 60);
    return (
      <div>
        <p className="text-sm">
          {row.original["delayedDifferenceInHour"]
            ? `${hours} hours , ${minutes} minutes`
            : "----"}
        </p>
      </div>
    );
  },
},
{
  accessorKey:"stipulatedTimeArrived",
  header:"STD"
},
{
  accessorKey:"actualTimeArrived",
  header:"STA"
},
{
  accessorKey:"reportType",
  header:"Report Type"
},

]
export const onTimeReportColumnDef:ColumnDef<onTimeReportEntry>[]=[{
  accessorKey:"id",
  header:"ID"
},
{
  accessorKey:"terminalName",
  header:"Terminal"
},
{
  accessorKey:"airline",
  header:"Airline"
},
{
  accessorKey:"acType",
  header:"Aircraft Type"
},
{
  accessorKey:"flightNumber",
  header:"Flight Number"
},
{
  accessorKey:"delayedDifferenceInHour",
  header:"Delay Amount",
  cell: ({ row }) => {
    const hours = Math.floor(
      parseInt(row.original["delayedDifferenceInHour"]!) / 3600
    );
    const remainingSeconds = Math.floor(
      parseInt(row.original["delayedDifferenceInHour"]!) % 3600
    );
    const minutes = Math.floor(remainingSeconds / 60);
    return (
      <div>
        <p className="text-sm">
          {row.original["delayedDifferenceInHour"]
            ? `${hours} hours , ${minutes} minutes`
            : "----"}
        </p>
      </div>
    );
  },
},
{
  accessorKey:"stipulatedTimeArrived",
  header:"STA"
},
{
  accessorKey:"actualTimeArrived",
  header:"ATA"
},
{
  accessorKey:"reportType",
  header:"Report Type"
},

]
export const onTimeReportColumnDefDeparture:ColumnDef<onTimeReportEntry>[]=[{
  accessorKey:"id",
  header:"ID"
},
{
  accessorKey:"terminalName",
  header:"Terminal"
},
{
  accessorKey:"airline",
  header:"Airline"
},
{
  accessorKey:"acType",
  header:"Aircraft Type"
},
{
  accessorKey:"flightNumber",
  header:"Flight Number"
},
{
  accessorKey:"delayedDifferenceInHour",
  header:"Delay Amount",
  cell: ({ row }) => {
    const hours = Math.floor(
      parseInt(row.original["delayedDifferenceInHour"]!) / 3600
    );
    const remainingSeconds = Math.floor(
      parseInt(row.original["delayedDifferenceInHour"]!) % 3600
    );
    const minutes = Math.floor(remainingSeconds / 60);
    return (
      <div>
        <p className="text-sm">
          {row.original["delayedDifferenceInHour"]
            ? `${hours} hours , ${minutes} minutes`
            : "----"}
        </p>
      </div>
    );
  },
},
{
  accessorKey:"stipulatedTimeArrived",
  header:"STD"
},
{
  accessorKey:"actualTimeArrived",
  header:"ATD"
},
{
  accessorKey:"reportType",
  header:"Report Type"
},

]

type message = {
  from:string,
  complaintType:string,
  status:string,
  date:string
  
}

type sentMessage = {
  to:string,
  complaintType:string,
  status:string,
  date:string

}
export const InboxColumnDef:ColumnDef<message>[]=[
  {
    accessorKey:"from",
    header:({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        From <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    }
  },
  {
    accessorKey:"complaintType",
    header:"Complaint Type"
  },
  {
    accessorKey:"status",
    header:"Status",
    cell:({row})=>{
      const resolveStatus: (status: string) => string = (status = "") => {
        const btnStyles: Record<string, string> = {
          PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
          UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
          NEW: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
          ESCALATED: "bg-[#FF585821] border-2 border-[#FF5858]",
          OPENED: "bg-[#D016DD21] border-2 border-[#D116DD]",
          UNASSIGNED: "",
          RESOLVED: "bg-blue-200 border-2 border-blue-400",
          CLOSED: "bg-neutral-200 border-2 border-neutral-400",
        }
    
        return `${btnStyles[status]} inline h-max p-1`;
      };
      return(
        <div className="flex items-center justify-center">
         <div className={cn("w-max px-4  h-8 flex items-center justify-center text-xs text-center rounded-full ",resolveStatus(row.original.status))}>
          <p>{row.original.status}</p>
        </div>
       </div>
      )
    }
  },
  { header:"Date",
    accessorKey:"date"
  },
  {
    id:"actions",
    cell:({row})=>{
      return(
        <div className="">
          <Popover>
            <PopoverTrigger className="h-6 w-6 p-0 hover:bg-slate-300 rounded-md flex items-center justify-center transition-all">
                <BsThreeDots className="w-4 h-4 shrink"/>
            </PopoverTrigger>
            <PopoverContent className="bg-ncBlue dark:bg-ncBlue text-white p-0 w-36  rounded-md overflow-hidden gap-y-2" side="left">
            <div className="hover:bg-slate-200/25  text-white text-sm p-1.5" role="button">
              <p>View Message</p>
            </div>
            <div className="hover:bg-red-500 hover:text-white transition-all text-red-400 text-sm p-1.5" role="button">
              <p>Delete Message</p>
            </div>
            </PopoverContent>
          </Popover>
        </div>
      )
    }
  }
]
export const OutboxMessageColumnDef:ColumnDef<sentMessage>[]=[
  {
    accessorKey:"to",
    header:({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        To <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    }
  },
  {
    accessorKey:"complaintType",
    header:"Complaint Type"
  },
  {
    accessorKey:"status",
    header:"Status",
    cell:({row})=>{
      const resolveStatus: (status: string) => string = (status = "") => {
        const btnStyles: Record<string, string> = {
          PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
          UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
          NEW: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
          ESCALATED: "bg-[#FF585821] border-2 border-[#FF5858]",
          OPENED: "bg-[#D016DD21] border-2 border-[#D116DD]",
          UNASSIGNED: "",
          RESOLVED: "bg-blue-200 border-2 border-blue-400",
          CLOSED: "bg-neutral-200 border-2 border-neutral-400",
        }
    
        return `${btnStyles[status]} inline h-max p-1`;
      };
      return(
        <div className="flex items-center justify-center">
         <div className={cn("w-max px-4  h-8 flex items-center justify-center text-xs text-center rounded-full ",resolveStatus(row.original.status))}>
          <p>{row.original.status}</p>
        </div>
       </div>
      )
    }
  },
  { header:"Date",
    accessorKey:"date"
  },
  {
    id:"actions",
    cell:({row})=>{
      return(
        <div className="">
          <Popover>
            <PopoverTrigger className="h-6 w-6 p-0 hover:bg-slate-300 rounded-md flex items-center justify-center transition-all">
                <BsThreeDots className="w-4 h-4 shrink"/>
            </PopoverTrigger>
            <PopoverContent className="bg-ncBlue dark:bg-ncBlue text-white p-0 w-36  rounded-md overflow-hidden gap-y-2" side="left">
            <div className="hover:bg-slate-200/25  text-white text-sm p-1.5" role="button">
              <p>View Message</p>
            </div>
            <div className="hover:bg-red-500 hover:text-white transition-all text-red-400 text-sm p-1.5" role="button">
              <p>Delete Message</p>
            </div>
            </PopoverContent>
          </Popover>
        </div>
      )
    }
  }
]
export const DraftMessagesColumnDefinition:ColumnDef<sentMessage>[]=[
  {
    id:"selection",
    cell:({row})=>{
      return(
        <Checkbox className="border-ncBlue dark:border-ncBlue data-[state=checked]:bg-ncBlue data-[state=checked]:text-white dark:bg-slate-200 bg-slate-200 dark:data-[state=checked]:bg-ncBlue dark:data-[state=checked]:text-white"/>
      )
    }
  },
  {
    accessorKey:"to",
    header:({column})=>{
      return(
        <Button
        className="flex items-center justify-center space-x-2 dark:bg-transparent bg-transparent group hover:bg-slate-200 dark:hover:bg-slate-200 mx-auto"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        To <ArrowUpDown className="w-4 h-4 shrink ml-2 opacity-0 group-hover:opacity-100 transition-all" />
      </Button>
      )
    },
    cell:({row})=>{
      return(
       <div className="flex items-center justify-center">
         <div className="flex flex-col gap-y-1 5  w-max px-1 items-start ">
          <p className="text-red-500">Draft</p>
          <p>{row.original.to}</p>
        </div>
       </div>
      )
    }
  },
  {
    accessorKey:"complaintType",
    header:"Complaint Type"
  },
  {
    accessorKey:"status",
    header:"Status",
    cell:({row})=>{
      const resolveStatus: (status: string) => string = (status = "") => {
        const btnStyles: Record<string, string> = {
          PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
          UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
          NEW: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
          ESCALATED: "bg-[#FF585821] border-2 border-[#FF5858]",
          OPENED: "bg-[#D016DD21] border-2 border-[#D116DD]",
          UNASSIGNED: "",
          RESOLVED: "bg-blue-200 border-2 border-blue-400",
          CLOSED: "bg-neutral-200 border-2 border-neutral-400",
        }
    
        return `${btnStyles[status]} inline h-max p-1`;
      };
      return(
        <div className="flex items-center justify-center">
         <div className={cn("w-max px-4  h-8 flex items-center justify-center text-xs text-center rounded-full ",resolveStatus(row.original.status))}>
          <p>{row.original.status}</p>
        </div>
       </div>
      )
    }
  },
  { header:"Date",
    accessorKey:"date"
  },
  {
    id:"actions",
    cell:({row})=>{
      return(
        <div className="">
          <Popover>
            <PopoverTrigger className="h-6 w-6 p-0 hover:bg-slate-300 rounded-md flex items-center justify-center transition-all">
                <BsThreeDots className="w-4 h-4 shrink"/>
            </PopoverTrigger>
            <PopoverContent className="bg-ncBlue dark:bg-ncBlue text-white p-0 w-36  rounded-md overflow-hidden gap-y-2" side="left">
            <div className="hover:bg-slate-200/25  text-white text-sm p-1.5" role="button">
              <p>View Message</p>
            </div>
            <div className="hover:bg-red-500 hover:text-white transition-all text-red-400 text-sm p-1.5" role="button">
              <p>Delete Message</p>
            </div>
            </PopoverContent>
          </Popover>
        </div>
      )
    }
  }
  
]