export type slaEntry = {
  title: string;
  state: boolean;
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
  },
  {
    title: "Assignee:From Unassigned",
    state: false,
  },
  {
    title: "Assignee:To unassigned",
    state: false,
  },
  {
    title: "Assignee changed",
    state: false,
  },
];
export const pauseSlaEntries: slaEntry[] = [
  {
    title: "Status: Waiting for Approval",
    state: false,
  },
  {
    title: "Status: Waiting for Customer",
    state: true,
  },
  {
    title: "Assignee set",
    state: false,
  },
  {
    title: "Assignee not set",
    state: false,
  },
];

export const stopEntries: slaEntry[] = [
  {
    title: "Comment: For Customers",
    state: true,
  },
  {
    title: "Entered Status: Waiting for Customer",
    state: false,
  },
  {
    title: "Resolution set",
    state: true,
  },
  {
    title: "Assignee: To Unassigned",
    state: false,
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