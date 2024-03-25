export type slaEntry = {
  title: string;
  state: boolean;
  value:string,
};
export type requestType = {
  title: string;
  state: boolean;
};

type TicketRequestTypeEntry = {
  title: string;
  data: requestType[];
};
export type TicketRequests = TicketRequestTypeEntry[];

export const requestEntries: TicketRequests = [
  {
    title: "Airline Problems",
    data: [
      {
        title: "Missing Luggage",
        state: false,
      },
      {
        title: "Faulty Airline",
        state: false,
      },
      {
        title: "Faulty Air Conditioner",
        state: false,
      },
      {
        title: "Bad Food",
        state: false,
      },
      {
        title: "Tampered Luggage",
        state: false,
      },
      {
        title: "Bad Toilets",
        state: false,
      },
    ],
  },
  {
    title: "Service Issues",
    data: [
      {
        title: "Delayed Flight",
        state: false,
      },
      {
        title: "Wrong Seat Assignments",
        state: false,
      },
      {
        title: "Rude Staff",
        state: false,
      },
      {
        title: "Wrong Ticketing",
        state: false,
      },
      {
        title: "Missed Flight",
        state: false,
      },
      {
        title: "Bad Entertainment System",
        state: false,
      },
     
    ],
  },
  {
    title:"Others",
    data:[]
  }
];
export const startSlaEntries: slaEntry[] = [
  {
    title: "Ticket Created",
    state: false,
    value:"TICKET_CREATION"
  },
  {
    title: "Assignee:From Unassigned",
    state: false,
    value:"FROM_UNASSIGNED"
  },
  {
    title: "Assignee:To unassigned",
    state: false,
    value:""
  },
  {
    title: "Assignee changed",
    state: false,
    value:""
  },
];
export const pauseSlaEntries: slaEntry[] = [
  {
    title: "Status: Waiting for Approval",
    state: false,
    value:""
  },
  {
    title: "Status: Waiting for Customer",
    state: true,
    value:""
  },
  {
    title: "Assignee set",
    state: false,
    value:""
  },
  {
    title: "Assignee not set",
    state: false,
    value:"TO_UNASSIGNED"
  },
];

export const stopEntries: slaEntry[] = [
  {
    title: "Comment: For Customers",
    state: true,
    value:""
  },
  {
    title: "Entered Status: Waiting for Customer",
    state: false,
    value:""
  },
  {
    title: "Resolution set",
    state: true,
    value:""
  },
  {
    title: "To:Assigned",
    state: false,
    value:"TO_ASSIGNED"
  },
];

export type statusType={
  title:string,
  color:string,
  state:boolean
}
export const StatusTypeEntries:statusType[]=[
  {
    title:"Unassigned",
    color:"#FF5858",
    state:false
  },{
    title:"Assigned",
    color:"#5AD1AD",
    state:true
  },{
    title:"Open",
    state:false,
    color:'#F89774'
  },{
    title:"Resolved",
    state:true,
    color:"#F8C74D"
  },{
    title:"Unresolved",
    color:"#2E6DFF",
    state:false
  },
  {
    title:"Escalated",
    color:"#2E6DFF",
    state:false
  },{
    title:"Closed",
    color:"#2E6DFF",
    state:false
  }
]

type groupConfigRight={
   read:boolean,
   write:boolean,
   
}