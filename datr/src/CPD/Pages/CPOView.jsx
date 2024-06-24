import React, { useEffect, useRef, useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { BsThreeDots } from "react-icons/bs";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { StatCard } from "../Components/DashboardStats";
import { cpoViewStats } from "../data/data";
import { CpoViewGraph } from "../Components/CpoViewGraph";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "../../components/ui/use-toast";

export const CPOView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const group = new URLSearchParams(useLocation().search).get("group");
  const { agent } = useParams();
  const { axios } = useAxiosClient();
  const updatedGroup = group.replaceAll("_", " ");
  const userQuery = useQuery({
    queryKey: ["user", agent],
    refetchOnMount: true,
    queryFn: () =>
      axios(`/users/${agent}`, {
        method: "GET",
      })
        .then((resp) => resp.data)
        .catch((err) => err),
  });
  return (
    <section className="w-full">
      {userQuery.isSuccess && userQuery.data && (
        <UserCard group={group} id={agent} user={userQuery.data} />
      )}

      <div className="flex items-center flex-wrap gap-4 justify-evenly ">
        {cpoViewStats.map((stat, index) => (
          <StatCard className="w-[9rem] aspect-square" key={index} {...stat} />
        ))}
      </div>
      <div className="h-[40vh] w-full bg-white rounded-lg border-[2px] border-neutral-200  flex flex-col p-3">
        <p className="text-[1.4rem] font-semibold w-full p-2 border-b-2 border-b-neutral-200">
          Tickets
        </p>
        <CpoViewGraph />
      </div>
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

const UserCard = ({ group, user, id }) => {
  const { axios } = useAxiosClient();
  const client = useQueryClient();
  const [newRole, setNewRole] = useState("");
  if (!user) return <></>;
  const changeRoleMutation = useMutation({
    mutationKey: ["role"],
    mutationFn: () =>
      axios("/admin/upgrade", {
        method: "PUT",
        data: {
          ncaaUserEmail: user.email,
          role: newRole,
        },
      })
        .then((resp) => {
          toast({
            title: "Success!",
            description: "User Successfully upgraded!",
          });
          client.invalidateQueries({ queryKey: ["user", id] });
          return resp.data;
        })
        .catch((err) => {
          toast({
            title: "Error!",
            description:
              err.message === "Request failed with status code 400"
                ? "Role doesn't exist!"
                : err.message === "Request failed with status code 415"
                ? "This is the user's current role."
                : err.message,
            variant: "destructive",
          });
        }),
  });
  return (
    <div className="flex  my-3 px-2 gap-4 items-center flex-wrap ">
      <div className="w-20 aspect-square rounded-full overflow-hidden ">
        <img
          src={
            user.imageUrl ||
            "https://th.bing.com/th/id/OIP.xo-BCC1ZKFpLL65D93eHcgHaGe?rs=1&pid=ImgDetMain"
          }
          className="w-full aspect-square rounded-full object-cover"
          alt="User Image"
        />
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-[1rem] font-semibold text-black">
          {user.firstName}, {user.lastName}
        </p>
        <p className="text-neutral-400 text-[0.725rem]">{user.id}</p>
        <p className="text-[0.65rem]  text-blue-500">{user.email}</p>
      </div>

      <div className="flex flex-col space-y-1 items-center justify-center">
        <p className="w-max px-6 bg-darkBlue text-white rounded-full py-1 text-xs font-bold">
          {user.roles[user?.roles.length - 1]}
        </p>

        <AlertDialog>
          <AlertDialogTrigger className="text-xs font-semibold hover:text-blue-300 text-neutral-400">
            Change Role
          </AlertDialogTrigger>
          <AlertDialogContent className="text-center">
            <p className="text-[1.4rem] font-semibold text-neutral-700">
              Change User Role
            </p>
            <p className="my-2 text-[0.77rem] text-neutral-400">
              Doing this will revoke access to or grant the user access to
              certain modules and/ or features of the system.
            </p>

            <p className="block font-semibold text-[0.9275rem] text-neutral-600 text-start">
              Select a new Role
            </p>
            <Select
              onValueChange={(value) => {
                setNewRole(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="New Role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CPO">Consumer Protection Officer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="TERMINAL_SUPERVISOR">
                  Terminal Supervisor
                </SelectItem>
                <SelectItem value="SHIFT_SUPERVISOR">
                  Shift Supervisor
                </SelectItem>
                <SelectItem value="DATA_STATISTIC">
                  Data and Statistics Officer
                </SelectItem>
                <SelectItem value="DGO"> Director General</SelectItem>
                <SelectItem value="CPD_D">CPD Director</SelectItem>
                <SelectItem value="CPD_GM">CPD General Manager</SelectItem>
              </SelectContent>
            </Select>
            <AlertDialogFooter>
              <AlertDialogAction
                className="flex-grow"
                onClick={() => {
                  changeRoleMutation.mutate();
                }}
              >
                Save
              </AlertDialogAction>
              <AlertDialogCancel className="flex-grow">
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
