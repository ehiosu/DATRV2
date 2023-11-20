import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import tlogo from "/NCAA.png";
import { AiOutlineClose } from "react-icons/ai";
import { MdOpenInFull } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import useWindowSize from "./Hooks/useWindowSize";
import { useNavigate, Link } from "react-router-dom";
import { content as sidecont } from "./Content";
export const Sidebar = ({ content }) => {
  const Navigate = useNavigate();
  const navTo = (location) => {
    console.log("Navigating");
    Navigate(location);
  };
  content ? content : (content = sidecont);
  const screenSize = useWindowSize();
  let proportions = {};
  screenSize.screenSize == "small"
    ? (proportions = { open: "250px", closed: "50px" })
    : (proportions = { open: "220px", closed: "50px" });
  screenSize.screenSize == "extra large"
    ? (proportions = { open: "250px", closed: "75px" })
    : (proportions = proportions);
  const sidebarVariants = {
    open: {
      width: proportions.open,
      transition: { type: "linear" },
    },
    closed: {
      width: proportions.closed,
      transition: { type: "linear" },
    },
  };
  const xCoordRef = useRef(0);
  const handleSwipeStart = (event) => {
    xCoordRef.current = event.touches[0].clientX;
    console.log(xCoordRef.current);
  };
  const handleSwipeEnd = (event) => {
    const xCoord = event.changedTouches[0].clientX;
    console.log(xCoord + xCoordRef.current);
    console.log(xCoord);
    console.log(xCoordRef.current);
    if (xCoord < xCoordRef.current - 50) {
      setIsOpen(false);
    }
    if (xCoord > xCoordRef.current + 50) {
      setIsOpen(true);
    }
  };
  const [isOpen, setIsOpen] = useState(true);
  return (
    <section className={`max-h-screen md:relative fixed md:top-auto md:left-auto z-10 ${isOpen?'top-0  left-0':'top-4 left-4 '} `}>
      <AnimatePresence>
        
        <motion.div
          variants={sidebarVariants}
          initial="closed"
          animate={`${isOpen ? "open" : "closed"}`}
          className={`sidebar md:h-screen md:z-1  z-[1000] ${isOpen?'h-screen':'h-12  flex  md:items-start    items-center  justify-center  w-full   shadow-md'} bg-[#FFFF] bg-opacity-100 ${
            isOpen ? "p-2 " : "p-2"
          } lg:overflow-hidden overflow-y-scroll  `}
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
        >
          <div
            className={`${
              isOpen
                ? "w-[80%] flex justify-end items-center "
                : "w-full flex justify-center "
            } sticky  sm:z-40`}
          >
            {isOpen ? (
              <AiOutlineClose onClick={() => setIsOpen((isOpen) => !isOpen)} />
            ) : (
              <MdOpenInFull
                onClick={() => setIsOpen((isOpen) => !isOpen)}
                className=""
              />
            )}
          </div>
          <div>
            {isOpen && (
              <img
                src={tlogo}
                alt=""
                className="lg:w-44 w-40 h-auto mx-auto object-contain "
              />
            )}
          </div>

          <div className="grid grid-cols-2  h-full mt-4">
            {isOpen && (
              <div className="col-span-2  ">
                {content.length > 0 ? (
                  isOpen ? (
                    content.map((contnt, index) => {
                      return (
                        <SidebarContent
                          content={contnt}
                          key={index}
                          Navigate={navTo}
                        />
                      );
                    })
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
                <div className="w-[80%] ml-auto h-auto flex flex-col justify-start items-start  mt-1">
                  <p className="text-sm mt-2 font-semibold">Labels</p>
                  <div className="flex w-[80%] ml-auto text-sm items-center gap-2 ">
                    <p className="w-3 h-3 bg-[#FF5858] rounded-full"></p>
                    <p>Open</p>
                  </div>
                  <div className="flex w-[80%] ml-auto text-sm items-center gap-2">
                    <p className="w-3 h-3 bg-[#4DBF5D] rounded-full"></p>
                    <p>Resolved</p>
                  </div>
                  <div className="flex w-[80%] ml-auto text-sm items-center gap-2">
                    <p className="w-3 h-3 bg-[#F8C74D] rounded-full"></p>
                    <p>Unresolved</p>
                  </div>
                  <div className="flex w-[80%] ml-auto text-sm items-center gap-2">
                    <p className="w-3 h-3 bg-[#D116DD] rounded-full"></p>
                    <p>Escalated</p>
                  </div>
                  <div className="flex w-[80%] ml-auto text-sm items-center gap-2">
                    <p className="w-3 h-3 bg-[#707070] rounded-full"></p>
                    <p>Closed</p>
                  </div>
                </div>

                <div
                  className="flex w-[80%] ml-auto h-auto items-center gap-2 my-2 text-xl"
                  onClick={() => Navigate("/")}
                >
                  <CgLogOut className="bg-[#FF007C] rounded-full w-auto h-auto p-2 text-center text-white font-semibold text-2xl hover:scale-125 transition-[1s]" />
                  <p className="font-medium">Logout</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  ) 
};

export const SidebarContent = ({ content }) => {
  const Navigate = useNavigate();
  const HandleNavigate = (location) => {
    console.log(location);
    Navigate(location);
  };
  return (
    //

    <div className="  w-full  lg:w-[80%] ml-auto h-auto flex flex-col justify-start items-start  mt-1">
      <div
        className={`flex lg:gap-6 gap-2 justify-center items-center ${
          window.location.pathname.includes(content["to"])
            ? "text-blue-400 font-semibold"
            : ""
        } `}
        onClick={() => HandleNavigate(content["to"])}
      >
        {content["Icon"]}
        <p className="font-medium">{content["Name"]}</p>
      </div>
      <div className="w-[80%] ml-auto p-1">
        {content["SubMenu"].length > 0 &&
          content["SubMenu"].map((menu, index) => {
            return (
              <div
                className={`flex w-[90%] justify-between ${
                  index == 0 ? "" : "mt-1"
                } items-center  hover:underline hover:underline-offset-2 hover:text-blue-400 text-xs`}
                key={index * 40}
              >
                <p
                  className={`${
                    window.location.pathname.includes(menu.to)
                      ? "text-[#27A7DD]"
                      : ""
                  }`}
                  onClick={() => HandleNavigate(menu["to"])}
                >
                  {menu["Name"]}
                </p>
                {menu["Info"] > 0 && (
                  <p className="lg:w-8 w-6 rounded-lg text-white h-5 text-center  bg-[#27A7DD] text-xs flex justify-center items-center">
                    {menu["Info"]}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
