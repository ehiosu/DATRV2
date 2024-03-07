import { TabsContent } from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { GeneralGroupTable } from "../Components/DataTable";
import {
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";

export const UserGroupConfiguration = () => {
  const { axios } = useAxiosClient();
  const allUsersQuery = useQuery({
    queryKey: ["group", "all"],
    queryFn: () =>
      axios("/users/all?page=0&size=10", {
        method: "GET",
      })
        .then((resp) => resp.data)
        .catch((err) => err),
  });
  const cposQuery = useQuery({
    queryKey: ["group", "cpos"],
    retry: false,
    queryFn: () =>
      axios("/cpo/all", {
        method: "GET",
      }).then((resp) => resp.data),
  });
  const terminalSupervisorsQuery = useQuery({
    queryKey: ["groups", "Terminal_Supervisors"],
    retry: false,
    queryFn: () =>
      axios("/supervisors/all", {
        method: "GET",
      }).then((resp) => {
        console.log(resp.data);
        return resp.data;
      }),
  });
  return (
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%]  mx-auto max-h-[80vh] md:overflow-y-auto flex flex-col p-2"
      >
        <AlertDialog>
          <AlertDialogTrigger className="bg-darkBlue text-white flex items-center gap-2 justify-center h-9 w-32 rounded-md">
            <AiOutlinePlus />
            New Group
          </AlertDialogTrigger>
          <AlertDialogContent className="flex flex-col ">
            <AlertDialogCancel className="ml-auto">
              <AiOutlineClose />
            </AlertDialogCancel>
            <AlertDialogHeader className="text-[1.2rem] font-semibold text-darkBlue">
              New Group
            </AlertDialogHeader>
            <GroupName />
            <SlaType />
            <Textarea
              placeholder="Group description"
              className="placeholder:text-neutral-400 placeholder:text-[0.67rem] text-[0.75rem] text-neutral-500 resize-none focus:outline-none focus-within:outline-none dark:focus:outline-none dark:focus-within:outline-none"
            ></Textarea>
            <div className="flex flex-wrap items-center gap-2">
              <AlertDialogAction className="flex-1  bg-darkBlue h-9 hover:bg-white hover:text-darkBlue hover:shadow-sm transition-all hover:border-2 hover:border-darkBlue">
                Submit
              </AlertDialogAction>
              <AlertDialogCancel className="flex-1  h-9 bg-lightPink rounded-md text-white hover:bg-purple-500 transition-colors">
                Cancel
              </AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <div className="w-full my-5 shadow-md">
          {terminalSupervisorsQuery.isSuccess &&
            cposQuery.isSuccess &&
            allUsersQuery.isSuccess && (
              <GeneralGroupTable
                data={[
                  {
                    groupName: "Consumer Protection Officers",
                    groupDescription: "Short Description of group Properties",
                    members: cposQuery.data.length.toString(),
                  },
                  {
                    groupName: "Terminal Supervisors",
                    groupDescription: "Short Description of group Properties",
                    members: terminalSupervisorsQuery.data.length.toString(),
                  },
                  {
                    groupName: "All",
                    groupDescription:
                      "List of All Users contained in the system",
                    members:
                      allUsersQuery.data.ncaaUserResponseDtoList.length.toString(),
                  },
                ]}
              />
            )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

const SlaType = () => {
  return (
    <div className="flex items-center gap-2 ">
      <Label
        htmlFor="type"
        className="text-[0.75rem] text-darkBlue  flex items-center gap-1 whitespace-nowrap"
      >
        Sla Type <span className="text-red-400 text-[1rem] ml-1">*</span>
      </Label>
      <Select>
        <SelectTrigger id="type" className="lg:w-60">
          <SelectValue
            placeholder="medium priority"
            className="font-semibold"
          />
        </SelectTrigger>
        <SelectContent></SelectContent>
      </Select>
    </div>
  );
};
const GroupName = () => {
  return (
    <div className="flex items-center gap-2 ">
      <Label
        htmlFor="name"
        className="text-[0.75rem] text-darkBlue w-max flex items-center whitespace-nowrap"
      >
        Group Name <span className="text-red-400 text-[1rem] ml-1">*</span>
      </Label>
      <Input
        placeholder="User/Supervisory Department"
        id="name"
        className="text-[0.9rem] text-neutral-500 px-2 lg:w-60"
      />
    </div>
  );
};
