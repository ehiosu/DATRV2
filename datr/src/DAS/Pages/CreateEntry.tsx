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
import { useTerminalStore } from '@/store/terminalstore';
import {TerminalSelector} from "../Components/TerminalSelector.jsx"
import { TimeInput } from "@/components/ui/TimeInput.js";
export const CreateEntry = () => {
  const [date, setDate] = useState();
  const {terminal}=useTerminalStore()
  const newEntryFormSchema = z.object({
    dateOfIncidence: z.date(),
    terminalName: z.string().default(terminal as string),
    airline: z.string().min(1, {
      message: "Select a valid Airline",
    }),
    flightNumber: z.string().min(1, {
      message: "Enter a valid flight number",
    }),
    inOrOutBoundPassenger:z.string().min(1,{
      message:"Enter a valid value"
    }),
    acType:z.string().min(1,{
      message:"Enter a valid value"
    }),
    route: z.string().min(1, {
      message: "Enter a valid Route",
    }),
    stipulatedTimeArrived: z.string().min(1, {
      message: "Input a valid Stipulated Time of Arrival.",
    }),
    actualTimeArrived: z.string().min(1, {
      message: "Input a valid Actual Time of Arrival.",
    }).default("").optional(),
    reportType: z.string().min(1, {
      message: "Select a valid report type",
    }),
   
  });
  const nav = useNavigate();
  const form = useForm({
    resolver: zodResolver(newEntryFormSchema),
  });
  const { axios } = useAxiosClient();
  const [reportType,setReportType]=useState<"ARRIVAL"|"DEPARTURE"|"">("ARRIVAL")
const resetBtn=useRef<HTMLButtonElement|null>(null)
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


  const TryAddEntry = (values:any) => {
   let isSumbitting =false
    if(!isSumbitting){
      toast.promise(
        new Promise((resolve, reject) =>
         { 
          isSumbitting=true
          return AddEntryMutation.mutate({...values,actualTimeArrived:values.actualTimeArrived||null}, {
            onSuccess: (data, variables, context) => {
              resolve(data);
              form.reset({});
              setReportType("")
              resetBtn.current?.click()   
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
    }
    isSumbitting=false
  };
  return (
    <main className="w-full h-full">
     
        <Form {...form}>
          <form className="w-[80%] mx-auto flex-col flex" onSubmit={form.handleSubmit(TryAddEntry)}>
            
          <button ref={resetBtn} type="reset" className="hidden"> </button>
          <div className="flex items-center flex-wrap w-full gap-3">
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
                      <Select onValueChange={field.onChange} key={field.value} value={field.value}>
                        <SelectTrigger
                          disabled={!getAirlinesQuery.isSuccess}
                          className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
                        >
                          <SelectValue
                            placeholder="Airline..."
                            className="text-neutral-500"
                          />
                        </SelectTrigger>
                        <SelectContent className="w-full bg-white rounded-md shadow-md  mx-auto text-center outline-none">
                          {getAirlinesQuery.isSuccess &&
                            getAirlinesQuery.data.map((airline: any) => (
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
                    <FormLabel>{reportType==="ARRIVAL"&&"Scheduled Time of Arrival"
                }
                {reportType==="DEPARTURE" && "Scheduled Time of Departure"}
                </FormLabel>
                    <FormControl>
                      {/* <Input className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200" {...field}/> */}
                      {/* <TimePicker
                        className={
                          "w-full bg-white  h-8 outline-none  border-b-2 dark:bg-white focus-within:ring-2 focus-within:ring-blue-400 rounded-lg  dark:border-gray-200  border-gray-200"
                        }
                        value={field.value}
                        onChange={field.onChange}
                      /> */}
                      <TimeInput value={field.value}  className="w-full bg-white rounded-sm h-8 focus-within:ring-2 focus-within:ring-offset-4 focus-within:ring-blue-400 p-2" onChange={field.onChange} inputClassname="dark:bg-transparent bg-transparent border-none w-max h-max p-0 text-center  dark:border-none text-sm px-0 focus:ring-none dark:focus:ring-none"/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="actualTimeArrived"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>{reportType==="ARRIVAL"&&"Actual Time of Arrival"
                }
                {reportType==="DEPARTURE" && "Actual Time of Departure"}
                
                </FormLabel>
                    <FormControl>
                      {/* <Input className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200" {...field}/> */}
                      <TimeInput value={field.value}  className="w-full bg-white rounded-sm h-8 focus-within:ring-2 focus-within:ring-offset-4 focus-within:ring-blue-400 p-2" onChange={field.onChange} inputClassname="dark:bg-transparent bg-transparent border-none w-max h-max p-0 text-center  dark:border-none text-sm px-0 focus:ring-none dark:focus:ring-none"/>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
         
           

            <div className="flex items-center flex-wrap w-full gap-3">
          <FormField
              name="reportType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                  <FormLabel>Report Type:</FormLabel>
                  <FormControl>
                    {/* <Input className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200" {...field}/> */}
                    <Select defaultValue={field.value} key={field.value} onValueChange={(value)=>{
                      setReportType(value as typeof reportType)
                      field.onChange(value)
                    }}>
                      <SelectTrigger className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none">
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
                name="inOrOutBoundPassenger"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Number Of Passengers</FormLabel>
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
          <FormField
                name="acType"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Aircraft Type</FormLabel>
                    <FormControl>
                      <Input
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
     
    </main>
  );
};
