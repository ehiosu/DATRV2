import { AiOutlineStock } from "react-icons/ai";
import { HiOutlineTicket } from "react-icons/hi";
import {BiMessageSquareDetail} from "react-icons/bi"
import {TbReportSearch} from 'react-icons/tb'
import {FiSettings} from 'react-icons/fi'
import {BsPersonPlus} from 'react-icons/bs'
export const content =[
    {
        Name:'Dashboard',
        Icon : <AiOutlineStock className="text-2xl"/>,
        SubMenu:[],
        to :'/CPD/Dashboard'
    },
    {
        Name:'Tickets',
        Icon : <HiOutlineTicket className="text-2xl "/>,
        SubMenu:[
            {Name:'Open',Info:4,to:'/CPD/Tickets/Open'},
            {Name:'Resolved',Info:0,to:'/CPD/Tickets/Resolved'},
            {Name:'Unresolved',Info:0,to:'/CPD/Tickets/Unresolved'},
            {Name:'Unassigned',Info:0,to:'/CPD/Tickets/Unassigned'},
            {Name:'Escalated',Info:2,to:'/CPD/Tickets/Escalated'},
            {Name:'All',Info:0,to:'/CPD/Tickets/All'}
        ],
        to :'/CPD/Tickets/All'
    },
    {
        Name:'Messages',
        Icon : <BiMessageSquareDetail className="text-2xl"/>,
        SubMenu:[
            {Name:'Inbox',Info:4,to:'/Messages/Inbox'},
            {Name:'Sent Items',Info:0,to:'/Messages/Sent'},
            {Name:'Draft',Info:0,to:'/Messages/Drafts'}
        ],
        to :'/Messages/Inbox'
    },
    {
        Name:'Reports',
        Icon : <TbReportSearch className="text-2xl"/>,
        SubMenu:[
            
        ],
        to :'/Reports'
    },
    {
        Name:'Configuration',
        Icon : <FiSettings className="text-2xl"/>,
        SubMenu:[
            
        ],
        to :'/Configuration'
    },
    {
        Name:'Help',
        Icon : <BsPersonPlus className="text-2xl"/>,
        SubMenu:[
            
        ],
        to :'/Help'
    }
]