import React, {  useState } from "react";
import { BiArchiveIn, BiBell, BiTrashAlt } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import img from "/OIP.jpg";
import { motion } from "framer-motion";
import useWindowSize from "../CPD/Sidebar/Hooks/useWindowSize";

export const Header = ({
  toggleSearch,
  image,
  Modal,
  setModal,
  header,
  attachment,
  onclick,
  customCSS
}) => {
  image ? image : (image = img);
  const [isSearching, SetIsSearching] = useState(false);
  const updateSearch = () => {
    toggleSearch((isSearching) => !isSearching);
    SetIsSearching((isSearching) => !isSearching);
  };

  const toggleDropdown = () => {
    let state = Modal == "Profile" ? "None" : "Profile";
    setModal((Modal) => state);
  };

  let dropdownSize = null;
  const screensize = useWindowSize();
  console.log(screensize);
  screensize.screenSize == "small" &&
    (dropdownSize = { height: "300px", opacity: 1 });
  screensize.screenSize == "large" &&
    (dropdownSize = { height: "250px", opacity: 1 });
  screensize.screenSize == "extra large" &&
    (dropdownSize = { height: "250px", opacity: 1 });

  return (
    <motion.section
      className="w-full overflow-hidden sm:h-auto sm:p-1 lg:min-h-[10vh]  h-auto"
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1 }}
    >
      <div className=" flex lg:flex-row flex-col lg:gap-0 gap-6 justify-between  lg:items-center">
        {!isSearching && (
          <p className={`font-semibold  text-[2rem] md:text-xl ${customCSS}`} onClick={() => onclick()}>
            {header}{" "}
            <span className="text-xs text-blue-400 mx-2">{attachment}</span>
          </p>
        )}
        {!isSearching && (
          <div className="flex justify-between items-center w-28 text-lg ">
            <BiArchiveIn />
            <BiBell />
            <BiTrashAlt />
          </div>
        )}
        {/* absolute right-auto w-[50%] transition-[1s]  */}
        <div
          className={`flex   ${
            isSearching
              ? "w-full relative z-10 overflow-hidden justify-between"
              : "w-auto gap-2"
          } items-center`}
        >
          <motion.input
            type={"text"}
            className={` ${
              isSearching ? "  lg:w-[60%] w-[90%] fixed z-10  " : "lg:w-80"
            } input transition-[1s] rounded-lg shadow-md  focus:border-transparent focus:bg-transparent p-2 outline-none `}
            onFocus={() => updateSearch()}
            onBlur={() => updateSearch()}
          ></motion.input>
          <AiOutlineSearch
            className={`text-2xl relative lg:right-80 right-52 ${
              isSearching ? "opacity-0" : ""
            }`}
          />

          <img
            src={image}
            alt=""
            className="w-8 h-8 0bject-contain rounded-full  relative  z-[1000]"
            onClick={() => toggleDropdown()}
          />
          {Modal === "Profile" && (
            <motion.div
              className="absolute z-[1000]  h-max w-52 bg-white rounded-lg shadow-lg lg:top-24 top-40 right-5 p-2"
              initial={{ y: -200, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              exit={{ y: -200, opacity: 0 }}
            >
              <div className="h-12 flex justify-center items-center ">
                <p className="font-bold">Peter Olu Musa </p>
              </div>
              <div className="h-12 flex justify-center items-center">
                <p className="text-sm hover:text-blue-300">Account Settings </p>
              </div>
              <div className="h-12 flex justify-center items-center">
                <p className="text-sm hover:text-blue-300">Logout </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      {isSearching && (
        <div className="w-full ">
          <motion.div
            whileInView={{ height: `${dropdownSize.height}`, opacity: 1 }}
            initial={{ height: "0", opacity: 0 }}
            transition={{ duration: 1 }}
            className=" input  lg:w-[60%] w-[100%] bg-[#FFF] rounded-b-lg shadow-lg flex flex-col justify-start p-3 mt-2"
          >
            <div className="w-full h-[50%] flex justify-start">
              <p>Suggested Search</p>
            </div>
            <div className="w-full h-[50%] flex justify-start">
              <p>Attachments</p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
};
