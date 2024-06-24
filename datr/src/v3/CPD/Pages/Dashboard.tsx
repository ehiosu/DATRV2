import React, { useState } from 'react'
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/api/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router';
import { Plus, TrendingUp } from 'lucide-react';

import { useTerminal } from '@/v3/hooks/useTerminal';
import { AirlineComplaintPerformance } from '../Components/AirlineComplaintPerformance';
import { AirlineFlightReports } from '../Components/AirlineFlightReports';
import { TicketBacklog } from '@/components/ui/TicketBacklog';
import { FlightPerformance } from '../Components/FlightPerformance';
import { ResolutionLeaders } from '@/components/ui/MostResponsiveAirlines';
import { ComplaintBreakdown } from '../Components/ComplaintBreakdown';
import { DisruptionBreakdown } from '../Components/DisruptionBreakdown';
import { AuthorizedComponent } from '../Components/AuthorizedComponent';
export const Dashboard = () => {
    const nav = useNavigate()
  return (
    <div className='w-full py-6  md:px-7'>
        <div className="flex items-center">
          <div>
          <p className='text-lg text-ncBlue font-[500]'>Dashboard</p>
          <p className='text-neutral-400 text-sm'>Overview Of System-Wide activities,feel free to explore other pages.</p>
          </div>
          <AuthorizedComponent roles={["ADMIN","TERMINAL_HEAD","SHIFT_HEAD"]}>
            <button onClick={()=>{nav('/CPD/New-Ticket')}} className='w-40 h-9 hover:bg-slate-400 transition-all rounded-md bg-ncBlue text-white flex items-center space-x-2 justify-center ml-auto '>
              New Ticket <Plus className='w-4 h-4 ml-2 shrink'/>
            </button>
          </AuthorizedComponent>
        </div>
    <div className="flex items-center gap-x-2 flex-wrap mt-2 gap-y-2 lg:justify-evenly justify-center">
    <DashboarStats />
    </div>
    <div className="mt-4">
        <DashboardReports/>
    </div>
    
    </div>
  )
}

const DashboarStats=()=>{
    const {axios}=useAxiosClient()
    const nav =useNavigate()
    const {user}=useAuth()
    const isAirline = user.roles.includes("AIRLINE");
    const newTicketQuery = useQuery({
        queryKey: ["dashboard", "tickets", "new"],
        queryFn: () =>
          axios(
            isAirline
              ? "tickets/airline/status?value=NEW&page=0&size=10"
              : "tickets/counts/by-status"
          ).then((resp:any) => resp.data.totalElements || resp.data),
      });
      const resolvedTickets = useQuery({
        queryKey: ["dashboard", "tickets", "resolved"],
        queryFn: () =>
          axios(
            isAirline
              ? "tickets/airline/status?value=RESOLVED&page=0&size=10"
              : "tickets/status?value=RESOLVED"
          ).then((resp:any) => resp.data.totalElements),
      });
      const openTickets = useQuery({
        queryKey: ["dashboard", "tickets", "open"],
        queryFn: () =>
          axios(
            isAirline
              ? "tickets/airline/status?value=OPENED&page=0&size=10"
              : "tickets/status?value=OPENED"
          ).then((resp:any) => resp.data.totalElements),
      });
    return (
        <>
        {!isAirline && newTicketQuery.isSuccess ? (
            <>
              <StatCard
                title={"New Tickets"}
                figure={newTicketQuery.data.NEW}
                onClick={() => {
                  nav("/CPD/Tickets/All");
                }}
              />
               <StatCard
                title={"Open Tickets"}
                figure={newTicketQuery.data.OPENED}
                onClick={() => {
                  nav("/CPD/Tickets/Open");
                }}
              />
              <StatCard
                title={"Escalated Tickets"}
                figure={newTicketQuery.data.ESCALATED}
                onClick={() => {
                  nav("/CPD/Tickets/Escalated");
                }}
              />
               <StatCard
                title={"Resolved Tickets"}
                figure={newTicketQuery.data.RESOLVED}
                onClick={() => {
                  nav("/CPD/Tickets/Resolved");
                }}
              />
              {/* <StatCard
                title={"Unresolved Tickets"}
                figure={newTicketQuery.data.UNRESOLVED}
                onClick={() => {
                
                }}
              /> */}
              {/* <StatCard
                title={"Closed Tickets"}
                figure={newTicketQuery.data.CLOSED}
                onClick={() => {
               
                }}
              /> */}
            </>
          ) : (
            !isAirline && (
              <>
                <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
                <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
                <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
                <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
              </>
            )
          )}
          {isAirline && !newTicketQuery.isError && newTicketQuery.isSuccess ? (
            <StatCard
              title={"New Tickets"}
              figure={newTicketQuery.data}
              onClick={() => {
                nav("/CPD/Tickets/All");
              }}
            />
          ) : isAirline ? (
            <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
          ) : (
            <></>
          )}
          {isAirline && !resolvedTickets.isError && resolvedTickets.isSuccess ? (
            <StatCard
              title={"Resolved Tickets"}
              figure={resolvedTickets.data}
              onClick={() => {
                nav("/CPD/Tickets/Resolved");
              }}
            />
          ) : isAirline ? (
            <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
          ) : (
            <></>
          )}
          {isAirline && !openTickets.isError && openTickets.isSuccess ? (
            <StatCard
              title={"Open Tickets"}
              figure={openTickets.data}
              onClick={() => {
                nav("/CPD/Tickets/Open");
              }}
            />
          ) : isAirline ? (
            <Skeleton className="md:w-40 w-32 aspect-square rounded-lg " />
          ) : (
            <></>
          )}
          </>
    )

}
type StatCardProps={
    title:string,
    figure:string,
    onClick:()=>void
}
const StatCard=({title,onClick,figure}:StatCardProps)=>{
    return (    
<div role='button' onClick={()=>onClick()} className="bg-ncBlue p-3 w-[11.8rem] rounded-md ">
        <div className="flex flex-col border-l-2 space-y-1 border-l-white text-white pl-2">
            <p className='text-[0.8275rem] font-normal '>{title}</p>
            <p className='text-[0.74rem]'>{figure}</p>
        </div>
        <div className="flex items-center mt-2">
            <div className='flex items-center px-1 rounded-lg py-[0.1rem] bg-green-400/40'>
                <TrendingUp className='w-3 h-3 shrink text-green-400 mr-2'/>
                <p className='text-[0.65rem] text-green-400'>14.85%</p>
            </div>
            <p className='text-xs text-white ml-2'>vs Last Month</p>
        </div>
</div>
    )
}
import {
  Chart as ChartJs,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from 'react-chartjs-2';
import { GenericDataTable, recentTicketcolumnDefinition } from '@/CPD/Components/DataTable';
import { useTickets } from '@/v3/hooks/useTickets';
ChartJs.register(BarElement,Tooltip,Legend,CategoryScale,LinearScale);
const DashboardReports=()=>{
    const {axios}=useAxiosClient()
    const terminals=useTerminal()
    const {user}=useAuth()
    const [terminal,setTerminal]=useState("ALL")
    const query=useTickets("NEW",{from:undefined,to:undefined},1,20,()=>{})
    let data = {
        labels:["Air Peace","Max Air","Dana Air","Arik Air","Aero Contractors"],
        datasets: [{
          label:"Resolved Tickets",
          data:[Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100)],
            backgroundColor: "#01054C",
            borderWidth: 1,
            barThickness: 28,
            borderRadius: 40,
          },
          {
            label: "Open Tickets",
            data:[Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100),Math.floor(Math.random()*100)],
            backgroundColor: "#006973",
            borderWidth: 1,
            barThickness: 28,
            borderRadius: 40,
          },
        ],
      };
    const options = {
      plugins: {
        datalabels: {
          display: true,
          align: "bottom",
        
          color:"#FFF",
          borderRadius: 3,
          font: {
            size: 14,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || "";
              return label + `: ${context.parsed.y}`;
            },
          },
        },
      },
  
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false,
          },
        },
        y: {
          stacked: false,
          grid: {
            display: false,
          },
        },
      },
    };
    if(user.roles[user.roles.length-1]==="DGO") {
        return (
            <section className='flex flex-col flex-wrap'>
              <div className="flex gap-x-2 flex-wrap  xl:gap-y-0 gap-y-3 max-w-full">
              { 
                    terminals.isSuccess ?<>
                    <AirlineComplaintPerformance terminals={terminals.data}/>
                    </>:terminals.isLoading&&<Skeleton className='w-full'/>
                }
                {
                    terminals.isSuccess?<AirlineFlightReports terminals={terminals.data}/>:terminals.isLoading&&<Skeleton className='w-[48%] min-w-[400px] mx-auto'/>
                }
                
              </div>
             
              <div className="flex flex-wrap w-full my-4   xl:gap-y-0 gap-y-4 max-w-full">
               
                {
                    terminals.isSuccess? <div className='md:w-full lg:w-[60%] w-full  h-[50vh] p-2 max-w-full  bg-white border-t-4 border-t-ncBlue rounded-t-lg overflow-y-auto  xl:max-w-[48%]  min-w-[400px] mx-auto'><ComplaintBreakdown/>  </div>:terminals.isLoading&&<Skeleton className='w-[48%] min-w-[400px] h-[40vh] mx-auto'/>
                }
              
                
                {
                    terminals.isSuccess?<div className='md:w-full lg:w-[60%] w-full  h-[50vh] p-2 max-w-full  bg-white border-t-4 border-t-ncBlue rounded-t-lg overflow-y-auto  xl:max-w-[48%]  min-w-[400px] mx-auto'><DisruptionBreakdown/> </div>:terminals.isLoading&&<Skeleton className='w-[48%] min-w-[400px] h-[40vh] mx-auto'/>
                }
               
                </div>
              <div className="flex flex-wrap mt-4  gap-y-4 max-w-full">
                
                {
                    terminals.isSuccess?<div className='xl:w-[48%] w-full h-[50vh] p-2 ma bg-white border-t-4 border-t-ncBlue rounded-t-lg overflow-y-auto  mx-auto'><TicketBacklog terminals={terminals.data}/></div>:terminals.isLoading&&<Skeleton className='w-[48%] mx-auto min-w-[400px] h-[40vh]'/>
                }
               
              
                {
                    terminals.isSuccess? <div className='xl:w-[48%] w-full h-[50vh] p-2 ma bg-white border-t-4 border-t-ncBlue rounded-t-lg overflow-y-auto  mx-auto'><ResolutionLeaders terminals={terminals.data}/> </div>:terminals.isLoading&&<Skeleton className='w-[48%] min-w-[400px] h-[40vh] mx-auto'/>
                }
               
               
                {
                    terminals.isSuccess? <div className='  w-full h-[60vh] p-2 ma bg-white border-t-4 border-t-ncBlue rounded-t-lg overflow-y-auto lg:mx-0 mx-auto'><FlightPerformance/></div>:terminals.isLoading&&  <Skeleton className='w-full h-[50vh] rounded-lg mx-auto'/>
                }
                
               
              </div>
        </section>
        )
    }
    return(
        <section className='flex flex-col'>
               
               <div className="flex flex-wrap w-full my-4   xl:gap-y-0 gap-y-4 max-w-full">
               <div className=' md:w-full lg:w-[60%] w-full  h-[50vh] p-2 max-w-full  bg-white border-t-4 border-t-ncBlue rounded-t-lg overflow-y-auto  xl:max-w-[48%]  min-w-[400px] mx-auto flex flex-col gap-y-3'>
          <p className='text-xl font-[500] text-ncBlue'>Key Performance Metrics</p>

             <div className="flex-1 flex items-center justify-center max-h-[85%]">
             <Bar data={data} options={options as any}/>
             </div>
            </div>
               <div className=' md:w-full lg:w-[60%] w-full  h-[50vh] p-2 max-w-full  bg-white border-t-4 border-t-ncBlue rounded-t-lg overflow-y-auto  xl:max-w-[48%]  min-w-[400px] mx-auto flex flex-col gap-y-3'>
          <p className='text-xl font-[500] text-ncBlue'>New Tickets</p>
          {
            query.isLoading?<Skeleton className='w-full h-[60vh]'/>:query.isSuccess&& <div className="h-[60vh] overflow-auto  rounded-lg py-1 mt-4 scroll-smooth w-full">   <GenericDataTable tableClassname='' headerClassname='rounded-lg' columns={recentTicketcolumnDefinition} data={query.data||[]} filterColumn='complainantName' hasFilter/></div>
          }
             
            </div>
                </div>
           
        </section>
    )
}