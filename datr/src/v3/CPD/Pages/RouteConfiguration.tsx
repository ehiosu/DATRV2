import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import { useAxiosClient } from "@/api/useAxiosClient.jsx";
import { GenericDataTable, routesColumnDef } from "@/CPD/Components/DataTable";
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

export const RouteConfiguration = () => {
  const dialogRef = useRef<HTMLButtonElement | null>(null);
  const { axios } = useAxiosClient();
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
  return (
    <section className="w-full space-y-3 pb-6">
      <Dialog>
        <DialogTrigger ref={dialogRef} asChild>
          <button className="mt-2 w-max text-sm bg-ncBlue px-3 py-1.5 text-white rounded-lg">
            Add Routes
          </button>
        </DialogTrigger>
        <DialogContent>
          <NewRouteForm
            closeDialog={() => {
              dialogRef.current?.click();
              getRoutesQuery.refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      <div className="mx-auto w-max">
        <p className="px-1 py-1.5 text-lg font-semibold text-ncBlue border-b-2 border-b-ncBlue">
          Airlines
        </p>
      </div>
      {getRoutesQuery.isSuccess && (
        <div className="max-h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
          {" "}
          <GenericDataTable
            filterHeader="Route Name"
            hasFilter
            filterColumn="routeName"
            columns={routesColumnDef}
            data={getRoutesQuery.data}
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

const NewRouteForm = ({ closeDialog }: { closeDialog: () => void }) => {
  const { axios } = useAxiosClient();
  const createRouteMutation = useMutation({
    mutationFn: (value: { name: string; abbreviation: string }) =>
      new Promise((resolve, reject) =>
        axios("route/add", {
          method: "POST",
          data: value,
        })
          .then((resp: any) => resolve(resp))
          .catch((err: any) => reject(err))
      ),
  });
  const tryCreateNewRoute = (values: z.infer<typeof newRouteSchema>) => {
    toast.promise(
      new Promise((resolve, reject) =>
        createRouteMutation.mutate(
          { abbreviation: values.name, ...values },
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
        loading: "Trying to create route...",
        success: "Route Created Successfully!",
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

  const newRouteSchema = z.object({
    name: z.string().min(1, {
      message: "Enter a valid name!",
    }),
  });
  const newRouteForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(newRouteSchema),
  });
  return (
    <Form {...newRouteForm}>
      <form
        className="space-y-3"
        onSubmit={newRouteForm.handleSubmit(tryCreateNewRoute as any)}
      >
        <FormField
          name="name"
          control={newRouteForm.control}
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
                  The name of the route to be created.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <button
          disabled={Object.keys(newRouteForm.formState.errors).length > 0}
          className="w-full h-8 flex flex-row items-center justify-center my-3 bg-neutral-100 hover:bg-lightPink transition-all duration-300 rounded-lg hover:text-white group disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:text-black"
        >
          Submit
          <Send className="ml-2 w-4 h-4 shrink flex flex-row items-center justify-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:duration-700 group-hover:disabled:opacity-0" />
        </button>
      </form>
    </Form>
  );
};

// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useAxiosClient } from "@/api/useAxiosClient";
// import React, { useRef } from "react";
// import { AxiosError, AxiosResponse } from "axios";
// import { GenericDataTable, routesColumnDef } from "@/CPD/Components/DataTable";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { BiError } from "react-icons/bi";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// export const RouteConfiguration = () => {
//   const dialogRef = useRef<HTMLButtonElement | null>(null);
//   const { axios } = useAxiosClient();
//   const queryClient = useQueryClient();

//   const getRoutesQuery = useQuery({
//     queryKey: ["routes", "all"],
//     queryFn: () =>
//       axios("routes", {
//         method: "GET",
//       })
//         .then((resp: AxiosResponse) => resp.data)
//         .catch((err: AxiosError) => {
//           throw err;
//         }),
//   });

//   const newRouteFormSchema = z.object({
//     name: z.string().min(1, { message: "Name is required." }),
//     abbreviation: z.string().min(1, { message: "Abbreviation is required." }),
//   });

//   const newRouteForm = useForm({
//     resolver: zodResolver(newRouteFormSchema),
//   });

//   // const addRouteMutation = useMutation({
//   //   mutationFn: (values: { name: string; abbreviation: string }) =>
//   //     axios.post("admin/routes/add", {
//   //       name: values.name.trim(),
//   //       abbreviation: values.abbreviation.trim(),
//   //     }),
//   //   onSuccess: () => {
//   //     queryClient.invalidateQueries({ queryKey: ["routes"] });
//   //     newRouteForm.reset();
//   //     dialogRef.current?.click();
//   //     toast.success("Route created successfully!");
//   //   },
//   //   onError: (error: AxiosError) => {
//   //     toast.error(
//   //       <div className="text-black flex flex-col">
//   //         <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
//   //           <BiError /> Error
//   //         </p>
//   //         <p>
//   //           {(error.response?.data as { message?: string })?.message ||
//   //             "An error occurred"}
//   //         </p>
//   //       </div>
//   //     );
//   //   },
//   // });

//   // const onSubmit = (values: { name: string; abbreviation: string }) => {
//   //   addRouteMutation.mutate(values);
//   // };

//   return (
//     <section className="w-full space-y-3 pb-6">
//       <Dialog>
//         <DialogTrigger ref={dialogRef} asChild>
//           <button className="mt-2 w-max text-sm bg-ncBlue px-3 py-1.5 text-white rounded-lg">
//             Add Route
//           </button>
//         </DialogTrigger>
//         <DialogContent className="flex flex-col">
//           <Form {...newRouteForm}>
//             <form className="flex flex-col">
//               <FormField
//                 name="name"
//                 // control={newRouteForm.control}
//                 render={({ field }) => (
//                   <FormItem className="my-2">
//                     <FormLabel className="text-darkBlue font-semibold text-[0.8275rem]">
//                       Name
//                     </FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="Route Name" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 name="abbreviation"
//                 // control={newRouteForm.control}
//                 render={({ field }) => (
//                   <FormItem className="my-2">
//                     <FormLabel className="text-darkBlue font-semibold text-[0.8275rem]">
//                       Abbreviation
//                     </FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="Abbreviation" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <button
//                 type="submit"
//                 // disabled={addRouteMutation.isPending}
//                 className="block h-8 mt-4 bg-darkBlue text-white hover:cursor-pointer hover:bg-purple-400 transition-colors hover:ring-2 hover:ring-offset-4 rounded-md hover:ring-purple-300 disabled:bg-neutral-100 hover:disabled:bg-neutral-100"
//               >
//                 Submit
//               </button>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//       {/* <div className="mx-auto w-max">
//         <p className="px-1 py-1.5 text-lg font-semibold text-ncBlue border-b-2 border-b-ncBlue">
//           Routes
//         </p>
//       </div> */}
//       {getRoutesQuery.isSuccess && (
//         <div className="max-h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
//           <GenericDataTable
//             columns={routesColumnDef}
//             data={getRoutesQuery.data}
//           />
//         </div>
//       )}
//     </section>
//   );
// };
