import React from 'react'
import { Select, SelectTrigger, SelectValue,SelectContent,SelectItem } from "./select";
import { GenericDataTable, bestPerformingColumnDef } from '@/CPD/Components/DataTable';
export const ResolutionLeaders = ({terminals}:{terminals:any[]}) => {
  return (
    <div className='w-full h-full overflow-y-auto'>
    <div className="flex items-center flex-wrap mb-3">
        <p className='md:text-xl text-lg font-semibold'>Complaint Resolution</p>
        <Select  >
      <SelectTrigger
        disabled={!terminals}
        className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none ml-auto"
      >
        <SelectValue placeholder="Select A Terminal" />
      </SelectTrigger>
      {terminals.length>0 && (
        <SelectContent>
          <SelectItem value="All">
            All
          </SelectItem>
          {terminals.map((terminal: any) => (
            <SelectItem value={terminal.name}>
              {terminal.name}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
    </div>
    <GenericDataTable data={[
    {"airline": "Air Peace", "activeTickets": "50", "resolvedTickets": "45"},
    {"airline": "Dana Air", "activeTickets": "80", "resolvedTickets": "70"},
    {"airline": "Ibom Air", "activeTickets": "40", "resolvedTickets": "35"},
    {"airline": "Arik Air", "activeTickets": "90", "resolvedTickets": "85"},
    {"airline": "Max Air", "activeTickets": "35", "resolvedTickets": "30"},
    {"airline": "Aero Contractors", "activeTickets": "60", "resolvedTickets": "50"},
    {"airline": "Green Africa", "activeTickets": "70", "resolvedTickets": "65"},
    {"airline": "Overland Airways", "activeTickets": "20", "resolvedTickets": "18"},
    {"airline": "United Nigeria Airlines", "activeTickets": "55", "resolvedTickets": "50"},
    {"airline": "Med-View Airline", "activeTickets": "85", "resolvedTickets": "80"},
]} columns={bestPerformingColumnDef}/>

</div>
  )
}
