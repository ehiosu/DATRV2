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
  const getUserGroupQuery = useQuery({
    queryKey: ["groups", "all"],
    queryFn: () =>
      axios("users/group", {
        method: "GET",
      })
        .then((resp) => resp.data)
        .catch((err) => err),
  });

  return (
    <AnimatePresence>
      <motion.section
        initial={{ scale: 0.1, opacity: 0 }}
        exit={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[90%]  mx-auto max-h-[80vh] md:overflow-y-auto flex flex-col p-2"
      >
        <div className="w-full my-5 shadow-md">
          {getUserGroupQuery.isSuccess && (
            <GeneralGroupTable data={getUserGroupQuery.data} />
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
