import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { content } from "./Content";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Command } from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { BsThreeDots } from "react-icons/bs";
import { MdCancel, MdDashboard } from "react-icons/md";
import { Clipboard, Search, TimerOff } from "lucide-react";
import { TbMapPinCancel } from "react-icons/tb";
import { useAirlineContext } from "../Layout/DASLayout";
import { NcaaLogo } from "../../components/ui/NcaaLogo";

export const Sidebar = () => {
  return (
    <>
      <MidSizedSidebar />
      <SmallSideBar />
    </>
  );
};

const MidSizedSidebar = () => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { Location } = useParams();
  return (
    <aside
      className={`md:block hidden max-h-[97vh] h-[97vh] overflow-y-auto sticky top-[1.5vh] ${
        open ? "md:w-[26vw] lg:w-[14vw]" : "w-12"
      } transition-all mx-2 my-2 bg-white rounded-md shadow-md`}
    >
      {!open && (
        <div className="flex flex-col items-center p-3">
          <RxHamburgerMenu
            onClick={() => {
              setOpen(true);
            }}
          />
          <SearchItem open={open} />
          {content.map((item) => (
            <SidebarItem {...item} nav={nav} open={open} />
          ))}
          <SidebarItem
            open={open}
            Name={"Dashboard"}
            nav={nav}
            Icon={<MdDashboard className="text-black" />}
            SubMenu={[]}
            to={`/DAS/${Location}/Dashboard`}
          />
          <SidebarItem
            open={open}
            Name={"Delays"}
            nav={nav}
            Icon={<TimerOff color="black" className="text-black " />}
            SubMenu={[]}
            to={`/DAS/${Location}/Delays`}
          />
          <SidebarItem
            open={open}
            Name={"Cancelled Flights"}
            nav={nav}
            Icon={<MdCancel color="black" className="text-black " />}
            SubMenu={[]}
            to={`/DAS/${Location}/Cancelled`}
          />
          <SidebarItem
            open={open}
            Name={"Flight Disruption Reports"}
            nav={nav}
            Icon={<Clipboard color="black" className="text-black " />}
            SubMenu={[]}
            to={`/DAS/${Location}/FDR-Reports`}
          />
        </div>
      )}

      {open && (
        <div className="flex flex-col justify-center p-3 max-h-full overflow-y-auto">
          <AiOutlineClose
            onClick={() => {
              setOpen(close);
            }}
          />
          <div
            className=""
            role="button"
            onClick={() => {
              nav("/CPD/Dashboard");
            }}
          >
            <NcaaLogo
              ContainerClassName={"w-full my-3"}
              imageClassName={"h-8 aspect-square"}
              textClassName={"text-sm text-darkBlue "}
            />
          </div>
          <SearchItem open={open} />

          {content.map((item) => (
            <SidebarItem {...item} nav={nav} open={open} />
          ))}
          <SidebarItem
            open={open}
            Name={"Dashboard"}
            nav={nav}
            Icon={
              <MdDashboard className="text-black group-hover:text-blue-300" />
            }
            SubMenu={[]}
            to={`/DAS/${Location}/Dashboard`}
          />
          <SidebarItem
            open={open}
            Name={"Delays"}
            nav={nav}
            Icon={
              <TimerOff
                className="text-black  group-hover:text-blue-300"
                size={12}
              />
            }
            SubMenu={[]}
            to={`/DAS/${Location}/Delays`}
          />
          <SidebarItem
            open={open}
            Name={"Cancelled Flights"}
            nav={nav}
            Icon={<MdCancel color="black" className="text-black " />}
            SubMenu={[]}
            to={`/DAS/${Location}/Cancelled`}
          />
          <SidebarItem
            open={open}
            Name={"Flight Disruption Reports"}
            nav={nav}
            Icon={<Clipboard color="black" className="text-black " />}
            SubMenu={[]}
            to={`/DAS/${Location}/FDR-Reports`}
          />
        </div>
      )}
    </aside>
  );
};
const SmallSideBar = () => {
  const nav = useNavigate();
  return (
    <Sheet>
      <SheetTrigger className="fixed top-10 z-10 left-3 w-8 aspect-square grid place-items-center bg-white shadow-md md:hidden  ">
        <RxHamburgerMenu />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        {content.map((item) => (
          <SidebarItem {...item} nav={nav} open={open} />
        ))}
      </SheetContent>
    </Sheet>
  );
};

const SearchItem = ({ open }) => {
  const dialogFunctions = useAirlineContext();
  useEffect(() => {
    const down = (e) => {
      if (e.ctrlKey && e.key == "s") {
        e.preventDefault();
        e.stopPropagation();
        console.log("pressed");
        dialogFunctions.toggle();
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <div
      role="button"
      className={`h-7 group flex flex-row items-center space-x-2 ${
        open ? " w-max pl-2 pr-8" : "justify-center w-7 "
      } rounded-lg mt-2 bg-neutral-100`}
      onClick={() => dialogFunctions.setOpen(true)}
    >
      <Search className="w-5 h-5 opacity-20 group-hover:opacity-100 transition duration-500 ease-out rounded-md shrink group-hover:bg-neutral-200 p-1" />
      {open && <p className="text-sm text-neutral-500">Search</p>}
    </div>
  );
};
const SidebarItem = ({ Name, Icon, SubMenu, open, to, nav }) => {
  return (
    <div
      className={`flex items-center gap-2 my-3 group hover:text-blue-300 ${
        open &&
        window.location.pathname !== to &&
        "hover:ring-2 hover:ring-blue-500/40 rounded-md hover:bg-neutral-100 hover:cursor-pointer hover:shadow-md"
      } ${
        open &&
        window.location.pathname === to &&
        "border-b-4 border-b-purple-300/40 rounded-md bg-neutral-100 border-r-2 shadow-md hover:cursor-pointer border-r-blue-300"
      } relative`}
      onClick={() => {
        nav(to);
      }}
    >
      {!open ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className={`text-[1.4rem] font-thin   ${
                !open
                  ? window.location.pathname == to
                    ? "bg-neutral-100 text-blue-600 ring-2"
                    : "hover:ring-blue-400 hover:ring-2 hover:text-blue-600 "
                  : ""
              }  rounded-md p-2 transition-colors hover:cursor-pointer`}
            >
              {Icon}
            </TooltipTrigger>
            <TooltipContent
              className="shadow-md dark:bg-lightPink bg-lightPink outline-none dark:outline-none border-0"
              side="right"
            >
              <p className="text-xs ">{Name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span
          className={`text-[1.4rem] font-thin   ${
            !open
              ? window.location.pathname == to
                ? "bg-neutral-100 text-blue-600 ring-2"
                : "hover:ring-blue-400 hover:ring-2 hover:text-blue-600 "
              : ""
          }  rounded-md p-2 transition-colors hover:cursor-pointer`}
        >
          {Icon}
        </span>
      )}
      {open && (
        <div className="flex items-center justify-between flex-1 p-2 ">
          <div className="flex flex-col text-black">
            <p className="text-[0.8275rem]">{Name}</p>
          </div>
          {SubMenu.length > 0 && (
            <Popover>
              <PopoverTrigger
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <BsThreeDots />
              </PopoverTrigger>
              <PopoverContent side="right" className="w-36 ml-2 ">
                {SubMenu.map((menu) => {
                  return (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        nav(menu.to);
                        e.target.blur();
                      }}
                      className={`my-2 text-center hover:cursor-pointer hover:text-blue-400 ${
                        window.location.pathname === menu.to &&
                        "bg-neutral-100 border-b-4 rounded-md border-b-purple-200/70"
                      }`}
                    >
                      <p className="text-[0.8275rem]">{menu.Name}</p>
                    </div>
                  );
                })}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
    </div>
  );
};
