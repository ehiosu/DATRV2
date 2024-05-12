import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { cpoSidebarContent, adminSidebarContent } from "./Content";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router";
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
import { useAuth } from "../../api/useAuth";
export const Sidebar = () => {
  const { user } = useAuth();

  const getUserSidebarContent = () => {
    if (user.roles.includes("ADMIN")) return adminSidebarContent;
    return cpoSidebarContent;
  };
  return (
    <section>
      <MidSizedSidebar content={getUserSidebarContent()} />
      <SmallSideBar content={getUserSidebarContent()} />
    </section>
  );
};
const MidSizedSidebar = ({ content }) => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <aside
      className={`md:block hidden max-h-[97vh] h-[97vh] fixed  overflow-y-auto left-0 z-[10]  top-[1.5vh] ${
        open ? "md:w-[26vw] lg:w-[12vw]" : "w-12"
      } transition-all mx-2 my-2 bg-white rounded-md shadow-md`}
    >
      {!open && (
        <div className="flex flex-col items-center p-3">
          <RxHamburgerMenu
            onClick={() => {
              setOpen(true);
            }}
          />

          {content.map((item) => (
            <SidebarItem {...item} nav={nav} open={open} />
          ))}
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
            role="button"
            onClick={() => {
              nav("/CPD/Dashboard");
            }}
          >
            <img src="/NCAA.png" alt="NCAA Logo" className="my-2 w-[80%]" />
          </div>
          {content.map((item) => (
            <SidebarItem {...item} nav={nav} open={open} />
          ))}
        </div>
      )}
    </aside>
  );
};
const SmallSideBar = ({ content }) => {
  const nav = useNavigate();
  return (
    <Sheet>
      <SheetTrigger className="fixed top-10 z-10 left-3 w-8  aspect-square grid place-items-center bg-white shadow-md md:hidden  ">
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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../components/ui/collapsible";
import { ArrowDown } from "lucide-react";
const SidebarItem = ({ Name, Icon, SubMenu, open, to, nav }) => {
  const [isCollapsibleOpen, setCollapsibleOpen] = useState(false);
  return (
    <div
      className={`flex items-center gap-2 my-3 ${
        open &&
        window.location.pathname !== to &&
        "hover:ring-2 hover:ring-blue-500/40 rounded-md hover:bg-neutral-100 hover:cursor-pointer hover:shadow-md"
      } ${
        open &&
        window.location.pathname === to &&
        SubMenu.length === 0 &&
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
            <TooltipContent className="shadow-md" side="right">
              <p className="text-xs ">{Name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div
          className={`flex flex-col flex-1 p-2  ${
            window.location.pathname == to &&
            !isCollapsibleOpen &&
            "border-b-4 border-b-purple-300/40 rounded-md bg-neutral-100 border-r-2 shadow-md hover:cursor-pointer border-r-blue-300 "
          }`}
        >
          {SubMenu.length > 0 ? (
            <Collapsible onOpenChange={setCollapsibleOpen}>
              <CollapsibleTrigger className={`flex items-center w-full group `}>
                {Icon}
                <div
                  className="flex flex-col text-black ml-1 hover:text-blue-400"
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nav(to);
                  }}
                >
                  <p className="text-[0.8275rem]">{Name}</p>
                </div>
                <div className="ml-auto flex-1 flex flex-row  items-center justify-end">
                  <ArrowDown className="w-4 shrink h-4 group-data-[state=open]:rotate-180 transition-all duration-500 group-data-[state=open]:text-blue-500" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="">
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
                        "bg-neutral-100 border-b-4 rounded-md border-b-purple-200/70 shadow-sm "
                      }`}
                    >
                      <p className="text-[0.8275rem]">{menu.Name}</p>
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="flex flex-row items-center">
              {Icon}
              <div className="flex flex-col text-black ml-1 mr-auto">
                <p className="text-[0.8275rem]">{Name}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Implement Mini sidebar
