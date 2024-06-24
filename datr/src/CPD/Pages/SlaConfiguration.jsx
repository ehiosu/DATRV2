import { TabsContent } from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";

import React, { createContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { AiOutlinePlus } from "react-icons/ai";
import {
  GeneralSlaDataTable,
  GenericDataTable,
  slaGeneralColumnDef,
} from "../Components/DataTable";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import SelectionContext from "../context/SelectionContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { CgClose } from "react-icons/cg";
import { toast } from "sonner";
import { Skeleton } from "../../components/ui/skeleton";

export const SlaConfiguration = () => {
  const [selectedSlas, setSelectedSlas] = useState([]);
  const nav = useNavigate();
  const { axios } = useAxiosClient();
  const slaQuery = useQuery({
    queryKey: ["sla", "all"],
    queryFn: () =>
      axios("admin/sla", {
        method: "GET",
      }).then((resp) => {
        return resp.data;
      }),
  });
  const deleteSla = () => {
    const slaLength = selectedSlas.length;
    const promises = selectedSlas.map((slaName) => {
      const name = slaName.trim().replaceAll(" ", "_");
      console.log(name);
      return axios(`admin/sla/remove?name=${name}`, {
        method: "DELETE",
      })
        .then((resp) => {
          slaQuery.refetch();
          return resp; // Return the response so it can be handled downstream if needed
        })
        .catch((err) => {
          console.error(`Error deleting SLA '${slaName}':`, err); // Log the error for debugging
          slaQuery.refetch();
          throw err; // Re-throw the error so it can be caught by toast.promise
        });
    });

    toast.promise(Promise.all(promises), {
      loading: `Trying to delete ${slaLength} SLA(s)...`,
      success: `Deleted ${slaLength} SLA(s) `,
      error: `Error deleting ${slaLength} SLA(s)`,
    });
  };
  return (
    <SelectionContext.Provider value={{ selectedSlas, setSelectedSlas }}>
      <AnimatePresence>
        <motion.section
          initial={{ opacity: 0 }}
          exit={{ scale: 0.1, opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-[90%]  mx-auto mt-4 md:overflow-y-auto flex flex-col"
        >
          <p className="font-[600] text-[1.1rem] ">SLA Configuration</p>

          <div className="flex items-center gap-2 my-2">
            <button
              className="w-36 text-sm p-2 rounded-lg h-9 bg-ncBlue  text-white flex justify-between items-center"
              onClick={() => {
                nav("/CPD/Configuration/Sla/New");
              }}
            >
              Add New SLA
              <AiOutlinePlus />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="w-28 h-10 bg-neutral-200 text-black rounded-md font-semibold disabled:bg-neutral-400 disabled:cursor-not-allowed transition"
                  disabled={selectedSlas.length === 0}
                >
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="w-full flex items-center justify-end ">
                  <AlertDialogCancel className="px-3 ">
                    <CgClose className="h-4 w-4 shrink" />
                  </AlertDialogCancel>
                </div>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                  <AlertDialogDescription>
                    You're about to delete {selectedSlas.length} {"SLA(s)"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteSla();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="w-full mt-4 shadow-md">
            {slaQuery.isLoading ? (
              <Skeleton className="w-full h-[60vh]" />
            ) : (
              slaQuery.isSuccess && (
                <div className="h-[40vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
                  {" "}
                  <GenericDataTable
                    tableClassname=""
                    headerClassname="rounded-lg"
                    filterHeader="Sla Name"
                    columns={slaGeneralColumnDef}
                    data={slaQuery.data || []}
                    filterColumn="slaName"
                    hasFilter
                  />
                </div>
              )
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </SelectionContext.Provider>
  );
};
