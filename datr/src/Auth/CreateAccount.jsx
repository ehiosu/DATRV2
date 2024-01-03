import React from "react";
import { AiFillStar, AiOutlineArrowDown } from "react-icons/ai";
import { useNavigate } from "react-router";
import Logo from "/NCAA.png";
export const CreateAccount = () => {
  const Navigate = useNavigate();
  return (
    <main className="w-full lg:min-h-screen lg:overflow-hidden   home-container lg:p-10 p-6 bg-white">
      <div className="w-full h-full ">
        <div className="w-full flex lg:flex-row flex-col items-center  justify-start text-center lg:h-20 h-28">
          <img src={Logo} alt="" className="w-56 h-44 object-contain bg-none" />
          <p className="lg:text-xl text-lg text-center w-[70%] font-bold text-[#000066]">
            Welcome
          </p>
        </div>

        <div className="lg:w-[75%] w-full h-full flex flex-col text-center mx-auto gap-2 p-2">
          <p className=" lg:text-xl text-lg font-bold text-[#000066]">
            Register with us to start your application.
          </p>
          {/* Form */}
          <form action="" className="my-2">
            {/* Personal Info */}
            <div className="flex flex-row items-center gap-4 w-full lg:h-8 h:16 my-3">
              <span className="h-[4px] lg:w-[45%] w-[40%] bg-gray-200/50"></span>
              <p className="min-w-[20%]  text-[#000066] font-semibold">
                Personal Information
              </p>
              <span className="h-[4px] lg:w-[45%] w-[40%] bg-gray-200/50 "></span>
            </div>

            <div className="flex justify-between w-full lg:gap-0 gap-4   flex-wrap">
              <div className="flex lg:gap-4 gap-1 items-center">
                <p className="text-[#000066] font-semibold w-max  sm:w-full ">Title</p>
                <div className="relative">
                  <button
                    type="button"
                    className="outline-none border-2 dropdownbtn border-gray-200 bg-white flex justify-center gap-2 p-2 items-center w-16 h-8 rounded-md"
                    onClick={(e) => e.preventDefault()}
                  >
                    Mr <AiOutlineArrowDown />
                  </button>
                  <div className="absolute dropdown h-auto w-40 rounded-md border-2 border-gray-200 shadow-md bg-white p-2">
                    <ul className="space-y-3">
                      <li>Mr</li>
                      <li>Mrs</li>
                      <li>Miss</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex lg:gap-2 gap-2  w-full">
                <p className="text-[#000066] font-semibold flex items-center whitespace-nowrap lg:gap-2 gap-0 h-10">
                  First Name <AiFillStar className="text-red-600" />
                </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="lg:w-72 w-full h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* second-layer */}
            <div className="flex lg:justify-between  w-full my-3 lg:gap-0 gap-4 lg:flex-row flex-col">
              <div className="flex justify-start flex-row lg:gap-2 lg:items-center items gap-4 ">
                <p className="text-[#000066] font-semibold flex items-center  lg:gap-2 gap-0 h-10 w-max text-left  lg:whitespace-normal whitespace-nowrap ">
                  Last Name <AiFillStar className="text-red-600 text-left" />
                </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-72 h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                  required
                />
              </div>
              <div className="flex gap-2">
                <p className="text-[#000066] font-semibold flex items-center gap-2 h-10 text-left lg:whitespace-normal  whitespace-nowrap ">
                  Middle Name{" "}
                </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-72 h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                />
              </div>
            </div>

            {/* third-layer */}
            <div className="flex  w-full my-3 gap-x-2">
              <div className="flex lg:gap-4   items-center  gap-2 flex-wrap w-full  ">
                <p className="text-[#000066] font-semibold flex items-center lg:gap-2 h-10 justify-start  my-2">
                  Proof of Identity <AiFillStar className="text-red-600" />
                </p>
                <div className="relative  w-full">
                  <button
                    type="button"
                    className="outline-none border-2 dropdownbtn border-gray-200 bg-white flex justify-center gap-2 p-2 items-center w-full md:w-auto h-8 rounded-md  "
                    onClick={(e) => e.preventDefault()}
                  >
                    Passport Number <AiOutlineArrowDown />
                  </button>
                  <div className="absolute dropdown h-auto w-40 rounded-md border-2 border-gray-200 shadow-md bg-white p-2 my-2">
                    <ul className="space-y-3">
                      <li>Passport Number</li>
                      <li>NIN</li>
                      <li>Driver's License</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex flex-row items-center gap-4 w-full h-8 mt-5">
              <span className="h-[4px] w-[45%] bg-gray-200/50"></span>
              <p className="min-w-[20%] text-[#000066] font-semibold">
                Company Information
              </p>
              <span className="h-[4px] w-[45%] bg-gray-200/50 "></span>
            </div>
            <div className="flex lg:justify-between  w-full my-3 lg:gap-4 gap-4 lg:flex-row flex-col">
              {/* First-Layer */}
              <div className="flex justify-start flex-row lg:gap-2 lg:items-center items gap-4 ">
                <p className="text-[#000066] font-semibold flex items-center  lg:gap-2 gap-0 h-10 w-max text-left ">
                  Trading Name <AiFillStar className="text-red-600 text-left" />
                </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-72 h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                  required
                />
              </div>
              <div className="flex gap-2">
                <p className="text-[#000066] font-semibold flex items-center  lg:gap-2 gap-0 h-10 w-max text-left ">
                  CAC NO. (RC)
                  <AiFillStar className="text-red-600 text-left" />
                </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-72 h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                />
              </div>
            </div>
            {/* Second-Layer */}
            <div className="flex lg:justify-between  w-full lg:my-3 lg:gap-4 gap-4 lg:flex-row flex-col my-4 ">
              <div className="flex  flex-row lg:gap-2 lg:items-center items-start gap-3">
                <p className="text-[#000066] font-semibold flex items-center  lg:gap-2 gap-0 h-16 w-max text-left ">
                  Official Email Address
                  <AiFillStar className="text-red-600 text-left" />
                </p>
                <input
                  type="email"
                  name=""
                  id=""
                  className="w-72 h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                />
              </div>
              <div className="flex  flex-row lg:gap-2 lg:items-center items-start gap-3">
                <p className="text-[#000066] font-semibold flex items-center  lg:gap-2 gap-0 h-10 w-max text-left ">
                  Official Phone Number
                  <AiFillStar className="text-red-600 text-left" />
                </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-72 h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                />
              </div>
            </div>
            {/* Third-Layer */}
            <div className="flex lg:justify-between  w-full my-3 lg:gap-4 gap-4 lg:flex-row flex-col">
              <div className="flex flex-row lg:gap-2 lg:items-center items-start gap-3 ">
                <p className="text-[#000066] font-semibold flex items-center  lg:gap-2 gap-0 h-12  text-left ">
                  Mobile <AiFillStar className="text-red-600 text-left" />
                </p>
                <input
                  type="email"
                  name=""
                  id=""
                  className="w-72 h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                  required
                />
              </div>
              <div className="flex  flex-row lg:gap-2 lg:items-center items-start gap-3">
                <p className="text-[#000066] font-semibold flex items-center  lg:gap-2 gap-0 h-10 w-max text-left ">
                  Office Location{" "}
                  <AiFillStar className="text-red-600 text-left" />
                </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-72 h-8 p-2 border-b-4 border-gray-200 outline-none text-sm"
                />
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-3 my-3">
              <p className="text-[#000066] font-semibold">
                We will send you an email to confirm the email address you
                provided here.
              </p>
              <div className="flex gap-3 ">
                <button
                  className="w-24 h-12 rounded-md bg-[#000066] text-white outline-none hover:bg-gray-200 hover:text-[#000066] transition-all hover:shadow-md "
                  onClick={() => Navigate("/Home")}
                >
                  Register
                </button>
                <button className="w-24 h-12 rounded-md text-black bg-gray-200 outline-none hover:bg-[#000066] hover:text-white" type="button" onClick={() => Navigate("/")}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
