import React, { useRef, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible.tsx";
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
} from "../../components/ui/alert-dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient.jsx";
import { ChevronUp } from "lucide-react";
import { BsSave } from "react-icons/bs";
import { toast } from "sonner";
import { BiError } from "react-icons/bi";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
export const TicketRequestType = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const { axios } = useAxiosClient();
  const dialogCloseRef = useRef(null);

  const newRequestTypeFormSchema = z.object({
    category: z.string("Select a category!"),
    complaintName: z
      .string()
      .min(1, {
        message: "Complaint name must be at least one character long.",
      })
      .max(12, {
        message: "Complaint type can't be longer than 12 characters.",
      }),
  });

  const newRequestTypeForm = useForm({
    resolver: zodResolver(newRequestTypeFormSchema),
  });
  const getGroupedData = (data) => {
    let res = {};
    data.map((datum) => {
      if (res[datum.category]) {
        res[datum.category].push(datum);
      } else {
        res[datum.category] = [datum];
      }
    });
    return res;
  };
  const getAllComplaintsQuery = useQuery({
    queryKey: ["complaints", "all"],
    queryFn: () =>
      axios("admin/complaints/all", {
        method: "GET",
      }).then((resp) => {
        return getGroupedData(resp.data);
      }),
  });

  const updateTicketRequestsMutation = useMutation({
    mutationKey: ["ticket", "requests", "update"],
    mutationFn: () =>
      new Promise((resolve, reject) =>
        axios("admin/complaints/status", {
          method: "PUT",
          data: {
            ids: selectedIds,
          },
        })
          .then((resp) => resolve(resp))
          .catch((err) => reject(err))
      ),
  });
  const addTicketRequestMutation = useMutation({
    mutationKey: ["ticket", "request", "new"],
    mutationFn: (values) =>
      new Promise((resolve, reject) =>
        axios("admin/complaints/add", {
          method: "POST",
          data: {
            category: values.category.trim(),
            complaintName: values.complaintName.trim(),
          },
        })
          .then((resp) => resolve(resp.data))
          .catch((err) => reject(err))
      ),
  });
  const addTicketRequest = (values) => {
    dialogCloseRef.current?.click();
    const getRequestPromise = () => {
      return new Promise((resolve, reject) =>
        addTicketRequestMutation.mutate(values, {
          onError: (err) => reject(err),
          onSuccess: (data) => {
            resolve(data);
            getAllComplaintsQuery.refetch();
            newRequestTypeForm.reset();
          },
        })
      );
    };
    toast.promise(getRequestPromise(), {
      loading: "Trying to create request...",
      success: "Request Type created Successfully!",
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
    });
  };
  const tryUpdateTicketRequests = () => {
    toast.promise(
      new Promise((resolve, reject) =>
        updateTicketRequestsMutation.mutate(
          {},
          {
            onSuccess: (data) => {
              getAllComplaintsQuery.refetch();
              resolve(data);
            },
            onError: (err) => reject(err),
          }
        )
      ),
      {
        loading: "Trying to update request types...",
        success: "Ticket Request Types Updated Successfully!",
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
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-[1rem] ml-2 font-semibold ">Request Type</p>
      <AlertDialog>
        <AlertDialogTrigger className="w-max px-4 flex gap-3 items-center bg-blue-300 rounded-md text-white h-max py-2">
          Add New Request
          <AiOutlinePlus className="text-[0.95rem]" />
        </AlertDialogTrigger>
        <AlertDialogContent className="flex flex-col">
          <AlertDialogCancel
            ref={dialogCloseRef}
            className="w-max ml-auto border-none"
          >
            <AiOutlineClose />
          </AlertDialogCancel>
          <Form {...newRequestTypeForm}>
            <form
              onSubmit={newRequestTypeForm.handleSubmit(addTicketRequest)}
              className="flex flex-col"
            >
              <FormField
                name="category"
                control={newRequestTypeForm.control}
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormLabel className="text-darkBlue font-semibold text-[0.8275rem]">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aiirline problem">
                            Airline Problems
                          </SelectItem>
                          <SelectItem value="service issues">
                            Service Issues
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="complaintName"
                control={newRequestTypeForm.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="md:w-[20%] text-darkBlue font-semibold text-[0.8275rem]">
                      Request
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Rude Staff"
                        className="dark:focus:outline-transparent dark:focus:ring-transparent dark:focus-within:ring-transparent dark:focus:ring-offset-transparent "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={addTicketRequestMutation.isPending}
                className="block h-8 mt-4 bg-darkBlue text-white hover:cursor-pointer hover:bg-purple-400 transition-colors hover:ring-2  hover:ring-offset-4  rounded-md hover:ring-purple-300 disabled:bg-neutral-100 hover:disabled:bg-neutral-100"
              >
                Submit
              </button>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-full max-h-[50vh] transition-all overflow-y-auto">
        <div className="pl-10 pr-3 flex justify-between items-center bg-neutral-300 py-2">
          <p className="text-[0.8275rem] font-bold">Request Type</p>
        </div>
        {getAllComplaintsQuery.isSuccess && (
          <TicketManager
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            data={getAllComplaintsQuery.data}
          />
        )}
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div
            role="button"
            className="w-[7.2rem] p-1 hover:w-36 transition-all group whitespace-nowrap text-white rounded-md bg-lightPink  flex flex-row items-center justify-center h-9"
          >
            Save Changes
            <BsSave className="w-4 h-4 shrink mt-1 ml-2 group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                tryUpdateTicketRequests();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const TicketManager = ({ data, setSelectedIds, selectedIds = [] }) => {
  const toggleAdd = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((state) => state.filter((_id) => _id != id));
      return;
    } else {
      let _temp = [...selectedIds];
      _temp.push(id);
      setSelectedIds(_temp);
    }
  };
  return (
    <div className="w-full flex-1 max-h-[60vh] flex flex-col">
      {Object.keys(data).map((groupName) => {
        return (
          <Collapsible key={groupName} className="flex flex-col">
            <CollapsibleTrigger className="w-full flex flex-row items-center pr-3 pl-10 group h-8 bg-[#EAECFA]">
              <ChevronUp
                className={`w-4 h-4 shrink group-data-[state=${
                  open ? "open" : "close"
                }]:font-bold group-data-[state=${
                  open ? "open" : "close"
                }]:rotate-180 transition-all mt-1`}
              />
              <p>{groupName.replace("_", " ")}</p>
              <input type="checkbox" className="rounded-full ml-auto" />
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full  items-center justify-between  group flex flex-col">
              {data[groupName].map((requestType, index) => (
                <div
                  className={`${
                    index % 2 === 1 && "bg-neutral-200"
                  } w-full flex h-8 pr-3 pl-10 text-sm items-center justify-between`}
                  key={index}
                >
                  <p>{requestType.complaintName || "empty"}</p>
                  <input
                    type="checkbox"
                    onClick={() => {
                      toggleAdd(requestType.id);
                    }}
                    defaultChecked={requestType.active}
                    className="rounded-full ml-auto"
                  />
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
