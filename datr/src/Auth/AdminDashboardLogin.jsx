import React, { useEffect } from "react";
import logo from "/NCAALogo.png";
import tlogo from "/NCAA.png";
import { AuthForm } from "./Components/AuthForm";
import { useNavigate } from "react-router";

export const AdminDashboardLogin = () => {
  const Navigate=useNavigate()
  return (
    <main className="lg:max-h-[100vh] overflow-hidden  overfloverflow-x-hidden max-w-[100vw] lg:overflow-y-hidden h-auto overflow-y-scroll text-center">
      <section className="grid grid-cols-4 lg:h-[30vh] h-[25vh] max-w-full ">
        <div className="logo-img col-span-1 ">
          <img
            src={logo}
            alt=""
            className="absolute  opacity-30 lg:top-[-5%] lg:right-[77%] object-fit lg:w-[460px] lg:h-[460px] w-[250px] h-[250px] right-[80%] top-[-10%] "
          />
        </div>
        <div className="lg:col-span-3 col-span-4  lg:mt-10">
          <div className="flex w-full    items-center lg:justify-between justify-end gap-4 lg:gap-0">
            <img
              src={tlogo}
              alt=""
              className="  object-contain lg:ml-52 lg:mt-12 lg:w-[300px] p-2 w-[200px] "
            />
            <div className="flex flex-col gap-4 items-end justify-end">
              <button
                className=" lg:w-36 lg:h-16 w-20 h-16 lg:hover:w-48 hover:w-24  transition-[1s] shadow-md  rounded-l-md rounded-tl-md bg-[#3968FF] hover:bg-[#FFF]  hover:text-[#3968FF]  text-white text-center"
                onClick={() => Navigate("/Create-Account")}
              >
                Create account
              </button>

              <button className="lg:w-36 lg:h-16 w-20 h-16 shadow-md p-2 rounded-l-md hover:w-24 rounded-tl-md  lg:hover:w-48  transition-[1s] hover:bg-[#3968FF] text-[#3968FF] hover:text-white">
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="lg:w-[80vw] w-full mx-auto lg:h-[45vh] h-auto">
        <AuthForm />
      </div>
      <div className="h-0 lg:h-auto">
        <img
          src={logo}
          alt=""
          className="lg:ml-[85vw] lg:h-[530px] lg:w-[530px] relative z-[1] -translate-y-[40%] ml-[60%]  object-contain lg:-translate-y-48  opacity-30"
        />
      </div>
    </main>
  );
};
