export  const statData=[{
    id:1,
    figure:'49',
    title:'New Tickets'
},
{
    id:2,
    figure:'1111',
    title:'Resolved Tickets'
},
{
    id:3,
    figure:'365',
    title:'Pending Tickets'
},
{
    id:4,
    figure:'98.7%',
    title:'Star Rating'
},
{
    id:5,
    figure:'3.68hrs',
    title:'Time To Reply'
}
]

export  const CurrentDASDatat=[{
  id:1,
  figure:'258',
  title:'Total Scheduled Flights'
},
{
  id:2,
  figure:'78',
  title:'Total Delayed Flights'
},
{
  id:3,
  figure:'153',
  title:'Cancelled Flights'
},
{
  id:4,
  figure:'24',
  title:'Flights Delayed Under an Hour'
},
{
  id:5,
  figure:'3',
  title:'Flight Delayed Over 2 Hours'
}
]


export const RecentTickets=[
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
  

  export const ReportTicketDonutData=[
    {
      data:[55,25,15,5,0],
      labels:["Complaint type","Complaint type","Complaint type","Complaint type","Other"],
      colors:['#2E6DFF','#FF5858','#5AD1AD','#F9ED70','#B3B8BD'],
      title:'Complain Type'
    },
    {
      data:[60,5,35],
      labels:["Escalated","Resolved","Open"],
      colors:['#D116DD','#5AD1AD','#FF007C'],
      title:'Current Status'
    },
    {
      data:[55,35,10],
      labels:["Low","Medium","High"],
      colors:['#2E6DFF','#F9ED70','#FF007C'],
      title:'Priority'
    },
    {
      data:[15,5,10,70],
      labels:["Escalated","Resolved","Unresolved","Open"],
      colors:['#D116DD','#5AD1AD','#F8C74D','#FF007C'],
      title:'All Tickets'
    },
    {
      data:[10,5,85],
      labels:["Email","Website","Social Media"],
      colors:['#2E6DFF','#FF007C','#5AD1AD',],
      title:'Source'
    },
  ]

  export const RTGridData =[
    {
      title:"AVG Response Time",
      text:"02 m 23s",
      trend:"up",
      percentage:"+5%"
    },
    {
      title:"AVG Resolution Time",
      text:"03h 02 m 23s",
      trend:"up",
      percentage:"+5%"
    },
    {
      title:"AVG Replies To Resolution",
      text:"4",
      trend:"down",
      percentage:"-5%"
    },
    {
      title:"AVG Reassignments",
      text:"9",
      trend:"up",
      percentage:"5%"
    }
  ]

  export const conversationData=[
    {
      count:649,
      text:"New Conversations",
      trend:"up",
      percentage:"8"
    },
    {
      count:702,
      text:"Total Resolutions",
      trend:"down",
      percentage:"5"
    },
    {
      count:400,
      text:"Total Customers",
      trend:"up",
      percentage:"8"
    },
    {
      count:400,
      text:"Avg Conversations/day",
      trend:"up",
      percentage:"5"
    },
    {
      count:101,
      text:"Avg Resolutions/day",
      trend:"down",
      percentage:"5"
    },
    {
      count:30,
      text:"Avg customers helped/day",
      trend:"up",
      percentage:"5"
    }
  ]

  export const bigConversationData=   {
    title:"More tickets created than resolved",
    count:649,
    text:"Open vs Resolved",
    trend:"up",
    percentage:"5"
  }

  export  const terminals=[
    {
      Title:"A",
      Terminals:[
        {
          name:"Abuja",
          id:"abj"
        },
        {
          name:"Abia",
          id:"Aba"
        }
      ]
    },
    {
      Title:"L",
      Terminals:[
        {
          name:"Lagos",
          id:"lag"
        }
      ]
    }
  ]
 export const DASDashboardPerformanceGraphData=[{
    name:"Cancelled Flights",
    data:[153,129]
  },
{
  name:"Delayed Flights",
  data:[78,72]
}]

export const expandedReport=[
  {
    date:'APR 01',
    data:[
      {
        fltNo:"FVJ200",
        route:'los',
        sta:"7:45",
        ata:"",
        delay:"",
        isDelayed:false,
        isOnTime:false,
        isCancelled:true,
        type:'in'
      },
      {
        fltNo:"FVJ214",
        route:'los',
        sta:"16:00",
        ata:"16:15",
        delay:"0:15",
        isDelayed:true,
        isOnTime:false,
        isCancelled:false,
        type:'in'
      },
      {
        fltNo:"FVJ214",
        route:'los',
        sta:"12:30",
        ata:"12:19",
        delay:"",
        isDelayed:false,
        isOnTime:true,
        isCancelled:false,
        type:'in'
      },
      {
        fltNo:"FVJ201",
        route:'los',
        sta:"8:40",
        ata:"",
        delay:"",
        isDelayed:false,
        isOnTime:false,
        isCancelled:true,
        type:'out'
      },
      {
        fltNo:"FVJ215",
        route:'los',
        sta:"17:05",
        ata:"17:15",
        delay:"0:10",
        isDelayed:false,
        isOnTime:true,
        isCancelled:false,
        type:'out'
      },
      {
        fltNo:"FVJ207",
        route:'los',
        sta:"13:15",
        ata:"13:22",
        delay:"0:07",
        isDelayed:false,
        isOnTime:true,
        isCancelled:false,
        type:'out'
      },
      
    ]
  },
  {
    date:"APR 02",
    data:[
      {
        fltNo:"FVJ200",
        route:'los',
        sta:"7:45",
        ata:"7:48",
        delay:"0:03",
        isDelayed:false,
        isOnTime:true,
        isCancelled:false,
        type:'in'
      },
      {
        fltNo:"FVJ214",
        route:'los',
        sta:"16:00",
        ata:"16:20",
        delay:"0:20",
        isDelayed:true,
        isOnTime:false,
        isCancelled:false,
        type:'in'
      },
      {
        fltNo:"FVJ214",
        route:'los',
        sta:"12:30",
        ata:"12:18",
        delay:"",
        isDelayed:false,
        isOnTime:true,
        isCancelled:false,
        type:'in'
      },
      {
        fltNo:"FVJ201",
        route:'los',
        sta:"8:40",
        ata:"8:43",
        delay:"",
        isDelayed:false,
        isOnTime:true,
        isCancelled:true,
        type:'out'
      },
      {
        fltNo:"FVJ215",
        route:'los',
        sta:"17:15",
        ata:"17:19",
        delay:"0:04",
        isDelayed:false,
        isOnTime:true,
        isCancelled:false,
        type:'out'
      },
      {
        fltNo:"FVJ207",
        route:'los',
        sta:"13:15",
        ata:"13:30",
        delay:"0:30",
        isDelayed:true,
        isOnTime:false,
        isCancelled:false,
        type:'out'
      },
    ]
  }
  

]