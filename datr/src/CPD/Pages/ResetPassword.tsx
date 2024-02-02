import React from "react";
import logo from "/NCAA.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
const ResetPassword = () => {
    const nav = useNavigate()
  return (
    <main className="w-full h-screen grid place-items-center relative overflow-hidden">
      <div className="lg:w-[35%] xl:w-[30%] md:w-[45%] w-[80%] h-[80%] p-2 bg-white shadow-md rounded-lg border-2 border-neutral-200 flex flex-col pt-2 pb-8">
        <img
          src={logo}
          className="w-[70%] mx-auto aspect-video object-contain "
          alt=""
        />
        <div className="flex-1 w-[80%] text-center mx-auto flex flex-col">
          <p className="text-[1.4rem] font-semibold text-neutral-700">
            Password Change Required
          </p>
          <p className="my-2 text-[0.77rem] text-neutral-400">
            In order to protect your account and the CPD system, you are
            required to change your default generated password on your first
            login.
          </p>
          <div className="flex gap-1 flex-col justify-start text-start">
            <p className="text-darkBlue text-[0.8rem]">New Password</p>
            <input
              type="text"
              name=""
              placeholder="New Password"
              className="w-full h-8 p-2 rounded-lg border-[1px] border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
              id=""
            />
          </div>

          <div className="flex gap-1 flex-col justify-start text-start my-4">
            <p className="text-darkBlue text-[0.8rem]">Re-Enter New Password</p>
            <input
              type="text"
              name=""
              placeholder="New Password"
              className="w-full h-8 p-2 rounded-lg border-[1px]  border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
              id=""
            />
          </div>
          <Button onClick={()=>{nav('/CPD/Dashboard')}} className=" w-full mt-auto dark:bg-darkBlue bg-darkBlue dark:text-white text-white dark:hover:bg-darkBlue hover:bg-darkBlue rounded-lg">Save & Continue</Button>

        </div>
      </div>
      <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1706869558/private/NCAALogo_l7hkhg.png" className="absolute bottom-0 w-[420px] aspect-square translate-y-1/2 right-0 translate-x-1/3 z-[-1]" alt="" />

    </main>
  );
};

export default ResetPassword;
