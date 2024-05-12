import React, { useRef, useState } from "react";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { SearchPage } from "../../Reusable/SearchPage";
import { CiCalendar } from "react-icons/ci";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useNavigate, useParams } from "react-router";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TimePicker from "react-time-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useAxiosClient } from "@/api/useAxiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MdError } from "react-icons/md";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const CreateEntry = () => {
  const [date, setDate] = useState();
  const {Location} = useParams();
  const newEntryFormSchema = z.object({
    dateOfIncidence: z.date(),
    terminalName: z.string().default(String(Location)),
    airline: z.string().min(1, {
      message: "Select a valid Airline",
    }),
    flightNumber: z.string().min(1, {
      message: "Enter a valid flight number",
    }),
    route: z.string().min(1, {
      message: "Enter a valid Route",
    }),
    stipulatedTimeArrived: z.string().min(1, {
      message: "Input a valid Stipulated Time of Arrival.",
    }),
    actualTimeArrived: z.string().min(1, {
      message: "Input a valid Actual Time of Arrival.",
    }),
    isDelayed: z.boolean().optional().default(false).optional(),
    isOnTime: z.boolean().optional().default(false).optional(),
    isCancelled: z.boolean().optional().default(false).optional(),
    entryState:z.string(),
    reportType: z.string().min(1, {
      message: "Select a valid report type",
    }),
    remark: z.string().min(1, {
      message: "Select a valid report type",
    }),
  });
  const nav = useNavigate();
  const form = useForm({
    resolver: zodResolver(newEntryFormSchema),
  });
  const { axios } = useAxiosClient();
  const checkboxRefs = useRef<HTMLButtonElement[]>([]);

  const getAirlinesQuery = useQuery({
    queryKey: ["airlines", "names"],
    queryFn: () =>
      axios("airlines/active", {
        method: "GET",
      }).then((resp: any) =>
        resp.data.map((airline: any) => airline.airlineName)
      ),
  });
  const AddEntryMutation = useMutation({
    mutationKey: ["entry", "new"],
    mutationFn: (values:any) =>
      { 
        console.log(values)
        return new Promise((resolve, reject) =>
        axios("data-entries/add", {
          method: "POST",
          data: {...values,dateOfIncidence:format(new Date(values.dateOfIncidence),'yyyy-MM-dd')},
        })
          .then((resp: any) => resolve(resp.data))
          .catch((err: any) => reject(err))
      )},
  });


  const TryAddEntry = (values: z.infer<typeof newEntryFormSchema>) => {
    console.log(values)
    switch (values.entryState){
      case "onTime":
        values.isOnTime=true;
        values.isDelayed=false;
        values.isCancelled=false;
        break;
      case "delayed":
        values.isDelayed=true;
        values.isOnTime=false;
        values.isCancelled=false;
        break;
      case "cancelled":
        values.isCancelled=true;
        values.isDelayed=false;
        values.isOnTime=false;
        break;
    }
    const {entryState,...rest}=values
    toast.promise(
      new Promise((resolve, reject) =>
       { 
        console.log(values)
        return AddEntryMutation.mutate({...rest,dateOfIncidence:values.dateOfIncidence}, {
          onSuccess: (data, variables, context) => {
            resolve(data);
            
          },
          onError: (error, variables, context) => {
            reject(error);
          },
        })}
      ),
      {
        loading: "Trying to add entry...",
        success: "Entry added successfully!",
        error: (error: any) => {
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
  return (
    <main className="w-full h-full">
      <SearchPage heading={"New Entry"}>
        <Form {...form}>
          <form className="w-[80%] mx-auto flex-col flex" onSubmit={form.handleSubmit(TryAddEntry)}>
            <div className="flex items-center justify-between">
              <FormField
                name="dateOfIncidence"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={cn(
                              "w-60 justify-start text-left font-normal dark:bg-white bg-white ring-2 ring-blue-400 h-8",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CiCalendar className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span> Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            toDate={new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="airline"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-1 w-full flex-col my-2 space-y-3">
                    <FormLabel>Airline:</FormLabel>
                    <FormControl>
                      {/* <Input className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200" {...field}/> */}
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger
                          disabled={!getAirlinesQuery.isSuccess}
                          className="w-48 h-7 outline-none my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
                        >
                          <SelectValue
                            placeholder="Airline..."
                            className="text-neutral-500"
                          />
                        </SelectTrigger>
                        <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                          {getAirlinesQuery.isSuccess &&
                            getAirlinesQuery.data.map((airline: string) => (
                              <>
                                <SelectItem
                                  value={airline}
                                  className=" text-[0.9rem] text-neutral-400  w-full p-1 hover:cursor-pointer text-center"
                                >
                                  {airline}
                                </SelectItem>
                                <Separator />
                              </>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center flex-wrap w-full gap-3 my-2">
              <FormField
                name="flightNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Flight Number</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="route"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Route</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center flex-wrap w-full gap-3">
              <FormField
                name="stipulatedTimeArrived"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Stipulated Time of Arrival</FormLabel>
                    <FormControl>
                      {/* <Input className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200" {...field}/> */}
                      <TimePicker
                        className={
                          "w-full bg-white  h-8 outline-none  border-b-2 dark:bg-white focus-within:ring-2 focus-within:ring-blue-400 rounded-lg  dark:border-gray-200  border-gray-200"
                        }
                        value={field.value || "12:00"}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="actualTimeArrived"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Actual Time of Arrival</FormLabel>
                    <FormControl>
                      {/* <Input className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200" {...field}/> */}
                      <TimePicker
                        className={
                          "w-full bg-white  h-8 outline-none  border-b-2 dark:bg-white focus-within:ring-2 focus-within:ring-blue-400 rounded-lg  dark:border-gray-200  border-gray-200"
                        }
                        value={field.value || "12:00"}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
          control={form.control}
          name="entryState"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Flight state...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value||""}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="onTime" className="w-5 h-5 dark:border-neutral-300 data-[state=checked]:text-blue-400 p-0  text-neutral-200"/>
                    </FormControl>
                    <FormLabel className="font-normal">
                     Is On Time
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem className="w-5 h-5 dark:border-neutral-300 data-[state=checked]:text-blue-400 p-0  text-neutral-200  dark:text-neutral-500" value="delayed" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Is Delayed
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem className="w-5 h-5 dark:border-neutral-300 data-[state=checked]:text-blue-400 p-0  text-neutral-200 dark:text-neutral-200" value="cancelled" />
                    </FormControl>
                    <FormLabel className="font-normal">Is Cancelled</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

            <p className="text-[0.8275rem] text-center font-semibold text-neutral-500 ">
              Ensure You Only Tick One of These Boxes.
            </p>

            <FormField
              name="reportType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                  <FormLabel>Report Type:</FormLabel>
                  <FormControl>
                    {/* <Input className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200" {...field}/> */}
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-48 h-7 outline-none my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none">
                        <SelectValue
                          placeholder="Report Type"
                          className="text-neutral-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                        <SelectItem
                          value="ARRIVAL"
                          className=" text-[0.9rem] text-neutral-400  w-full p-1 hover:cursor-pointer text-center"
                        >
                          Arrival
                        </SelectItem>
                        <Separator />
                        <SelectItem
                          value="DEPARTURE"
                          className=" text-[0.9rem] text-neutral-400  w-full p-1 hover:cursor-pointer text-center"
                        >
                          Departure
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="remark"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col my-2 space-y-3">
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center my-6">
              <button
                className="w-56 h-10 rounded-lg shadow-md bg-darkBlue text-white"
               type="submit"
               disabled={AddEntryMutation.isPending}
              >
                Submit
              </button>
              <button
                className="w-56 h-10 rounded-lg shadow-md bg-lightPink text-white "
                onClick={() => {
                  nav(`/DAS/${Location}/Dashboard`);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Form>
      </SearchPage>
    </main>
  );
};
