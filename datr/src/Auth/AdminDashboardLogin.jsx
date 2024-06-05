import React, { useEffect } from "react";
import logo from "/NCAALogo.png";
import tlogo from "/NCAA.png";
import { AuthForm } from "./Components/AuthForm";
import { useNavigate } from "react-router";
import { NcaaLogo } from "../components/ui/NcaaLogo";

export const AdminDashboardLogin = () => {
  const Navigate = useNavigate();
  return (
    <main className="md:max-h-screen min-h-screen overflow-hidden  overfloverflow-x-hidden max-w-[100vw] md:overflow-y-hidden h-auto  text-center relative">
      <img
        src={
          "https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"
        }
        alt=""
        className="absolute  opacity-30 left-0 -translate-x-1/3 w-[140px] md:w-[440px] top-0 -translate-y-1/4 z-[-1]"
      />
      <section className="grid grid-cols-4 lg:h-[25vh] max-w-full ">
        <div className="logo-img col-span-1 ">
          {/* <img
            src={logo}
            alt=""
            className="absolute  opacity-30 md:top-[-5%] md:right-[77%] object-fit md:w-[460px] md:h-[460px] w-[250px] h-[250px] right-[80%] top-[-10%] "
          /> */}
        </div>
        <div className="col-span-4  md:mt-10">
          <div className="    items-center md:justify-center justify-center gap-4 md:gap-0 flex ">
            {/* <img
              src={tlogo}
              alt=""
              className="  object-contain ml-auto md:ml-52 md:mt-12 md:w-[300px] p-2 w-[200px] "
            /> */}
            <NcaaLogo
              ContainerClassName={
                "w-64 items-center  ml-auto md:translate-x-1/3"
              }
              imageClassName={"w-32 aspect-square"}
              textClassName={"text-[1.2rem] font-semibold text-darkBlue"}
            />
            <div className="flex flex-col gap-4 items-end justify-end  ml-auto">
              <button
                className=" md:w-36 md:h-16 w-20 h-16 lg:hover:w-48 hover:w-24  transition-[1s] shadow-md  rounded-l-md rounded-tl-md bg-[#3968FF] hover:bg-[#FFF]  hover:text-[#3968FF]  text-white text-center"
                onClick={() => Navigate("/Create-Account")}
              >
                Create account
              </button>

              <button className="md:w-36 md:h-16 w-20 h-16 shadow-md p-2 rounded-l-md hover:w-24 rounded-tl-md  lg:hover:w-48  transition-[1s] hover:bg-[#3968FF] text-[#3968FF] hover:text-white">
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="lg:w-[80vw] w-full mx-auto lg:h-[45vh] h-auto p-2 lg:mt-0 mt-4">
        <AuthForm />
      </div>
      {/* <div className="h-0 lg:h-auto">
        <img
          src={logo}
          alt=""
          className="md:ml-[85vw] md:h-[530px] md:w-[530px] relative z-[-1] -translate-y-[40%] ml-[60%]  object-contain lg:-translate-y-48  opacity-30"
        />
      </div> */}
      <img
        src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"
        alt=""
        className="absolute w-[320px] right-0 translate-x-1/2 bottom-0  opacity-30 z-[-1]"
      />
    </main>
  );
};
