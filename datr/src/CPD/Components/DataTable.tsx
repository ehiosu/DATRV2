import React from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table"

  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { GeneralTicket, ResolvedTicket, openTicket, recieptData, unassignedTicket } from './Types'

  
  const columnDefinition:ColumnDef<recieptData>[] = [
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
    {
      accessorKey:"Assign",
      header:()=> <div  className=' '>Assign a Ticket</div>,
      cell:({row})=>
          <div className="w-full flex justify-center items-center">
              <span className="block  w-6 aspect-square rounded-full  bg-darkBlue">
</span>
          </div>
      
      
    }
  ];

  interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    
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
      <div className="rounded-md border ">
        <Table>
          <TableHeader  className='  '>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}  >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}  className='text-center '>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}  className='text-center'>
                      {flexRender(
                        cell.column.columnDef.accesorKey === "id"
                          ? row.original[cell.column.columnDef.accesorKey].toString() // Convert ID to string
                          :cell.column.columnDef.accessorKey === "Assign"? cell.column.columnDef.cell({ row }):row.original[cell.column.columnDef.accesorKey],
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

  export  const RecentTicketsTable=()=>{
    const data:recieptData[]=[
      {
        "complainant": "Chijioke Okonkwo",
        "complaint_type": "Lost Luggage",
        "id": "A1B2C3"
      },
      {
        "complainant": "Ngozi Eze",
        "complaint_type": "Delayed Flight",
        "id": "D4E5F6"
      },
      {
        "complainant": "Obi Okafor",
        "complaint_type": "Poor Customer Service",
        "id": "G7H8I9"
      },
      {
        "complainant": "Amina Mohammed",
        "complaint_type": "Security Concern",
        "id": "J1K2L3"
      },
      {
        "complainant": "Emeka Nwosu",
        "complaint_type": "Facility Cleanliness",
        "id": "M4N5O6"
      }
    ]
    
    return(
      <DataTable columns={columnDefinition} data={data}  />
    )
  }



  const generalTicketColumnDefiniton:ColumnDef<GeneralTicket>[] = [
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
    {
      accesorKey: "group",
      header: "Group",
    },
    {
      accesorKey: "status",
      header: "Status",
    },
    {
      accesorKey: "date",
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
  

  export  const GeneralTicketsTable=()=>{
   
    
    return(
     <div className='max-h-full overflow-y-auto bg-white  shadow-md'>
       <TicketsDataTable columns={generalTicketColumnDefiniton} data={generalTicketData}  />
     </div>
    )
  }


  export function TicketsDataTable<TData, TValue>({
    columns,
    data,
    hasAssignment=false
  }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
  
  
    return (
      <div className="rounded-md border bg-white shadow-md ">
        <Table>
          <TableHeader  className='  '>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}  >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}  className='text-center '>
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
                  hasAssignment&&<TableHead className='text-center'>
                    <span className='t'>Assign To </span>
                  </TableHead>
                }
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
                    cell.column.columnDef.accesorKey === "status"?<StatusTableCell cell={cell} row={row}/>
                   :cell.column.columnDef.accesorKey === "cpo"?  <CpoTableCell cell={cell}  row={row} />
                   :<RegularTableCell cell={cell}  row={row} />
                   
                  
                   
                  

                  ))}
                  {
                     hasAssignment&&
                     <TableCell className='grid place-items-center'>
                       <span className='w-6  aspect-square rounded-full  bg-darkBlue  block'>
 
                       </span>
                     </TableCell>
                  }
              
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


const openTicketColumnDefinition:ColumnDef<openTicket>[] = [
  {
    accesorKey: "id",
    header: "ID",
  },

  {
    accesorKey: "complainant",
    header: "Complainant",
  },
  {
    accesorKey: "complaint_type",
    header: "Complainant Type",
  },
 
  {
    accesorKey: "status",
    header: "Status",
  },
  {
    accesorKey: "date",
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
]
  export  const OpenTicketsTable=()=>{
    return(
      <div>
        <TicketsDataTable data={openTicketData} columns={openTicketColumnDefinition}  hasAssignment={true}/>
      </div>
    )
  }

  const RegularTableCell=({cell,row})=>{
    return(
      <TableCell key={cell.id}  className='text-center  '>
      {flexRender(
        cell.column.columnDef.accesorKey === "id"? row.original[cell.column.columnDef.accesorKey].toString() // Convert ID to string
          :row.original[cell.column.columnDef.accesorKey],
        cell.getContext()
      )}
    </TableCell>
    )
  }

  const CpoTableCell=({cell,row})=>{
    return(
      <TableCell key={cell.id} className='flex  justify-center  items-center  gap-2' >
                     {row.original[cell.column.columnDef.accesorKey]&& <span className='block  w-3 rounded-full  bg-green-400  aspect-square  '> </span>}
                     {row.original[cell.column.columnDef.accesorKey]?  flexRender(
                         row.original[cell.column.columnDef.accesorKey],
                       cell.getContext()
                     ):<span className='block text-neutral-800/30' >Unassigned</span>
                     
                     }
                   </TableCell>
    )
  }

  const StatusTableCell=({cell,row})=>{
    const resolveStatus: (status: string) => string = (status = "") => {
      const btnStyles: Record<string, string> = {
        Pending: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
        Unresolved: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
        Resolved: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
        Open: "bg-[#FF585821] border-2 border-[#FF5858]",
        Escalated: "bg-[#D016DD21] border-2 border-[#D116DD]",
        Unassigned:""
      };
    
      if (!btnStyles[status]) {
        return "";
      }
    
      return `${btnStyles[status]} inline h-max p-1`;
    };
   return(
    <TableCell key={cell.id} className='grid place-items-center' >
    <span className={`${resolveStatus(row.original[cell.column.columnDef.accesorKey])} rounded-lg` }>
   {flexRender(
       row.original[cell.column.columnDef.accesorKey],
     cell.getContext()
   )}</span>
 </TableCell>
   )
  }



const ResolvedTicketColumnDefinition:ColumnDef<ResolvedTicket>[]=[
  {
    accesorKey: "id",
    header: "ID",
  },

  {
    accesorKey: "complainant",
    header: "Complainant",
  },
  {
    accesorKey: "complaint_type",
    header: "Complainant Type",
  },
  {
    accesorKey: "cpo",
    header: "CPO",
  },
  {
    accesorKey: "group",
    header: "Group",
  },
  {
    accesorKey: "status",
    header: "Status",
  },
  {
    accesorKey: "date",
    header: "Date due",
  },
]
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

  export  const ResolvedTicketsTable=()=>{
    return(
      <div  className='w-full h-full  overflow-y-auto'>
        <TicketsDataTable data={resolvedTicketPlaceholderData}  columns={ResolvedTicketColumnDefinition}  hasAssignment={false}/>
      </div>
    )
  }

  const UnresolvedTicketsColumnDefinition:ColumnDef<ResolvedTicket>[]=[
    {
      accesorKey: "id",
      header: "ID",
    },
  
    {
      accesorKey: "complainant",
      header: "Complainant",
    },
    {
      accesorKey: "complaint_type",
      header: "Complainant Type",
    },
    {
      accesorKey: "cpo",
      header: "CPO",
    },
    {
      accesorKey: "group",
      header: "Group",
    },
    {
      accesorKey: "status",
      header: "Status",
    },
    {
      accesorKey: "date",
      header: "Date due",
    },
  ]

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
  export  const UnresolvedTicketsTable=()=>{
    return(
      <div  className='w-full h-full  overflow-y-auto'>
        <TicketsDataTable data={UnresolvedTicketsPlaceholderData}  columns={UnresolvedTicketsColumnDefinition}  hasAssignment={true}/>
      </div>
    )
  }
  const unassignedTicketColumnDefinition:ColumnDef<unassignedTicket>[]=[
    {
      accesorKey: "id",
      header: "ID",
    },
    {
      accesorKey: "complainant",
      header: "Complainant",
    },
    {
      accesorKey: "complaint_type",
      header: "Complainant Type",
    },
    {
      accesorKey: "cpo",
      header: "CPO",
    },
    {
      accesorKey: "group",
      header: "Group",
    },
    {
      accesorKey: "status",
      header: "Status",
    },
    {
      accesorKey: "date",
      header: "Date due",
    },

  ]

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
  export  const UnassignedTicketsTable=()=>{
    return(
      <div  className='w-full h-full  overflow-y-auto'>
        <TicketsDataTable data={unassignedTicketData}  columns={unassignedTicketColumnDefinition}  hasAssignment={false}/>
      </div>
    )
  }


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
  export  const EscalatedTicketsTable=()=>{
    return(
      <div  className='w-full h-full  overflow-y-auto'>
        <TicketsDataTable data={escalatedTicketsPlaceholder}  columns={UnresolvedTicketsColumnDefinition}  hasAssignment={true}/>
      </div>
    )
  }