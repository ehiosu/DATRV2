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