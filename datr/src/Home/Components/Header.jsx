import React from "react";
import logo from "/NCAA.png";
import oip from "/OIP.jpg";
export const Header = () => {
  return (
    <div className="md:h-[15vh] w-full flex justify-center md:justify-between items-center md:flex-row flex-col h-[30vh]  md:gap-0 gap-2 ">
      <img
        src={logo}
        alt=""
        className="md:w-52 w-36 md:h-full object-contain"
      />
      <div className="flex flex-col md:h-full md:w-80 max-w-80 justify-center text-center text-[#000066] font-semibold  ">
        <p>Welcome</p>
        <p className="text-2xl ">Capt. Musa Shuaibu Nuhu</p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          name=""
          id=""
          className="shadow-md w-60 h-8 border-2 border-gray-300 outline-none rounded-md p-2 text-sm"
        />
        <div className="w-10 h-10 rounded-full border-2 border-gray-200 gap-2 overflow-hidden">
          <img src={oip} alt="" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};
