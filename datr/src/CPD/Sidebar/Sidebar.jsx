import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { cpoSidebarContent, adminSidebarContent, DGContent } from "./Content";
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
import { useAuth } from "../../api/useAuth";
export const Sidebar = () => {
  const { user } = useAuth();

  const getUserSidebarContent = () => {
    if (user.roles.includes("ADMIN")) return adminSidebarContent;
    if (user.roles.includes("DGO")) return DGContent;
    return cpoSidebarContent;
  };
  return (
    <section>
      <MidSizedSidebar content={getUserSidebarContent()} />
      <SmallSideBar content={getUserSidebarContent()} />
    </section>
  );
};
import { motion } from "framer-motion";
const MidSizedSidebar = ({ content }) => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <aside
      className={`md:block hidden max-h-[97vh] h-[97vh] fixed  overflow-y-auto left-0 z-[10]  top-[1.5vh] ${
        open ? "md:w-[26vw] lg:w-[12vw]" : "w-12 max-h-screen overflow-y-hidden"
      } transition-all mx-2 my-2 bg-white rounded-md shadow-md`}
    >
      {!open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          transition={{ ease: "easeInOut", duration: 0.7 }}
          className=" items-center "
        >
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="w-8 mx-auto mt-2 rounded-md flex items-center justify-center transition-colors duration-500  h-8 text-black bg-neutral-100 hover:bg-neutral-200"
          >
            <RxHamburgerMenu />
          </button>

          {content.map((item) => (
            <SidebarItem {...item} nav={nav} open={open} />
          ))}
        </motion.div>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className=" justify-center p-3 max-h-full overflow-y-auto"
        >
          <button
            onClick={() => {
              setOpen(close);
            }}
            className="w-8 rounded-md flex items-center justify-center transition-colors duration-500  h-8 text-black bg-neutral-100 hover:bg-neutral-200"
          >
            <AiOutlineClose className="text-black w-3 h-3 shrink" size={12} />
          </button>
          <div
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
          {content.map((item) => (
            <SidebarItem {...item} nav={nav} open={open} />
          ))}
        </motion.div>
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
import { Button } from "../../components/ui/button";
import { FaHamburger } from "react-icons/fa";
import { NcaaLogo } from "../../components/ui/NcaaLogo";
const SidebarItem = ({ Name, Icon, SubMenu, open, to, nav }) => {
  const [isCollapsibleOpen, setCollapsibleOpen] = useState(false);
  return (
    <div
      className={` my-3 w-full  ${open && "flex items-center gap-2"} ${
        open &&
        window.location.pathname !== to &&
        "hover:ring-2 hover:ring-blue-500/40 rounded-md hover:bg-neutral-100 hover:cursor-pointer hover:shadow-md"
      } ${
        open &&
        window.location.pathname === to &&
        SubMenu.length === 0 &&
        "border-b-4 border-b-purple-300/40 rounded-md bg-neutral-100 border-r-2 shadow-md hover:cursor-pointer border-r-blue-300"
      } relative ${!open && "aspect-square grid place-items-center my-5 "}`}
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
              }  rounded-md transition-colors hover:cursor-pointer ${
                !open && "p-1"
              }`}
            >
              {Icon}
            </TooltipTrigger>
            <TooltipContent
              className="shadow-md dark:bg-lightPink bg-lightPink text-white outline-none dark:outline-none border-none"
              side="right"
            >
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
              <CollapsibleTrigger
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`flex items-center w-full group `}
              >
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
