import React, { useEffect, useRef, useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { BsThreeDots } from "react-icons/bs";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { StatCard } from "../Components/DashboardStats";
import { cpoViewStats } from "../data/data";
import { CpoViewGraph } from "../Components/CpoViewGraph";
import { useNavigate } from "react-router";

export const CPOView = () => {
  return (
    <section className="w-full">
      <SearchPage heading={"User Groups"}>
        <BreadCrumb3
          data={[
            { title: "User Groups", index: 0, link: `/CPD/all_groups` },
            {
              title: "Customer Support",
              index: 1,
              link: "/CPD/user_groups?group=customer_support",
            },
            { title: "User Preview", index: 2 },
          ]}
        />
        <UserCard />
        <div className="flex items-center flex-wrap gap-4 justify-evenly ">
          {cpoViewStats.map((stat, index) => (
            <StatCard
              className="w-[9rem] aspect-square"
              key={index}
              {...stat}
            />
          ))}
        </div>
        <div className="h-[40vh] w-full bg-white rounded-lg border-[2px] border-neutral-200  flex flex-col p-3">
          <p className="text-[1.4rem] font-semibold w-full p-2 border-b-2 border-b-neutral-200">
            Tickets
          </p>
          <CpoViewGraph />
        </div>
      </SearchPage>
    </section>
  );
};

export const BreadCrumb = ({ last, previous, current }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`w-max transition-all  flex  px-6 space-x-2 py-2 items-center text-[0.9275rem] h-12 bg-white rounded-md shadow-md font-semibold border-b-[2px] border-b-neutral-200`}
    >
      <BsThreeDots
        className="mr-2"
        onClick={() => {
          setOpen((state) => !state);
        }}
      />
      {open && (
        <motion.div
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.05, type: "spring" }}
          initial={{ opacity: 0 }}
          className="flex items-center"
        >
          <p className="hover:cursor-pointer hover:text-blue-400 whitespace-nowrap">
            {last}
          </p>
          <span className="text-[1.1rem] font-bold mx-3 mb-1">{">"}</span>
          <p className="hover:cursor-pointer hover:text-blue-400 whitespace-nowrap">
            {previous}
          </p>
          <span className="text-[1.1rem] font-bold mx-3 mb-1">{">"}</span>
        </motion.div>
      )}
      <p className="text-blue-400  whitespace-nowrap">{current}</p>
    </div>
  );
};

const UserCard = () => {
  return (
    <div className="flex  my-3 px-2 gap-4 items-center flex-wrap">
      <div className="w-20 aspect-square rounded-full overflow-hidden ">
        <img
          src="https://cdn.leonardo.ai/users/be34e3d9-8456-49f8-b15a-dda75af03b5d/generations/7644e4fa-acce-4a9f-a06b-0595e0069f67/Leonardo_Diffusion_XL_user_avatar_image_0.jpg"
          className="w-full aspect-square rounded-full object-cover"
          alt="User Image"
        />
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-[1rem] font-semibold text-black">Ahmed Musa</p>
        <p className="text-neutral-400 text-[0.725rem]">#789989</p>
        <p className="text-[0.65rem]  text-blue-500">example@ncaacpd.com</p>
      </div>
      <div className="w-max h-8 rounded-full border-2 border-neutral-500 bg-neutral-200 grid place-items-center px-4 ">
        <p className="text-[0.725rem] text-neutral-600 whitespace-nowrap">
          User/Supervisory Department
        </p>
      </div>
    </div>
  );
};

const BreadCrumb2 = () => {
  const [hidden, setHidden] = useState(-1);
  return (
    <div
      className={`w-max  transition-all flex  px-4 py-2 items-center text-[0.9275rem] h-12 bg-white rounded-md shadow-md font-semibold border-b-[2px] border-b-neutral-200`}
    >
      <BsThreeDots
        className="mr-2"
        onClick={() => {
          setHidden(-1);
        }}
      />

      <BreadCrumbItem
        title={"User Groups"}
        hidden={hidden}
        index={0}
        setHidden={setHidden}
      />

      <BreadCrumbItem
        title={"Customer Support"}
        hidden={hidden}
        index={1}
        setHidden={setHidden}
      />

      <BreadCrumbItem
        title={"User Preview"}
        hidden={hidden}
        index={2}
        lastIndex={true}
      />
    </div>
  );
};

const BreadCrumbItem = ({
  index,
  hidden,
  title,
  link,
  lastIndex = false,
  setHidden,
}) => {
  if (index <= hidden) {
    return null;
  }
  return (
    <>
      <motion.p
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        initial={{ opacity: 0 }}
        className="hover:cursor-pointer hover:text-blue-400 whitespace-nowrap"
      >
        {title}
      </motion.p>
      {!lastIndex && (
        <span
          className="text-[1.1rem] font-bold mx-3 hover:cursor-pointer hover:text-red-500 hover:animate-pulse"
          onClick={() => {
            setHidden(index);
          }}
        >
          {">"}
        </span>
      )}
    </>
  );
};

export const BreadCrumb3 = ({ data }) => {
  const [hidden, setHidden] = useState(0); // Initially show all items
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const updateWidth = () => {
    let totalWidth = 0;
    itemRefs.current.forEach((ref, index) => {
      if (ref && index >= hidden) {
        console.log(ref.clientWidth);
        totalWidth += ref.clientWidth + 60;
      }
    });
    setContainerWidth(totalWidth);
  };
  useEffect(() => {
    // Calculate and update the width of the container
    if (containerRef.current) {
      updateWidth();
    }
  }, [hidden]);

  return (
    <motion.div
      ref={containerRef}
      animate={{ width: containerWidth }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex w-60 max-w-full  px-4 py-2 items-center text-xs md:whitespace-nowrap whitespace-pre-wrap  md:text-[0.9275rem] h-12 bg-white rounded-md shadow-md font-semibold border-b-[2px] border-b-neutral-200"
    >
      <BsThreeDots
        className="mr-2 w-10 mt-1 hover:cursor-pointer"
        onClick={() => setHidden(0)}
      />

      <AnimatePresence>
        {data.map(
          (breadcrumb, index) =>
            index >= hidden && (
              <NewBreadCrumbItem
                ref={(el) => (itemRefs.current[index] = el)}
                key={index}
                title={breadcrumb.title}
                link={breadcrumb.link}
                setHidden={() => setHidden(index + 1)}
                lastIndex={index === data.length - 1}
              />
            )
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NewBreadCrumbItem = React.forwardRef(
  ({ title, setHidden, lastIndex, link }, ref) => {
    const nav = useNavigate();
    return (
      <>
        <motion.p
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.1 }}
          onClick={() => {
            if (link) nav(link);
          }}
          className="hover:cursor-pointer hover:text-blue-400 whitespace-nowrap"
        >
          {title}
        </motion.p>
        {!lastIndex && (
          <span
            className="md:text-[1.1rem] text-[0.85rem] font-bold md:mx-3 mx-1 hover:cursor-pointer hover:text-red-500 hover:animate-pulse"
            onClick={setHidden}
          >
            {">"}
          </span>
        )}
      </>
    );
  }
);

BreadCrumbItem.displayName = "NewBreadCrumbItem";
