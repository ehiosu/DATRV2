import React, { useEffect, useState } from "react";
import { Header } from "./Components/Header";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Navigate, useNavigate } from "react-router";
import audio from "/1.mp3";
import { useAuth } from "../api/useAuth";
import { useVerified } from "../api/useVerified";
import welcome from "/welcome.png";
import { Home as LucideHome } from "lucide-react";
export const Home = () => {
  const nav = useNavigate();
  const verified = useVerified();

  const Nav = (to) => {
    if (!user.roles.includes("USER")) {
      return;
    } else {
      nav(to);
    }
  };
  const { access, user } = useAuth();
  if (!access) return <Navigate to={"/"} />;
  if (!verified) return <Navigate to={"/Verify"} />;

  useEffect(() => {
    const onMouseMove = () => {
      if (sound) {
        sound.play();
        sound.loop = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchstart", onMouseMove);
      }
    };

    // Create an audio element and set its source
    const sound = new Audio(audio); // Replace with the path to your audio file

    // Add a mousemove event listener
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onMouseMove);

    // Clean up when the component unmounts
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onMouseMove);

      if (sound) {
        sound.pause();
      }
    };
  }, []);

  return (
    <main className="w-full lg:h-screen overflow-x-hidden px-4 md:px-10 py-4 lg:overflow-y-auto flex flex-col">
      <div className=" w-full h-[20vh] md:h-[15vh] text-white text-center text-lg md:text-3xl font-semibold bg-[#000066] rounded-lg  p-2  relative grid place-items-center">
        <p className="flex items-center justify-center    sm:text-lg">
          DIRECTORATE OF AIR TRANSPORT REGULATION
        </p>
        <div className=" justify-end w-full   absolute  right-4 bottom-4 hidden">
          <button className="w-40 flex text-sm gap-2 items-center justify-end">
            Dashboard <AiOutlineArrowRight />
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 grid-flow-row md:gap-8 gap-4 mt-4 md:mt-10 md:grid-cols-2 grid-cols-2 h-auto hidden">
        <div
          className="relative col-span-1  h-[9rem] md:h-[12rem] aspect-square hover:scale-x-110 hover:scale-y-105 transition-all mx-auto hover:drop-shadow-xl rounded-lg overflow-hidden duration-300 ease-in-out hover:z-10 bg-white"
          onClick={() => Nav("/CPD/Dashboard")}
        >
          <div className="w-full h-full department bg-[#000066]/70 bg-opacity-60  blur-md"></div>
          <div className="w-full h-full bg-[#000066]/70 hover:bg-blue-400/70 transition-all duration-300 ease-in-out absolute top-0 text-white text-[0.9rem] md:text-xl text-center  flex justify-center items-center p-4">
            <p className="w-full"> CONSUMER PROTECTION DEPARTMENT</p>
          </div>
        </div>

        <div
          className="relative col-span-1  h-[9rem] md:h-[12rem] aspect-square  hover:scale-x-110 hover:scale-y-105 transition-all hover:drop-shadow-xl rounded-lg overflow-hidden duration-300 ease-in-out bg-white mx-auto"
          onClick={() => {
            Nav("/ATO/Home");
          }}
        >
          <div className="w-full h-full department bg-[#000066]/70 bg-opacity-60  blur-md"></div>
          <div className="w-full h-full bg-[#000066]/70 hover:bg-blue-400/70 transition-all duration-300 ease-in-out absolute top-0 text-white text-[0.75rem] md:text-xl text-center  flex justify-center items-center p-4">
            <p className="w-full"> AIR TRANSPORT OPERATION DEPARTMENT</p>
          </div>
        </div>

        <div className="relative col-span-1  h-[9rem] md:h-[12rem] aspect-square hover:scale-x-110 hover:scale-y-105 transition-all hover:drop-shadow-xl rounded-lg overflow-hidden duration-300 ease-in-out bg-white mx-auto">
          <div className="w-full h-full department bg-[#000066]/70 bg-opacity-60  blur-md"></div>
          <div
            className="w-full h-full bg-[#000066]/70 hover:bg-blue-400/70 transition-all duration-300 ease-in-out absolute top-0 text-white text-[0.75rem] md:text-xl text-center  flex justify-center items-center p-4"
            onClick={() => {
              Nav("/CAS/Dashboard");
            }}
          >
            <p className="w-[80%]"> COMMERCIAL & STATISTICS DEPARTMENT</p>
          </div>
        </div>
        <div className="relative col-span-1  h-[9rem] md:h-[12rem] aspect-square hover:scale-x-110 hover:scale-y-105 transition-all hover:drop-shadow-xl rounded-lg overflow-hidden duration-300 ease-in-out bg-white mx-auto">
          <div className="w-full h-full department bg-[#000066]/70 bg-opacity-60  blur-md"></div>
          <div
            className="w-full h-full bg-[#000066]/70 hover:bg-blue-400/70 transition-all duration-300 ease-in-out absolute top-0 text-white text-[0.75rem] md:text-xl text-center  flex justify-center items-center p-4"
            onClick={() => {
              Nav("/ERF/Home");
            }}
          >
            <p className="w-full">
              {" "}
              ECONOMIC REGULATION & FACILITATIN DEPARTMENT
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1  flex justify-center space-x-8 items-center">
        <img className="w-[40%] object-contain" src={welcome} alt="" />
        <div className="flex flex-col ">
          <p className="text-[2.7rem] tracking-wider font-bold text-center">
            Go To Dashboard!
          </p>
          <p className="md:w-[18rem] w-[13rem] mx-auto text-sm text-neutral-500 leading-7 text-center">
            You've logged in successfully,click on the button below to navigate
            to the CPD Dashboard
          </p>
          <button
            onClick={() => {
              nav("/CPD/Dashboard");
            }}
            className="mx-auto mt-4 w-40 rounded-full text-sm px-2 hover:w-44 flex flex-row items-center justify-center space-x-2 h-9 group bg-neutral-200 hover:bg-lightPink hover:text-white transition-all"
          >
            <LucideHome className="w-4 h-4 shrink opacity-0 group-hover:opacity-100 mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
};
