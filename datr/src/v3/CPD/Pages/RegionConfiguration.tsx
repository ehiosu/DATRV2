import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import { useAxiosClient } from "@/api/useAxiosClient";
import {
  GenericDataTable,
  TerminalDataTable,
  generalRegionColumnDef,
} from "@/CPD/Components/DataTable";
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

export const RegionConfiguration = () => {
  const dialogRef = useRef<HTMLButtonElement | null>(null);
  const { axios } = useAxiosClient();
  const getRegionsQuery = useQuery({
    queryKey: ["regions", "all"],
    queryFn: () =>
      axios("regions/all", {
        method: "GET",
      }).then((resp: any) => resp.data),
  });
  return (
    <section>
      <Dialog>
        <DialogTrigger ref={dialogRef} asChild>
          <button className="mt-2 w-max text-sm bg-ncBlue px-3 py-1.5 text-white rounded-lg">
            Add Region
          </button>
        </DialogTrigger>
        <DialogContent>
          <NewRegionForm
            closeDialog={() => {
              dialogRef.current?.click();
              getRegionsQuery.refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      <div className="mx-auto w-max">
        <p className="px-1 py-1.5 text-lg font-semibold text-ncBlue border-b-2 border-b-ncBlue">
          Regions
        </p>
      </div>
      {getRegionsQuery.isSuccess && (
        <div className="max-h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
          <GenericDataTable
            filterHeader="Region Name"
            hasFilter
            filterColumn="regionName"
            columns={generalRegionColumnDef}
            data={getRegionsQuery.data}
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

const NewRegionForm = ({ closeDialog }: { closeDialog: () => void }) => {
  const { axios } = useAxiosClient();
  const createRegionMutation = useMutation({
    mutationKey: ["region", "new"],
    mutationFn: (value: { regionName: string }) =>
      new Promise((resolve, reject) =>
        axios("regions/create", {
          method: "POST",
          data: value,
        })
          .then((resp: any) => resolve(resp))
          .catch((err: any) => reject(err))
      ),
  });

  const tryCreateRegion = (values: z.infer<typeof newRegionSchema>) => {
    toast.promise(
      new Promise((resolve, reject) =>
        createRegionMutation.mutate(values, {
          onSuccess: (data: any) => {
            resolve(data);
            closeDialog();
          },
          onError: (err) => reject(err),
        })
      ),
      {
        loading: "Trying to create region...",
        success: "Region Created Successfully!",
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

  const newRegionSchema = z.object({
    regionName: z.string().min(1, {
      message: "Enter a valid region name!",
    }),
  });

  const newRegionForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(newRegionSchema),
  });

  return (
    <Form {...newRegionForm}>
      <form
        className="space-y-3"
        onSubmit={newRegionForm.handleSubmit(tryCreateRegion as any)}
      >
        <FormField
          name="regionName"
          control={newRegionForm.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Region Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The name of the region to be created.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <button
          disabled={Object.keys(newRegionForm.formState.errors).length > 0}
          className="w-full h-8 flex flex-row items-center justify-center my-3 bg-neutral-100 hover:bg-lightPink transition-all duration-300 rounded-lg hover:text-white group disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:text-black"
        >
          Submit
          <Send className="ml-2 w-4 h-4 shrink flex flex-row items-center justify-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:duration-700 group-hover:disabled:opacity-0" />
        </button>
      </form>
    </Form>
  );
};
