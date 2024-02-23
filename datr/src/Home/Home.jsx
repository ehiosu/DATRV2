import React, { useEffect, useState } from "react";
import { Header } from "./Components/Header";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Navigate, redirect, useNavigate } from "react-router";
import audio from "/1.mp3";
import { useAuth } from "../api/useAuth";
import { useAuthStore } from "../store/AuthStore";

export const Home = () => {
  const nav = useNavigate();
  const Nav = (to) => {
    if (user.roles.includes("USER")) {
      return;
    } else {
      nav(to);
    }
  };
  // const { access } = useAuth();
  const { access, user } = useAuth();
  if (!access) return <Navigate to={"/"} />;

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
    <main className="w-full lg:h-screen overflow-x-hidden px-4 md:px-10 py-4 lg:overflow-y-auto">
      <Header />

      <div className=" w-full h-[20vh] md:h-[15vh] text-white text-center text-lg md:text-3xl font-semibold bg-[#000066] rounded-lg  p-2  relative grid place-items-center">
        <p className="flex items-center justify-center    sm:text-lg">
          DIRECTORATE OF AIR TRANSPORT REGULATION
        </p>
        <div className="flex justify-end w-full   absolute  right-4 bottom-4">
          <button className="w-40 flex text-sm gap-2 items-center justify-end">
            Dashboard <AiOutlineArrowRight />
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 grid-flow-row md:gap-8 gap-4 mt-4 md:mt-10 md:grid-cols-2 grid-cols-2 h-auto ">
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
    </main>
  );
};
