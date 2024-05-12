import React, { useState, useRef } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import {
  TerminalDataTable,
  generalTerminalData,
} from "../Components/DataTable";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router";
import { CgAdd } from "react-icons/cg";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { BiError, BiSend } from "react-icons/bi";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
export const DataAndStatisticsHome = () => {
  const { axios } = useAxiosClient();
  const nav = useNavigate();
  const search = useRef("");
  const dialogRef = useRef(null);
  // const handleFilter = (value) => {
  //   if (!value) {
  //     setFilteredData(generalTerminalData);
  //   } else {
  //     setFilteredData((state) =>
  //       state.filter((datum) =>
  //         datum.name.toLowerCase().includes(value.toLowerCase())
  //       )
  //     );
  //   }
  // };
  const navto = (to) => {
    nav(`/DAS/${to}/Dashboard`);
  };

  const getTerminalsQuery = useQuery({
    queryKey: ["terminals", "all"],
    queryFn: () =>
      axios("terminals/active", {
        method: "GET",
      }).then((resp) => {
        console.log(resp.data);
        return resp.data;
      }),
  });
  return (
    <section className="w-full max-h-screen p-2">
      <SearchPage
        SearchElement={() => {
          return (
            <div className="w-[340px] p-1 relative  outline-none">
              <input
                type="text"
                value={search.current}
                name=""
                onChange={(e) => {
                  // handleFilter(e.target.value);
                  search.current = e.target.value;
                }}
                className="w-full rounded-full border-2 border-gray-400  outline-none focus:outline-none focus-within:outline-none "
                placeholder="Search..."
                id=""
              />

              <AiOutlineSearch className="absolute top-1/2 -translate-y-1/2 right-4" />
            </div>
          );
        }}
        heading={"Data and Statistics Department"}
      >
        <AlertDialog>
          <AlertDialogTrigger ref={dialogRef} className="outline-none" asChild>
            <button className="group w-28 whitespace-nowrap transition-all duration-200  h-8 bg-neutral-100 hover:bg-lightPink hover:text-white   flex flex-row items-center justify-center text-[0.8275rem] rounded-full p-2 font-medium  hover:w-32 d">
              Add Terminal
              <CgAdd className="w-5 h-5 shrink ml-2 opacity-0 group-hover:opacity-100 transition duration-700 text-white " />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogCancel className="w-10 ml-auto text-[0.8275rem] p-1">
              <AiOutlineClose className="" size={14} />
            </AlertDialogCancel>
            <NewTerminalForm
              closeDialog={() => {
                dialogRef.current?.click();
                getTerminalsQuery.refetch();
              }}
            />
          </AlertDialogContent>
        </AlertDialog>

        {getTerminalsQuery.isSuccess && (
          <div className="w-[70%] mx-auto max-h-[60vh]">
            <TerminalDataTable data={getTerminalsQuery.data} navTo={navto} />
          </div>
        )}
      </SearchPage>
    </section>
  );
};
const NewTerminalForm = ({ closeDialog }) => {
  const { axios } = useAxiosClient();
  const createTerminalMutation = useMutation({
    mutationKey: ["terminal", "new"],
    mutationFn: (value) =>
      new Promise((resolve, reject) =>
        axios("terminals/add", {
          method: "POST",
          data: value,
        })
          .then((resp) => resolve(resp))
          .catch((err) => reject(err))
      ),
  });
  const tryCreateNewTerminal = (values) => {
    toast.promise(
      new Promise((resolve, reject) =>
        createTerminalMutation.mutate(
          { abbreviation: values.abbreviation.toUpperCase(), ...values },
          {
            onSuccess: (data) => {
              resolve(data);
              closeDialog();
            },
            onError: (err) => reject(err),
          }
        )
      ),
      {
        loading: "Trying to create terminal...",
        success: "Terminal Created Successfully!",
        error: (error) => {
          console.log(error.response.data.message);
          return (
            <div className="text-black flex flex-col">
              <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                <BiError /> Error
              </p>
              <p>{error.response.data.message || error.response.data.detail}</p>
            </div>
          );
        },
      }
    );
  };

  const newTerminalSchema = z.object({
    abbreviation: z
      .string()
      .min(1, {
        message: "Enter a valid abbreviation",
      })
      .length(3, {
        message: "Abbreviation must be 3 characters long",
      })
      .max(3, {
        message: "Abbreviation must not be more than 3 characters long.",
      }),
    name: z.string().min(1, {
      message: "Enter a valid name!",
    }),
  });
  const newTerminalForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(newTerminalSchema),
  });
  return (
    <Form {...newTerminalForm}>
      <form
        className="space-y-3"
        onSubmit={newTerminalForm.handleSubmit(tryCreateNewTerminal)}
      >
        <FormField
          name="abbreviation"
          control={newTerminalForm.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Abbreviation</FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  An Abbreviation for the termianl to be created.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="name"
          control={newTerminalForm.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The name of the termianl to be created.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <button
          disabled={Object.keys(newTerminalForm.formState.errors).length > 0}
          className="w-full h-8 flex flex-row items-center justify-center my-3 bg-neutral-100 hover:bg-lightPink transition-all duration-300 rounded-lg hover:text-white group disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:text-black"
        >
          Submit
          <BiSend className="ml-2 w-4 h-4 shrink flex flex-row items-center justify-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:duration-700 group-hover:disabled:opacity-0" />
        </button>
      </form>
    </Form>
  );
};
