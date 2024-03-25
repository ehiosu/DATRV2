import React, { useEffect } from "react";
import { AiFillStar, AiOutlineArrowDown } from "react-icons/ai";
import { SearchPage } from "../../Reusable/SearchPage";
import audio from "/2.mp3";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useAuth } from "../../api/useAuth";
import { useAxiosClient } from "../../api/useAxiosClient";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "../../components/ui/input";
import { FormDatePicker } from "../../components/Datepicker";
import { toast } from "../../components/ui/use-toast";
import { format } from "date-fns";
export const NewTicket = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const { axios } = useAxiosClient();
  if (!user.roles.includes("CPO") && !user.roles.includes("ADMIN")) {
    return <Navigate to={"/CPD/Dashboard"} />;
  }
  const getSlasQuery = useQuery({
    queryKey: ["slas", "all"],
    queryFn: () =>
      axios("admin/sla", {
        method: "GET",
      })
        .then((resp) => resp.data)
        .catch((err) => err),
  });
  const formSchema = z.object({
    complainantName: z.string().min(1, { message: "Enter a valid email!" }),
    complainantEmail: z
      .string()
      .min(1, { message: "Enter a valid Email!" })
      .email("Enter a valid email!"),
    complainantPhoneNo: z.string().length(11, {
      message: "Phone number must be 11 characters long!",
    }),
    complainantType: z.string().min(1, {
      message: "Select a valid complaint type",
    }),
    dateOfIncident: z.date("Select a date!"),
    timeOfIncident: z.string().min(3, {
      message: "Enter a valid time of occurence",
    }),
    route: z.string().min(1, { message: "Enter a valid Route!" }),
    sourceOfComplaint: z.string().min(1, { message: "Enter a valid source" }),
    complaintDetail: z.string(),
    redressSought: z.string(),
    attachmentUrls: z.string().array().optional().default([]),
    airline: z.string("Select an airline!").min(1, {
      message: "Ensure to select an Airline!",
    }),
    location: z.string("Select a location!").min(1, {
      message: "Ensure to select a Location!",
    }),
    priority: z.string("Select a Priority!").min(1, {
      message: "Ensure to select a priority!",
    }),
  });
  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const formSubmitMutation = useMutation({
    mutationFn: (values) => {
      console.log(values);
      return axios("tickets/create", {
        method: "Post",
        data: {
          ...values,
          cpoCreatorEmail: user.email,
          dateOfIncident: formatDate(values.dateOfIncident),
        },
      }).then((resp) => resp.data);
    },
    onSuccess: () => {
      setTimeout(() => {
        nav(-1);
      }, 1500);
      return toast({
        title: "Success!",
        description: "Ticket successfully created!",
        variant: "default",
      });
    },
    onError: (err) =>
      toast({
        title: "Error!",
        description:
          err.message === "Request failed with status code 400"
            ? "You are not a cpo member thus you can't create a ticket,contact your admin to upgrade your account."
            : err.message,
        variant: "destructive",
      }),
  });
  const trySubmitForm = (values) => {
    console.log("click");
    console.log(values);
    formSubmitMutation.mutate(values);
  };
  useEffect(() => {
    const onMouseMove = () => {
      if (sound) {
        sound.play();
        sound.loop = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchstart", onMouseMove);
      }
    };

    // Create an audio element and set its source
    const sound = new Audio(audio); // Replace with the path to your audio file

    // Add a mousemove event listener
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onMouseMove);

    // Clean up when the component unmounts
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (sound) {
        sound.pause();
      }
    };
  }, []);

  return (
    <section className="w-full  p-4 lg:p-2 max-h-screen overflow-y-auto">
      <SearchPage heading={"New Ticket"}>
        <div className="w-full  ">
          <ol className="list-reset flex  h-full">
            <li>
              <Link to={"/CPD/Dashboard"}>
                <a
                  href="#"
                  classNmae="text-primary font-bold transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                >
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                /
              </span>
            </li>
            <li className="text-blue-400/50">Library</li>
          </ol>
        </div>
        <p className="text-2xl font-semibold text-neutral-500 my-2">
          New Ticket
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(trySubmitForm)}
            className="md:grid w-[100%] p-2  lg:w-[80%] mx-auto   flex  flex-col   md:grid-cols-2 md:flex-none   "
          >
            <FormField
              name="complainantName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    <p className="  text-[#172B4D]">Complainant Name</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="complainantEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    {" "}
                    <p className="  text-[#172B4D]">Complainant Email</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                    />
                  </FormControl>
                  <FormMessage className="text-start text-xs" />
                </FormItem>
              )}
            />

            {/* Row-1-above */}
            <FormField
              name="complainantType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    <p className="  text-[#172B4D]">Complainant Type</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Select
                      className="outline-none"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-8 outline-none bg-white rounded-md dark:bg-white dark:ring-offset-transparent dark:focus:ring-transparent">
                        <SelectValue
                          placeholder="Complaint"
                          className="text-neutral-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                        <SelectItem
                          value="AS"
                          className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
                        >
                          Airline Services
                        </SelectItem>
                        <Separator />
                        <SelectItem
                          className=" text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer"
                          value="Ml"
                        >
                          Missing Luggage
                        </SelectItem>
                        <Separator />
                        <SelectItem
                          className=" text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer"
                          value="BF"
                        >
                          Bad Food
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="complainantPhoneNo"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    {" "}
                    <p className="  text-[#172B4D]">Complainant Phone</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                    />
                  </FormControl>
                  <FormMessage className="text-start text-xs" />
                </FormItem>
              )}
            />

            {/* Row-2-Above */}

            <FormField
              name="dateOfIncident"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    {" "}
                    <p className="  text-[#172B4D]">Date of Incident</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <FormDatePicker field={field} />
                  </FormControl>
                  <FormMessage className="text-start text-xs" />
                </FormItem>
              )}
            />
            <FormField
              name="timeOfIncident"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    {" "}
                    <p className="  text-[#172B4D]">Time of Incident</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                      {...field}
                      placeholder="2pm"
                    />
                  </FormControl>
                  <FormMessage className="text-start text-xs" />
                </FormItem>
              )}
            />

            <FormField
              name="route"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    {" "}
                    <p className="  text-[#172B4D]">Route</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                      {...field}
                      placeholder=""
                    />
                  </FormControl>
                  <FormMessage className="text-start text-xs" />
                </FormItem>
              )}
            />

            {/* row-3-above */}
            <FormField
              name="sourceOfComplaint"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    {" "}
                    <p className="  text-[#172B4D]">Source of Complaint</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                      {...field}
                      placeholder="2pm"
                    />
                  </FormControl>
                  <FormMessage className="text-start text-xs" />
                </FormItem>
              )}
            />
            {/* row-4-above */}

            <FormField
              name="complaintDetail"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    {" "}
                    <p className="  text-[#172B4D]">Complaint Detail</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      className="w-full outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                      {...field}
                      placeholder=""
                    />
                  </FormControl>
                  <FormMessage className="text-start text-xs" />
                </FormItem>
              )}
            />

            {/* row-5-above */}
            <FormField
              name="redressSought"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    {" "}
                    <p className="  text-[#172B4D]">Redress Sought</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      className="w-full outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                      {...field}
                      placeholder=""
                    />
                  </FormControl>
                  <FormMessage className="text-start text-xs" />
                </FormItem>
              )}
            />

            {/* row-6-above */}
            <div className="md:col-span-2 md:grid md:grid-cols-2 flex items-center  ">
              <div className="col-span-1  flex gap-2 items-center flex-wrap my-2">
                <div className="flex  text-sm items-center  font-semibold">
                  <p className="  text-[#172B4D]">Attachments</p>
                </div>
                <input
                  type="file"
                  name=""
                  id=""
                  className="md:w-max max-w-full w-full h-10 border-2   flex  items-center   rounded-md  bg-transparent border-[#000066]  text-[#000066] p-1 focus:cursor-pointer"
                />
              </div>
            </div>

            {/* row-7-above */}
            <FormField
              name="airline"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    <p className="  text-[#172B4D]">Airline</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>
                  <FormControl>
                    <Select
                      className="outline-none"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-8 outline-none bg-white rounded-md  dark:bg-white dark:ring-offset-transparent dark:focus:ring-transparent">
                        <SelectValue
                          placeholder="Airline Services"
                          className="text-neutral-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                        <SelectItem
                          value="AS"
                          className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
                        >
                          Dana Air
                        </SelectItem>
                        <Separator />
                        <SelectItem
                          className=" text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer"
                          value="Ml"
                        >
                          Max Air
                        </SelectItem>
                        <Separator />
                        <SelectItem
                          className=" text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer"
                          value="BF"
                        >
                          Air Peace
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    <p className="  text-[#172B4D]">Location</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>
                  <FormControl>
                    <Select
                      className="outline-none"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-8 outline-none bg-white rounded-md   dark:bg-white dark:ring-offset-transparent dark:focus:ring-transparent">
                        <SelectValue
                          placeholder="Location"
                          className="text-neutral-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                        <SelectItem
                          value="AS"
                          className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
                        >
                          MMA
                        </SelectItem>
                        <Separator />
                        <SelectItem
                          className=" text-[0.9rem] text-neutral-400 text-center inline p-1 hover:cursor-pointer"
                          value="Ml"
                        >
                          MMA II
                        </SelectItem>
                        <Separator />
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* row-8-above */}
            <FormField
              name="priority"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1  text-start space-y-2 flex flex-col items-start mb-4 mx-3">
                  <FormLabel className="flex flex-row space-x-2 items-center">
                    <p className="  text-[#172B4D]">Priority</p>
                    <AiFillStar className="text-red-500" />
                  </FormLabel>
                  <FormControl>
                    <Select
                      className="outline-none"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        disabled={
                          getSlasQuery.isError || getSlasQuery.isLoading
                        }
                        className="w-full h-8 outline-none bg-white rounded-md  dark:bg-white dark:ring-offset-transparent dark:focus:ring-transparent"
                      >
                        <SelectValue
                          placeholder="Select a priority..."
                          className="text-neutral-500"
                        />
                      </SelectTrigger>
                      {getSlasQuery.isSuccess && (
                        <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none ">
                          {getSlasQuery.data.map((sla) => (
                            <>
                              <SelectItem
                                value={sla.slaName}
                                className=" text-[0.9rem] text-neutral-400  inline p-1 hover:cursor-pointer text-center"
                              >
                                {sla.slaName}
                              </SelectItem>
                              <Separator />
                            </>
                          ))}
                        </SelectContent>
                      )}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex  my-4 ml-6 p-1 md:space-x-6  space-x-2 md:col-span-2  mx-auto w-full md:justify-center ">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="md:w-52 h-12 text-white bg-[#000066] rounded-md  w-1/2"
              >
                Cancel
              </button>
              <button
                className="md:w-52 h-12 text-[#000066] bg-white border-2 border-[#000066] rounded-md  w-1/2"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </Form>
      </SearchPage>
    </section>
  );
};
