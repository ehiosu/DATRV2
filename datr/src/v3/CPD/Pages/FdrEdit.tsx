import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchPage } from "../../Reusable/SearchPage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CiCalendar } from "react-icons/ci";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigate, useNavigate, useParams } from "react-router";
import { useAxiosClient } from "@/api/useAxiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DevTool } from "@hookform/devtools";
import TimePicker from "react-time-picker";
import { toast } from "sonner";
import { MdError } from "react-icons/md";
import { useAuth } from "@/api/useAuth";
import { AxiosError, AxiosResponse } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw } from "lucide-react";
import { TimeInput } from "@/components/ui/TimeInput";
import { useRoutes } from "@/v3/hooks/useRoutes";
 
export const FdrEdit=()=>{
    const {id} = useParams()
    const {axios}=useAxiosClient()
    if(!id) return <Navigate to={"/CPD/FDR"}/>
    const reportQuery = useQuery({
        queryKey:["fdr",`${id}`],
        queryFn:()=>axios(`flight-disruption-reports/${id}`).then((resp:AxiosResponse)=>resp.data).catch((err:AxiosError)=>{throw err}),
        refetchOnMount:true
    })

    return(
       <div className="w-full">
        {
            reportQuery.isLoading?<Skeleton className="w-full h-[60vh]"/>:reportQuery.isSuccess ? <FDRForm data={reportQuery.data as any}/>:reportQuery.isError&&<div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <p className="mx-auto text-xl text-neutral-500">{reportQuery.error.response.data.message  || reportQuery.error.response.data.detail}</p>
                <button onClick={()=>{reportQuery.refetch()}} className="w-6 h-6 bg-ncBlue text-white rounded-sm flex items-center justify-center"><RefreshCcw className="w-4 h-4 shrink"/></button>
            </div>

        }
       </div>
        
    )
}

export const FDRForm = ({data}:{data:any}) => {
  console.log(data)
  const { axios } = useAxiosClient();
  const nav = useNavigate();
  const {user}=useAuth()
  const routesQuery=useRoutes()
  const [reportType,setReportType]=useState<"Arrival"|"Departure">("Arrival")
  const formSchema = z
    .object({
      dateOfIncidence: z.date(),
      terminalName: z.string(),
      flightNumber: z.string(),
      route: z.string(),
      reasonForDelay: z.string().default("").optional(),
      scheduledTime: z.string().default(""),
      expectedTime: z.string().default(""),
      reasonForCancellation: z.string().optional().default(""),
      reasonForTarmacDelay: z.string().optional().default(""),
      compliance: z
        .object({
          information: z.object({
            state: z.boolean().default(false),
            numberOfPassengers: z.string().min(1, {
              message: "Enter a value here",
            }),
          }),
          refreshment: z
            .object({
              state: z.boolean().default(false),
              numberOfPassengers: z.string().default("0"),
            }).optional(),
          refund: z
            .object({
              state: z.boolean().default(false),
              numberOfPassengers: z.string().default("0"),
            }).optional(),
          reprotection: z
            .object({
              state: z.boolean().default(false),
              numberOfPassengers: z.string().default("0"),
            }).optional(),
          reschedule: z
            .object({
              state: z.boolean().default(false),
              numberOfPassengers: z.string().default("0"),
            }).optional(),
          compensation: z
            .object({
              state: z.boolean().default(false),
              numberOfPassengers: z.string().default("0"),
            }).optional(),
        })
        .refine((data) => data.information.numberOfPassengers.length! >= 1, {
          message: "Enter a valid information figure",
        }),
    })
    .refine(
      (data) =>
        data.reasonForDelay ||
        data.reasonForCancellation ||
        data.reasonForTarmacDelay,
      { message: "Enter a reason for delay or a reason for cancellation", }
    )
    ;
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues:{
        ...data,
        scheduledTime:data["reportType"]==="ARRIVAL"? data["scheduledTimeArrival"]:data["scheduledTimeDeparture"],
        expectedTime:data["reportType"]==="ARRIVAL"? data["expectedTimeArrival"]:data["expectedTimeDeparture"],
        dateOfIncidence:new Date(data["dateOfIncidence"]),
        route:data["route"],
        compliance:{
          information:{
            state:data["complianceList"][0]["isRequired"],
            numberOfPassengers:data["complianceList"][0]["numberOfPassengers"]
          },
          refreshment:{
            state:data["complianceList"][1]["isRequired"],
            numberOfPassengers:data["complianceList"][1]["numberOfPassengers"]
          },
          refund:{
            state:data["complianceList"][2]["isRequired"],
            numberOfPassengers:data["complianceList"][2]["numberOfPassengers"]
          },
          reprotection:{
            state:data["complianceList"][3]["isRequired"],
            numberOfPassengers:data["complianceList"][3]["numberOfPassengers"]
          },
          reschedule:{
            state:data["complianceList"][4]["isRequired"],
            numberOfPassengers:data["complianceList"][4]["numberOfPassengers"]
          },
          compensation:{
            state:data["complianceList"][5]["isRequired"],
          numberOfPassengers:data["complianceList"][5]["numberOfPassengers"]
          }
          
        }
    },
    mode: "all",
    resolver: zodResolver(formSchema),
  });
  const activeTerminalsQuery = useQuery({
    queryKey: ["terminals", "all"],
    queryFn: () =>
      axios("terminals/active", {
        method: "GET",
      }).then((resp: any) => resp.data),
  });
  const uploadReportMutation = useMutation({
    mutationKey: ["FDR", "NEW"],
    mutationFn: (values: any) => {
      return new Promise((resolve, reject) => {
        axios(`flight-disruption-reports/${data.id}`, {
          method:"PATCH",
          data:values
        }).then((resp:any)=>resolve(resp)).catch((err:any)=>reject(err));
      });
    },
  });
useEffect(()=>{
  console.log(form.formState.errors)
},[form.formState.errors])
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const form_data={
      "terminalName": values.terminalName,
      "airline": user.airline,
      "scheduledTimeDeparture":reportType==="Arrival"?"":values.scheduledTime,
      "expectedTimeDeparture":reportType==="Arrival"?"":values.expectedTime,
      "scheduledTimeArrival":reportType==="Departure"?"":values.scheduledTime,
      "expectedTimeArrival":reportType==="Departure"?"":values.expectedTime,
      "dateOfIncidence": format(values.dateOfIncidence,'yyyy-MM-dd'),
      "route": values.route,
      "reasonForDelay": values.reasonForDelay,
      "reasonForCancellation":values.reasonForCancellation,
      "reasonForTarmacDelay":values.reasonForTarmacDelay,
      "flightNumber":values.flightNumber,
      "complianceList": [
        {
          "careName": "INFORMATION",
          "isRequired":values.compliance.information.state,
         "numberOfPassengers":values.compliance.information.numberOfPassengers
        },
          {
          "careName": "REFRESHMENT",
          "isRequired":values.compliance.refreshment?.state||false,
          "numberOfPassengers":values.compliance.refreshment?.numberOfPassengers||"0"
        },
          {
          "careName": "REFUND",
          "isRequired":values.compliance.refund?.state||false,
          "numberOfPassengers":values.compliance.refund?.numberOfPassengers||"0"
        },
          {
          "careName": "REPROTECTION",
          "isRequired":values.compliance.reprotection?.state||false,
          "numberOfPassengers":values.compliance.reprotection?.numberOfPassengers||"0"
        },
          {
          "careName": "RESCHEDULE",
          "isRequired":values.compliance.reschedule?.state||false,
          "numberOfPassengers":values.compliance.reschedule?.numberOfPassengers||"0"
        },
          {
          "careName": "COMPENSATION",
          "isRequired":values.compliance.compensation?.state||false,
          "numberOfPassengers":values.compliance.compensation?.numberOfPassengers||"0"
        }
      ]
    }
    let patch_data=[
        {"op":"replace", "path": "/dateOfIncidence", "value": form_data.dateOfIncidence},
        {"op":"replace", "path" : "/flightNumber", "value" : form_data.flightNumber},
        {"op":"replace", "path" : "/route", "value" : form_data.route},
        {"op":"replace", "path" : "/reportType", "value" : "ARRIVAL"},
        {"op":"replace", "path" : "/scheduledTimeDeparture", "value" : form_data.scheduledTimeDeparture},
        {"op":"replace", "path" : "/expectedTimeDeparture", "value" : form_data.expectedTimeDeparture},
        {"op":"replace", "path" : "/scheduledTimeArrival", "value" : form_data.scheduledTimeArrival},
        {"op":"replace", "path" : "/expectedTimeArrival", "value" : form_data.expectedTimeArrival},
        {"op":"replace", "path" : "/reasonForDelay", "value" : form_data.reasonForDelay},
        {"op":"replace", "path" : "/reasonForTarmacDelay", "value" : form_data.reasonForTarmacDelay},
        {"op":"replace", "path" : "/reasonForCancellation", "value" : form_data.reasonForCancellation},
        {"op":"replace", "path" : "/complianceList/0/numberOfPassengers", "value" : form_data.complianceList[0].numberOfPassengers},
        {"op":"replace", "path" : "/complianceList/0/isRequired", "value" : form_data.complianceList[0].isRequired},
        {"op":"replace", "path" : "/complianceList/1/numberOfPassengers", "value" : form_data.complianceList[1].numberOfPassengers},
        {"op":"replace", "path" : "/complianceList/1/isRequired", "value" : form_data.complianceList[1].isRequired},
        {"op":"replace", "path" : "/complianceList/2/numberOfPassengers", "value" : form_data.complianceList[2].numberOfPassengers},
        {"op":"replace", "path" : "/complianceList/2/isRequired", "value" : form_data.complianceList[2].isRequired},
        {"op":"replace", "path" : "/complianceList/3/numberOfPassengers", "value" : form_data.complianceList[3].numberOfPassengers},
        {"op":"replace", "path" : "/complianceList/3/isRequired", "value" : form_data.complianceList[3].isRequired},
        {"op":"replace", "path" : "/complianceList/4/numberOfPassengers", "value" : form_data.complianceList[4].numberOfPassengers},
        {"op":"replace", "path" : "/complianceList/4/isRequired", "value" : form_data.complianceList[4].isRequired},
        {"op":"replace", "path" : "/complianceList/5/numberOfPassengers", "value" : form_data.complianceList[5].numberOfPassengers},
        {"op":"replace", "path" : "/complianceList/5/isRequired", "value" : form_data.complianceList[5].isRequired},
      
        
    ]
    

  
    
   toast.promise(new Promise((resolve,reject)=>
    uploadReportMutation.mutate(patch_data,{
      onSuccess:(data)=>{resolve(data)
        form.reset({})
        setTimeout(() => {
          nav(-1)
        }, 2000);

      },
      onError:(error)=>reject(error)
    })
  ),{
    loading:"Submitting Report...",
    success:"Entry Edited Successfully!",
    error: (error: any) => {
      return (
        <div className="text-black flex flex-col">
          <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
            <MdError /> Error
          </p>
          <p>{error.response.data.message || error.response.data.detail}</p>
        </div>
      );
    }
    
  })
  };
  return (
    <section className="">
        <p className="text-xl text-ncBlue font-semibold">
          Edit Report {data.id}
        </p>
        <Form {...form}>
          <form
            className="w-[80%] mx-auto flex-col flex"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex items-center flex-wrap w-full gap-3 my-2">
              <div className="flex md:w-[45%] w-full flex-col my-2 space-y-1">
                <p className="text-[0.8275rem] font-semibold">Report Type</p>
              <Select
                        value={reportType}
                        onValueChange={(value: typeof reportType)=>{setReportType(value)}}
                      >
                        <SelectTrigger
                          className="w-full h-9  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
                          
                        >
                          <SelectValue placeholder="Select A Report Type" />
                        </SelectTrigger>
                        
                          <SelectContent>
                           <SelectItem value="Arrival">
                            Arrival
                           </SelectItem>
                           <SelectItem value="Departure">
                            Departure
                           </SelectItem>
                          </SelectContent>
                        
                      </Select>
              </div>
              <FormField
                name="dateOfIncidence"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col md:w-[45%] w-full">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={cn(
                              " w-full justify-start text-left font-normal dark:bg-white bg-white ring-2 ring-blue-400 h-8",
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

              {/* <FormField
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
              /> */}
            </div>
            <div className="flex items-center flex-wrap w-full gap-3 my-2">
              <FormField
                name="reasonForDelay"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Reason For Delay</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="reasonForCancellation"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Reason For Cancellation</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center flex-wrap w-full gap-3 my-2">
              <FormField
                name="reasonForTarmacDelay"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Reason For Tarmac Delay</FormLabel>
                    <FormControl>
                      <Input className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <FormField
                name="terminalName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terminal</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-48 h-7  my-1 bg-white rounded-md dark:bg-white focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none"
                          disabled={!activeTerminalsQuery.isSuccess}
                        >
                          <SelectValue placeholder="Select A terminal" />
                        </SelectTrigger>
                        {activeTerminalsQuery.isSuccess && (
                          <SelectContent>
                            {activeTerminalsQuery.data.map((terminal: any) => (
                              <SelectItem value={terminal.name}>
                                {terminal.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        )}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center flex-wrap w-full gap-3 my-2">
              <FormField
                name="route"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex md:w-[45%] w-full flex-col my-2 space-y-3">
                    <FormLabel>Route</FormLabel>
                    <FormControl>
                    <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                        disabled={!routesQuery.isSuccess}
                          className="w-full h-9  my-1 text-white dark:text-white rounded-md  focus:outline-none dark:focus:outline-none dark:outline-none outline-none dark:focus-within:outline-none focus-within:outline-none bg-ncBlue dark:bg-ncBlue"
                          
                        >
                          <SelectValue placeholder="Select A Route" />
                        </SelectTrigger>
                        
                         {
                          routesQuery.isSuccess && routesQuery.data &&  <SelectContent className="bg-ncBlue text-white dark:bg-ncBlue dark:text-white shadow-none  hover:bg-ncBlue dark:hover:bg-ncBlue">
                        {
                          routesQuery.data.map((route:any)=>(
                            <SelectItem className="bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent  focus:bg-transparent dark:focus:bg-transparent text-white dark:text-white focus:text-white dark:focus:text-white" key={route["id"]} value={route["routeName"]}>
                            {route["abbreviation"]}
                           </SelectItem>
                          ))
                        }
                         
                         </SelectContent>
                         }
                        
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="scheduledTime"
                control={form.control}
                render={({field})=>(

                 <FormItem className="flex flex-col space-y-2 md:w-[45%] w-full ">
                  <FormLabel>
                    {
                      reportType === "Arrival"?"Scheduled Time of Arrival":"Scheduled Time of Departure"
                    }
                  </FormLabel>
                  <FormControl>
                  <TimeInput value={field.value} defaultValue={field.value}   className="w-full bg-white rounded-sm h-8 focus-within:ring-2 focus-within:ring-offset-4 focus-within:ring-blue-400 p-2" onChange={field.onChange} inputClassname="dark:bg-transparent bg-transparent border-none w-max h-max p-0 text-center  dark:border-none text-sm px-0 focus:ring-none dark:focus:ring-none"/>
                  {/* <TimePicker value={field.value} onChange={field.onChange} className={"w-full bg-white  h-8 outline-none  border-b-2 dark:bg-white focus-within:ring-2 focus-within:ring-blue-400 rounded-lg  dark:border-gray-200  border-gray-200"}/> */}
                  </FormControl>
                 </FormItem>
                )}
              />
              
            </div>
            <div className="flex items-center flex-wrap w-full gap-3 my-2">
             
              <FormField
                name="expectedTime"
                control={form.control}
                render={({field})=>(

                 <FormItem className="flex flex-col space-y-2 md:w-[45%] w-full ">
                  <FormLabel>
                  {
                      reportType === "Arrival"?"Expected Time of Arrival":"Expected Time of Departure"
                    }
                  </FormLabel>
                  <FormControl>
                  <TimeInput value={field.value} defaultValue={field.value}  className="w-full bg-white rounded-sm h-8 focus-within:ring-2 focus-within:ring-offset-4 focus-within:ring-blue-400 p-2" onChange={field.onChange} inputClassname="dark:bg-transparent bg-transparent border-none w-max h-max p-0 text-center  dark:border-none text-sm px-0 focus:ring-none dark:focus:ring-none"/>
                  </FormControl>
                 </FormItem>
                )}
              />
               <FormField
                name="flightNumber"
                control={form.control}
                render={({field})=>(

                 <FormItem className="flex flex-col space-y-2 md:w-[45%] w-full ">
                  <FormLabel>
                    Flight Number
                  </FormLabel>
                  <FormControl>
                  <Input  className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"  {...field}/>
                  </FormControl>
                 </FormItem>
                )}
              />
              </div>
           
            <div className="flex items-center justify-between">
              <FormField
                name="compliance"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex  w-full flex-col my-2 space-y-3">
                    <FormLabel>Compliance</FormLabel>
                    <FormControl>
                      <div className="space-y-1">
                        <ComplianceElement
                          title="Information"
                          value={field.value}
                          onChange={field.onChange}
                          itemKey="information"
                        />
                        <ComplianceElement
                          title="Refreshment"
                          value={field.value}
                          onChange={field.onChange}
                          itemKey="refreshment"
                        />
                        <ComplianceElement
                          title="Refund"
                          value={field.value}
                          onChange={field.onChange}
                          itemKey="refund"
                        />
                        <ComplianceElement
                          title="Reprotection"
                          value={field.value}
                          onChange={field.onChange}
                          itemKey="reprotection"
                        />
                        <ComplianceElement
                          title="Compensation"
                          value={field.value}
                          onChange={field.onChange}
                          itemKey="compensation"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
       {/* <p className="text-red-500 text-sm font-semibold">{form.formState.errors? form.formState.errors[""].message: ""}</p> */}

            <div className="flex gap-4 items-center my-6">
              <button
                className="w-56 h-10 rounded-lg shadow-md bg-darkBlue text-white"
                type="submit"
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
  
    </section>
  );
};

type ComplianceElementProps = {
  value: any;
  onChange: (value: any) => void;
  itemKey: string;
  title: string;
};
const ComplianceElement: React.FC<ComplianceElementProps> = ({
  value,
  onChange,
  itemKey,
  title,
}) => {
  const [elementState, setElementState] = useState({
    choice: false,
    count: "0",
  });
  let hasMounted=false
 
  useEffect(() => {
    const updatedValue = {
      ...value,
      [itemKey]: {
        state: elementState.choice,
        numberOfPassengers: elementState.count,
      },
    };
    onChange(updatedValue);
  }, [elementState]);
  return (
    <div className="w-full flex items-center ">
      <p className="text-md font-semibold w-28">{title}</p>
      <div className="flex    mx-auto space-x-2 items-center">
        <Checkbox
        defaultChecked={value[itemKey]? value[itemKey].state:false}
          className="shadow-sm bg-white dark:bg-white text-ncBlue dark:text-ncBlue data-[state=checked]:bg-ncBlue h-5 w-5 text-xl border-2 border-black dark:border-black "
          onCheckedChange={() =>
            setElementState((state) => ({ ...state, choice: !state.choice }))
          }
        />
        <p>Yes?</p>
      </div>
      <div className="flex flex-col space-y-2 w-[40%] ">
        <p className="text-sm text-neutral-500">Number Of Passengers</p>
        <Input
          type="number"
          defaultValue={value[itemKey]? value[itemKey].numberOfPassengers:""}
          className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200 "
          onChange={(e) => {
            setElementState((state) => ({
              ...state,
              count: e.target.value.toString(),
            }));
          }}
        />
        {itemKey === "information" ? (
          elementState.count === "" && (
            <p className="text-sm text-red-500">Entet a value</p>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
