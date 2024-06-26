import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/api/useAxiosClient";
import React, { useRef } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { GenericDataTable, routesColumnDef } from "@/CPD/Components/DataTable";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BiError } from "react-icons/bi";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const RouteConfiguration = () => {
  const dialogRef = useRef<HTMLButtonElement | null>(null);
  const { axios } = useAxiosClient();
  const queryClient = useQueryClient();

  const getRoutesQuery = useQuery({
    queryKey: ["routes", "all"],
    queryFn: () =>
      axios("routes", {
        method: "GET",
      })
        .then((resp: AxiosResponse) => resp.data)
        .catch((err: AxiosError) => {
          throw err;
        }),
  });

  const newRouteFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    abbreviation: z.string().min(1, { message: "Abbreviation is required." }),
  });

  const newRouteForm = useForm({
    resolver: zodResolver(newRouteFormSchema),
  });

  // const addRouteMutation = useMutation({
  //   mutationFn: (values: { name: string; abbreviation: string }) =>
  //     axios.post("admin/routes/add", {
  //       name: values.name.trim(),
  //       abbreviation: values.abbreviation.trim(),
  //     }),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["routes"] });
  //     newRouteForm.reset();
  //     dialogRef.current?.click();
  //     toast.success("Route created successfully!");
  //   },
  //   onError: (error: AxiosError) => {
  //     toast.error(
  //       <div className="text-black flex flex-col">
  //         <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
  //           <BiError /> Error
  //         </p>
  //         <p>
  //           {(error.response?.data as { message?: string })?.message ||
  //             "An error occurred"}
  //         </p>
  //       </div>
  //     );
  //   },
  // });

  // const onSubmit = (values: { name: string; abbreviation: string }) => {
  //   addRouteMutation.mutate(values);
  // };

  return (
    <section className="w-full space-y-3 pb-6">
      <Dialog>
        <DialogTrigger ref={dialogRef} asChild>
          <button className="mt-2 w-max text-sm bg-ncBlue px-3 py-1.5 text-white rounded-lg">
            Add Route
          </button>
        </DialogTrigger>
        <DialogContent className="flex flex-col">
          <Form {...newRouteForm}>
            <form className="flex flex-col">
              <FormField
                name="name"
                // control={newRouteForm.control}
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormLabel className="text-darkBlue font-semibold text-[0.8275rem]">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Route Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="abbreviation"
                // control={newRouteForm.control}
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormLabel className="text-darkBlue font-semibold text-[0.8275rem]">
                      Abbreviation
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Abbreviation" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                // disabled={addRouteMutation.isPending}
                className="block h-8 mt-4 bg-darkBlue text-white hover:cursor-pointer hover:bg-purple-400 transition-colors hover:ring-2 hover:ring-offset-4 rounded-md hover:ring-purple-300 disabled:bg-neutral-100 hover:disabled:bg-neutral-100"
              >
                Submit
              </button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* <div className="mx-auto w-max">
        <p className="px-1 py-1.5 text-lg font-semibold text-ncBlue border-b-2 border-b-ncBlue">
          Routes
        </p>
      </div> */}
      {getRoutesQuery.isSuccess && (
        <div className="max-h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
          <GenericDataTable
            columns={routesColumnDef}
            data={getRoutesQuery.data}
          />
        </div>
      )}
    </section>
  );
};
