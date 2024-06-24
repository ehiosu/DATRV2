import {  GenericDataTable, OnTimeTableColumnDef } from '@/CPD/Components/DataTable';
import React from 'react'

export const FlightPerformance = () => {
    const data = [
        { "airline": "Air Peace", "onTimeFlights": "22","delayedFlights":"3","cancelledFlights":"2", "totalFlights": "27", "disruptedFlights": "5" },
        { "airline": "Dana Air", "onTimeFlights": "60","delayedFlights":"13","cancelledFlights":"12", "totalFlights": "85", "disruptedFlights": "25" },
        { "airline": "Ibom Air", "onTimeFlights": "72","delayedFlights":"6","cancelledFlights":"12", "totalFlights": "90", "disruptedFlights": "18" },
        { "airline": "Arik Air", "onTimeFlights": "55","delayedFlights":"18","cancelledFlights":"5", "totalFlights": "78", "disruptedFlights": "23" },
        { "airline": "Max Air", "onTimeFlights": "48","delayedFlights":"12","cancelledFlights":"10", "totalFlights": "70", "disruptedFlights": "22" },
        { "airline": "Aero Contractors", "onTimeFlights": "62","delayedFlights":"14","cancelledFlights":"4", "totalFlights": "88", "disruptedFlights": "18" },
        { "airline": "Green Africa", "onTimeFlights": "80","delayedFlights":"14","cancelledFlights":"6", "totalFlights": "100", "disruptedFlights": "20" },
        { "airline": "Overland Airways", "onTimeFlights": "68","delayedFlights":"22","cancelledFlights":"6", "totalFlights": "95", "disruptedFlights": "28" },
        { "airline": "United Nigeria Airlines", "onTimeFlights": "52","delayedFlights":"13","cancelledFlights":"10", "totalFlights": "75", "disruptedFlights": "23" },
        { "airline": "Med-View Airline", "onTimeFlights": "75","delayedFlights":"17","cancelledFlights":"8", "totalFlights": "100", "disruptedFlights": "25" }
      ];
      
  return (
    <div className='h-[50vh] w-full overflow-y-auto p-2 relative'>
    <div className="flex flex-wrap">
        <p className='text-lg font-[500] mb-1'>Flight Disruption Data</p>
    </div>
        <GenericDataTable downloadExcel columns={OnTimeTableColumnDef} showColumnFilter isHeaderSticky data={data}/>
    </div>
  )
}
