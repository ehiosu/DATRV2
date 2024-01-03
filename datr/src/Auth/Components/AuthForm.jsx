import React, { useEffect, useRef, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { AiOutlineCheck } from "react-icons/ai";
import { useNavigate } from "react-router";
export const AuthForm = () => {
  const [emailError, setemailError] = useState("");
  const Navigate = useNavigate();
  const [email, setemail] = useState("");
  const emailinput = useRef(null);
  function updateinput(e) {
    if (e.target.name == "Email") {
      if (e.target.validity.valid && e.target.value.length > 0) {
        setemailError("Email looks good!");
      } else {
        setemailError("Enter a valid Email.");
      }
      if (e.target.value.length == 0) {
        setemailError("");
        document.getElementsByClassName("check").style.color = "red";
      }
      setemail(e.target.value);
    }
  }
  return (
    <section className="w-full h-full  md:mt-0 mt-10 p-10 ">
      <div className="mx-auto">
        <p className="lg:text-2xl text-3xl">Welcome Back</p>
      </div>
      <div className="flex md:gap-4 gap-8  flex-1 h-full md:flex-row flex-col mt-2   justify-center">
        <div className="flex-1  flex flex-col  justify-center p-2 md:gap-4 gap-12">
          <p className=" font-[25px] ">Staff Only</p>
          <button className="lg:w-[80%] w-full mx-auto bg-[#FF007C] h-12 text-white rounded-md  flex justify-center gap-2 items-center shadow-md lg:p-0"   onClick={() => {
                Navigate("/Home");
              }}>
            <span>Company Single Sign-On</span>{" "}
            <CiLogin className=" w-8 h-8 rounded-full p-1 hover:w-10 hover:h-10 text-sm hover:text-sm hover:p-2 hover:shadow-sm transition-[1s] bg-[#FFF] text-[#FF007C] hover:text-black " />{" "}
          </button>
        </div>

        <div className="flex-grow-[0.25] flex lg:flex-col justify-center items-center">
          <span className="line lg:h-[48%] bg-black lg:w-[2px] w-[40%] opacity-25  h-[2px]"></span>
          <span className="leading-10 text-xl lg:w-auto w-[50px]">OR</span>
          <span className="line lg:h-[48%]  w-[40%] bg-black lg:w-[2px] opacity-25 h-[2px]"></span>
        </div>
        <div className="flex-1  w-full">
          <div className="lg:w-[80%] w-full  flex flex-col lg:justify-start lg:items-start gap-2 justify-center items-start lg:mx-0 mx-auto">
            <label htmlFor="Email" className="text-blue-800">
              Email
            </label>
            <div className="w-full relative">
              <input
                type="email"
                ref={emailinput}
                onChange={(e) => updateinput(e)}
                name="Email"
                id="Email"
                placeholder="abc@gmail.com"
                className="border-2 border-opacity-40 rounded-md  customInput w-full h-10 p-2 "
              />
              <AiOutlineCheck className="absolute top-3 left-[88%] check " />
            </div>

            <p className={`${emailError ? "" : "mt-2"} text-blue-800`}>
              {emailError}
            </p>
            <label htmlFor="Password" className="text-blue-800 ">
              Password
            </label>
            <input
              type="password"
              name="Password"
              id="Password"
              className="w-full h-10 p-2 border-2 border-opacity-40 rounded-md"
              placeholder="password"
            />

            <button
              className={`w-full bg-[#000066] ${
                emailError ? "mt-4" : "mt-6"
              }  text-white h-12 rounded-md`}
             
            >
              Sign in
            </button>
            <p className="mx-auto mt-8 text-[#000066]">Forgot Password</p>
          </div>
        </div>
      </div>
    </section>
  );
};
