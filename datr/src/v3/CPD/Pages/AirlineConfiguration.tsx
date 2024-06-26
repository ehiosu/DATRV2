import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/api/useAxiosClient";
import React, { useRef } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { GenericDataTable, airlineColumnDef } from "@/CPD/Components/DataTable";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const AirlineConfiguration = () => {
  const { axios } = useAxiosClient();
  const dialogRef = useRef<HTMLButtonElement | null>(null);
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

  const newAirlineFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
  });

  const newAirlineForm = useForm({
    resolver: zodResolver(newAirlineFormSchema),
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
          <Form {...newAirlineForm}>
            <form className="flex flex-col">
              <FormField
                name="name"
                // control={newAirlineForm.control}
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormLabel className="text-darkBlue font-semibold text-[0.8275rem]">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Airline Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                // disabled={addAirlineMutation.isPending}
                className="block h-8 mt-4 bg-darkBlue text-white hover:cursor-pointer hover:bg-purple-400 transition-colors hover:ring-2 hover:ring-offset-4 rounded-md hover:ring-purple-300 disabled:bg-neutral-100 hover:disabled:bg-neutral-100"
              >
                Submit
              </button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
