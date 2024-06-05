import React from 'react'
import { Select, SelectTrigger, SelectValue,SelectContent,SelectItem } from "./select";
import { GenericDataTable, disruptionLeaderColumnDef } from '@/CPD/Components/DataTable';
export const DisruptionLeaders = ({terminals}:{terminals:any[]}) => {
  return (
    <div className='w-full h-full overflow-y-auto'>
        <div className="flex items-center flex-wrap mb-3">
            <p className='md:text-xl text-lg font-semibold'>Disruption Leaders</p>
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
  { airline: "Air Peace", totalFlights: "78", disruptedFlights: "15" },
  { airline: "Dana Air", totalFlights: "85", disruptedFlights: "30" },
  { airline: "Ibom Air", totalFlights: "90", disruptedFlights: "10" },
  { airline: "Arik Air", totalFlights: "78", disruptedFlights: "28" },
  { airline: "Max Air", totalFlights: "70", disruptedFlights: "21" },
  { airline: "Aero Contractors", totalFlights: "88", disruptedFlights: "40" },
  { airline: "Green Africa", totalFlights: "100", disruptedFlights: "15" },
  { airline: "Overland Airways", totalFlights: "95", disruptedFlights: "35" },
  { airline: "United Nigeria Airlines", totalFlights: "75", disruptedFlights: "20" },
  { airline: "Med-View Airline", totalFlights: "100", disruptedFlights: "20" },
].sort((a,b)=>(((parseFloat(b.disruptedFlights)/parseFloat(b.totalFlights))*100)-(parseFloat(a.disruptedFlights)/parseFloat(a.totalFlights))*100))} columns={disruptionLeaderColumnDef}/>

    </div>
  )
}
