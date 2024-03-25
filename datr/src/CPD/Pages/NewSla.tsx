import React from "react";
import { BreadCrumb } from "./CPOView";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaArrowRight } from "react-icons/fa";
import {
  pauseSlaEntries,
  slaEntry,
  startSlaEntries,
  stopEntries,
} from "../data/data.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Timepicker } from "@/components/ui/Timepicker.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { useAxiosClient } from "@/api/useAxiosClient.jsx";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useToast } from "@/components/ui/use-toast.ts";
import { SingleSlaWrapper } from "@/components/ui/Slawrapper.tsx";

const TSBreadCrum: React.FC<{
  last: string;
  previous: string;
  current: string;
}> = BreadCrumb;

type requestbody= {
  slaName: string;
  resolutionDay: number;
  resolutionHour: number;
  resolutionMinute: number;
  responseDay: number;
  responseHour: number;
  responseMinute: number;
  slaStartCondition: string;
  slaPauseCondition: string;
  slaResetCondition: string;
}

export const NewSla: React.FC = () => {
  const { axios } = useAxiosClient();
  const { toast: cToast } = useToast();
  const nav = useNavigate();
  const newSlaSchema = z.object({
    slaName: z.string().min(1, {
      message: "Sla Name is Required!",
    }),
    resolutionDay: z
      .string()
      .min(1, {
        message: "Resolution Day is Required!",
      })
      .max(2, {
        message: "Response day must not contain more than 2 characters!",
      }),
    resolutionTime: z.string().min(1, {
      message: "Select a valid resolution time",
    }),
    responseDay: z
      .string()
      .min(1, {
        message: "Response Day is Required!",
      })
      .max(2, {
        message: "Response day must not contain more than 2 characters!",
      }),
    responseTime: z.string().min(1, {
      message: "Select a valid resolution time",
    }),
    slaStartCondition: z.string().min(1, {
      message: "A start condition is required!",
    }),
    slaPauseCondition: z.string().min(1, {
      message: "A Pause condition is required!",
    }),
    slaResetCondition: z.string().min(1, {
      message: "A Reset condition is required!",
    }),
  });

  const newSlaForm = useForm<z.infer<typeof newSlaSchema>>({
    mode: "onChange",
    defaultValues: {
      slaName: "",
      slaPauseCondition: "",
      slaResetCondition: "",
      slaStartCondition: "",
      resolutionDay: "",
      resolutionTime: "",
      responseDay: "",
      responseTime: "",
    },
    resolver: zodResolver(newSlaSchema),
  });
  const createSlaMutation = useMutation({
    mutationKey: ["sla", "new"],
    mutationFn: (requestBody:requestbody) =>
      axios("admin/sla/create", {
        method: "POST",
        data: requestBody,
      })
        .then((resp: any) => {
          toast("Success!", {
            description: "SLA successfully created!",
            className: " font-semibold",
          });
          setTimeout(() => {
            nav("/CPD/Configuration/Sla");
          }, 1000);
          return resp.data;
        })
        .catch((err: Error) => {
          cToast({
            title: "Error!",
            description: err.message,
            variant: "destructive",
          });
        }),
  });
  const tryCreateSlA = (values: z.infer<typeof newSlaSchema>) => {
    console.log(values);
    const requestBody = {
      slaName: values.slaName.trim(),
      resolutionDay: parseInt(values.resolutionDay),
      resolutionHour: parseInt(values.resolutionTime.split(" ")[0]),
      resolutionMinute: parseInt(values.resolutionTime.split(" ")[1]),
      responseDay: parseInt(values.responseDay),
      responseHour: parseInt(values.responseTime.split(" ")[0]),
      responseMinute: parseInt(values.responseTime.split(" ")[1]),
      slaStartCondition: values.slaStartCondition,
      slaPauseCondition: values.slaPauseCondition,
      slaResetCondition: values.slaResetCondition,
    };
    createSlaMutation.mutate(requestBody);
  };
  return (
    <div className="w-full lg:h-screen overflow-y-auto">
      <TSBreadCrum
        last={"Configuration"}
        previous={"SLAs"}
        current={"New SLA"}
      />

      <p className="my-4 text-[0.725rem] font-semibold">
        Time will be measured between Start and Stop conditions below.
      </p>
      <Form {...newSlaForm}>
        <form onSubmit={newSlaForm.handleSubmit(tryCreateSlA)}>
          <FormField
            name="slaName"
            control={newSlaForm.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-2 my-4">
                      <Label htmlFor="Name">Sla Name</Label>
                      <Input
                        {...field}
                        className="w-56 border-neutral-200 border-2 outline-none dark:border-neutral-200 dark:bg-white bg-white text-neutral-500 h-8 px-3"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex flex-wrap gap-4">
            <FormField
              name="slaStartCondition"
              control={newSlaForm.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <SingleSlaWrapper
                        onChange={field.onChange}
                        data={startSlaEntries}
                        name="Start"
                        subtext="Begin counting time when"
                        first={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
            <FormField
              name="slaPauseCondition"
              control={newSlaForm.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <SingleSlaWrapper
                        onChange={field.onChange}
                        data={pauseSlaEntries}
                        first={false}
                        name="Pause"
                        subtext="Time is not counted during"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
            <FormField
              name="slaResetCondition"
              control={newSlaForm.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <SingleSlaWrapper
                        data={stopEntries}
                        onChange={field.onChange}
                        first={false}
                        name="Reset"
                        subtext="Restart counting time when"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
          </div>
          <p className="text-[0.9275rem] font-semibold mt-2">Goals</p>
          <p className="text-[0.7275rem] text-neutral-500 my-1">
            Issues will be checked against this list,top to bottom and assigned
            a time target.
          </p>
          <div className="flex items-start space-x-2 my-2 flex-wrap">
            <div className="">
              <FormField
                name="resolutionDay"
                control={newSlaForm.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-1">
                          <p className="text-[0.75rem] text-darkBlue font-semibold">
                            Resolution Days
                          </p>
                          <Input
                            {...field}
                            onBlur={(e) => {
                              if (e.target.value !== "") {
                                e.target.value += " days";
                              }
                            }}
                            onFocus={(e) => {
                              let value = e.target.value.trim();
                              if (value.endsWith("days")) {
                                value = value
                                  .substring(0, value.length - 4)
                                  .trim(); // Remove "days" from the end
                              }

                              e.target.value = value;
                            }}
                            onChange={(e) => {
                              let value = e.target.value.trim(); // Remove leading and trailing whitespace
                              if (value.endsWith("days")) {
                                value = value
                                  .substring(0, value.length - 4)
                                  .trim(); // Remove "days" from the end
                              }
                              if (/^\d+$/.test(value)) {
                                e.target.value = value; // Set input value to processed value
                              } else {
                                value = ""; // Set value to empty string if it contains non-digit characters
                                e.target.value = value; // Update input value
                              }
                              field.onChange(value); // Update form value
                            }}
                            className="w-48 h-9 border-2 md:flex-grow-0  border-neutral-200 bg-white outline-none ring-0 dark:ring-0 dark:bg-white px-2 text-[0.75rem]"
                            placeholder="e.g 4"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="max-w-40" />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="">
              <FormField
                name="resolutionTime"
                control={newSlaForm.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-1">
                          <p className="text-[0.75rem] text-darkBlue font-semibold">
                            Resolution Time
                          </p>
                          <Timepicker
                            onFieldChange={field.onChange}
                            className="w-full  flex flex-col min-h-80 rounded-md"
                            headerClassname="text-black font-semibold text-xl"
                            circleClassName="w-full h-60  aspect-square   relative  mt-auto"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-wrap" />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="">
              <FormField
                name="responseDay"
                control={newSlaForm.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-1">
                          <p className="text-[0.75rem] text-darkBlue font-semibold">
                            Response Days
                          </p>
                          <Input
                            {...field}
                            onBlur={(e) => {
                              if (e.target.value !== "") {
                                e.target.value += " days";
                              }
                            }}
                            onFocus={(e) => {
                              let value = e.target.value.trim();
                              if (value.endsWith("days")) {
                                value = value
                                  .substring(0, value.length - 4)
                                  .trim(); // Remove "days" from the end
                              }

                              e.target.value = value;
                            }}
                            onChange={(e) => {
                              let value = e.target.value.trim(); // Remove leading and trailing whitespace
                              if (value.endsWith("days")) {
                                value = value
                                  .substring(0, value.length - 4)
                                  .trim(); // Remove "days" from the end
                              }
                              if (/^\d+$/.test(value)) {
                                e.target.value = value; // Set input value to processed value
                              } else {
                                value = ""; // Set value to empty string if it contains non-digit characters
                                e.target.value = value; // Update input value
                              }
                              field.onChange(value); // Update form value
                            }}
                            className="w-48 h-9 border-2 md:flex-grow-0  border-neutral-200 bg-white outline-none ring-0 dark:ring-0 dark:bg-white px-2 text-[0.75rem]"
                            placeholder="e.g 4"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="max-w-40" />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="">
              <FormField
                name="responseTime"
                control={newSlaForm.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-1">
                          <p className="text-[0.75rem] text-darkBlue font-semibold">
                            Response Time
                          </p>
                          <Timepicker
                            onFieldChange={field.onChange}
                            className="w-full  flex flex-col min-h-80 rounded-md"
                            headerClassname="text-black font-semibold text-xl"
                            circleClassName="w-full h-72  aspect-square outline   relative  mt-auto"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-wrap" />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2  mt-[1rem] ">
            <button
              disabled={createSlaMutation.isPending}
              className="md:w-48 w-full  h-9 rounded-md bg-darkBlue text-white hover:font-semibold hover:scale-105 transition-all hover:bg-purple-400 hover:shadow-md flex-grow-1 md:flex-grow-0"
              type="submit"
            >
              Save
            </button>
            <button
              disabled={createSlaMutation.isPending}
              className="md:w-48 flex-grow  rounded-md h-9 border-2 border-darkBlue bg-white hover:bg-lightPink hover:border-lightPink hover:text-white hover:scale-105 transition-all md:flex-grow-0"
            >
              Cancel
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const EntryComponent = ({ title, state }: slaEntry) => {
  return (
    <div className="flex items-center gap-2 my-2 group">
      <p className="text-[0.7275rem] text-neutral-500 peer peer-aria-checked:text-blue-400 peer-checked:text-blue-400 group-checked:text-blue-400">
        {title}
      </p>
      <Checkbox
        className="ml-auto border-2 ring-[1px] dark:checked:text-blue-500 dark:aria-checked:text-blue-500  ring-neutral-200 checked:ring-0 aria-checked:ring-0 peer"
        defaultChecked={state}
      />
    </div>
  );
};



const DataEntries = () => {
  return (
    <div className="flex  mt-2 flex-wrap lg:gap-4 gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[0.75rem] text-darkBlue font-semibold">
          Resolution Time
        </p>
        <Input
          className="w-48 h-9 border-2 md:flex-grow-0  border-neutral-200 bg-white outline-none ring-0 dark:ring-0 dark:bg-white px-2 text-[0.75rem]"
          placeholder="e.g 4h 30m"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[0.75rem] text-darkBlue font-semibold">
          Response Time
        </p>
        <Input
          className="w-48 h-9 border-2 border-neutral-200 bg-white outline-none ring-0 dark:ring-0 dark:bg-white px-2 text-[0.75rem]"
          placeholder="e.g 4h 30m"
        />
      </div>
    </div>
  );
};
