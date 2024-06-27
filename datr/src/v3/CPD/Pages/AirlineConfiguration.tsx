import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import { useAxiosClient } from "@/api/useAxiosClient.jsx";
import { GenericDataTable, airlineColumnDef } from "@/CPD/Components/DataTable";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AxiosError, AxiosResponse } from "axios";

export const AirlineConfiguration = () => {
  const dialogRef = useRef<HTMLButtonElement | null>(null);
  const { axios } = useAxiosClient();
  const getAirlineQuery = useQuery({
    queryKey: ["airlines", "all", "config"],
    queryFn: () =>
      axios("airlines/all", {
        method: "GET",
      })
        .then((resp: AxiosResponse) => resp.data)
        .catch((err: AxiosError) => {
          throw err;
        }),
  });
  return (
    <section className="w-full space-y-3 pb-6">
      <Dialog>
        <DialogTrigger ref={dialogRef} asChild>
          <button className="mt-2 w-max text-sm bg-ncBlue px-3 py-1.5 text-white rounded-lg">
            Add Airlines
          </button>
        </DialogTrigger>
        <DialogContent>
          <NewAirlineForm
            closeDialog={() => {
              dialogRef.current?.click();
              getAirlineQuery.refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      <div className="mx-auto w-max">
        <p className="px-1 py-1.5 text-lg font-semibold text-ncBlue border-b-2 border-b-ncBlue">
          Airlines
        </p>
      </div>
      {getAirlineQuery.isSuccess && (
        <div className="max-h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
          {" "}
          <GenericDataTable
            filterHeader="Airline Name"
            hasFilter
            filterColumn="airlineName"
            columns={airlineColumnDef}
            data={getAirlineQuery.data}
          />
        </div>
      )}
    </section>
  );
};

import * as z from "zod";
import { toast } from "sonner";
import { MdError } from "react-icons/md";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const NewAirlineForm = ({
  closeDialog,
}: {
  closeDialog: () => void;
}) => {
  const { axios } = useAxiosClient();

  const createAirlineMutation = useMutation({
    mutationFn: (value: {
      airlineName: string;
      contactAddress: string;
      contactNumber: string;
    }) =>
      axios("airlines/create", {
        method: "POST",
        data: value,
      })
        .then((resp: AxiosResponse) => resp.data)
        .catch((err: AxiosError) => {
          throw err;
        }),
  });

  const tryCreateNewAirline = (values: z.infer<typeof newAirlineSchema>) => {
    const data = {
      ...values,
      contactAddress: values.contactAddress || "",
      contactNumber: values.contactNumber || "",
    };
    toast.promise(
      new Promise((resolve, reject) =>
        createAirlineMutation.mutate(data, {
          onSuccess: (data) => {
            resolve(data);
            closeDialog();
          },
          onError: (err) => reject(err),
        })
      ),
      {
        loading: "Trying to create airline...",
        success: "Airline Created Successfully!",
        error: (error) => {
          return (
            <div className="text-black flex flex-col">
              <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                <MdError /> Error
              </p>
              <p>{error.response.data.message || error.response.data.detail}</p>
            </div>
          );
        },
      }
    );
  };

  const newAirlineSchema = z.object({
    airlineName: z.string().min(1, { message: "Enter a valid name!" }),
    contactAddress: z.string().optional(),
    contactNumber: z.string().optional(),
  });

  const newAirlineForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(newAirlineSchema),
  });

  return (
    <Form {...newAirlineForm}>
      <form
        className="space-y-3"
        onSubmit={newAirlineForm.handleSubmit(tryCreateNewAirline as any)}
      >
        <FormField
          name="airlineName"
          control={newAirlineForm.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Airline Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The name of the airline to be created.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="contactAddress"
          control={newAirlineForm.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Contact Address</FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The contact address of the airline (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="contactNumber"
          control={newAirlineForm.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The contact number of the airline (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <button
          disabled={Object.keys(newAirlineForm.formState.errors).length > 0}
          className="w-full h-8 flex flex-row items-center justify-center my-3 bg-neutral-100 hover:bg-lightPink transition-all duration-300 rounded-lg hover:text-white group disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:text-black"
        >
          Submit
          <Send className="ml-2 w-4 h-4 shrink flex flex-row items-center justify-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:duration-700 group-hover:disabled:opacity-0" />
        </button>
      </form>
    </Form>
  );
};
