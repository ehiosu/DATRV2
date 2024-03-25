import { type } from "os"

export type  openTicket={
    id:string,
    complaint_type:string,
    complainant:string,
    status:"Open"|"Resolved"|"Unresolved"|"Unassigned"|"Escalated",
    date:string
  }

export type ResolvedTicket=openTicket&{
    group:String,
    cpo:String,
    }

export type unassignedTicket=openTicket&{
        cpo:String,
        }

 export  type recieptData={
        id:string,
        complainant:string,
        complaint_type:string
      }

export  type GeneralTicket={
        id:string,
        complaint_type:string,
        complainant:string,
        cpo:string,
        group:string,
        status:"Pending"|"Unresolved"|"Resolved"|"",
        date:string
      }

export type Message={
  recipient:String,
  complaint_type:String,
  status:String,
  time:String
}

export type TicketDistribution={
  id:String,
  cpoName:String,
  assigned:String,
  active:String,  
  resolved:String,
  escalated:String,
  stressLevel:"High"|"Medium"|"Low"
}

export type SlaGeneral={
  slaName:string,
  resolutionTime:string,
  responseTime:string,
  resolutionHour?:string,
  resolutionMinute?:string,
  responseHour?:string,
  responseMinute?:string
}
export type GeneralGroup={
  groupDescription:string,
  count:string,
  name:string
}

export type GeneralTerminal={
  id:string,
  name:string
}

export type DelayedFlight={
  id:string,
  numberOfFlights:string,
  delays:string,
  delayL1:string,
  delay1_2:string,
  delayg2:string
}
export type cancelledFlight={
  id:string,
  cancelledFlights:string,
  numberOfFlights:string
}
export type Report = {
  fltNo: string;
  route: string;
  sta: string;
  ata: string;
  delay: string;
  isDelayed: boolean;
  isOnTime: boolean;
  isCancelled: boolean;
  type: 'in' | 'out'; // Assuming 'in' and 'out' are the possible values for the 'type' property
};