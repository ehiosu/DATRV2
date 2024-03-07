import { AiOutlineStock } from "react-icons/ai";
import { HiOutlineTicket } from "react-icons/hi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import { BsPersonPlus } from "react-icons/bs";
import { BsClipboard2Data } from "react-icons/bs";
export const cpoSidebarContent = [
  {
    Name: "Dashboard",
    Icon: <AiOutlineStock />,
    SubMenu: [],
    to: "/CPD/Dashboard",
  },
  {
    Name: "Tickets",
    Icon: <HiOutlineTicket />,
    SubMenu: [
      { Name: "Open", Info: 4, to: "/CPD/Tickets/Open" },
      { Name: "Resolved", Info: 0, to: "/CPD/Tickets/Resolved" },
      { Name: "Unresolved", Info: 0, to: "/CPD/Tickets/Unresolved" },
      { Name: "Unassigned", Info: 0, to: "/CPD/Tickets/Unassigned" },
      { Name: "Escalated", Info: 2, to: "/CPD/Tickets/Escalated" },
      { Name: "All", Info: 0, to: "/CPD/Tickets/All" },
    ],
    to: "/CPD/Tickets/All",
  },
  {
    Name: "Messages",
    Icon: <BiMessageSquareDetail />,
    SubMenu: [
      { Name: "Inbox", Info: 4, to: "/CPD/Messages?location=inbox" },
      { Name: "Sent Items", Info: 0, to: "/CPD/Messages?location=sent" },
      { Name: "Draft", Info: 0, to: "/CPD/Messages?location=drafts" },
    ],
    to: "/CPD/Messages?location=inbox",
  },
  {
    Name: "Help",
    Icon: <BsPersonPlus />,
    SubMenu: [],
    to: "/Help",
  },
];

export const adminSidebarContent = [
  {
    Name: "Dashboard",
    Icon: <AiOutlineStock />,
    SubMenu: [],
    to: "/CPD/Dashboard",
  },
  {
    Name: "Tickets",
    Icon: <HiOutlineTicket />,
    SubMenu: [
      { Name: "Open", Info: 4, to: "/CPD/Tickets/Open" },
      { Name: "Resolved", Info: 0, to: "/CPD/Tickets/Resolved" },
      { Name: "Unresolved", Info: 0, to: "/CPD/Tickets/Unresolved" },
      { Name: "Unassigned", Info: 0, to: "/CPD/Tickets/Unassigned" },
      { Name: "Escalated", Info: 2, to: "/CPD/Tickets/Escalated" },
      { Name: "All", Info: 0, to: "/CPD/Tickets/All" },
    ],
    to: "/CPD/Tickets/All",
  },
  {
    Name: "Messages",
    Icon: <BiMessageSquareDetail />,
    SubMenu: [
      { Name: "Inbox", Info: 4, to: "/CPD/Messages?location=inbox" },
      { Name: "Sent Items", Info: 0, to: "/CPD/Messages?location=sent" },
      { Name: "Draft", Info: 0, to: "/CPD/Messages?location=drafts" },
    ],
    to: "/CPD/Messages?location=inbox",
  },
  {
    Name: "Reports",
    Icon: <TbReportSearch />,
    SubMenu: [],
    to: "/CPD/Reports",
  },
  {
    Name: "Configuration",
    Icon: <FiSettings />,
    SubMenu: [],
    to: "/CPD/Configuration/General",
  },
  {
    Name: "Help",
    Icon: <BsPersonPlus />,
    SubMenu: [],
    to: "/Help",
  },
  {
    Name: "Data & Statistics",
    Icon: <BsClipboard2Data />,
    SubMenu: [],
    to: "/CPD/DAS",
  },
];
