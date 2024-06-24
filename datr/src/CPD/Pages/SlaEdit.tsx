import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useLocation } from "react-router";
import { SearchPage } from "@/Reusable/SearchPage.jsx";
import { useAxiosClient } from "@/api/useAxiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Timepicker } from "@/components/ui/Timepicker";
import { Input } from "@/components/ui/input";
import {
  pauseSlaEntries,
  startSlaEntries,
  stopEntries,
} from "@/CPD/data/data.tsx";
import { Label } from "@/components/ui/label";
import { SingleSlaWrapper } from "@/components/ui/Slawrapper";
import { toast } from "sonner";
import { MdArrowBack } from "react-icons/md";
type requestbody = {
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
};

export const SlaEdit = () => {
  const location = useLocation();
  const slaName = new URLSearchParams(location.search)
    .get("slaName")
    ?.replace("_", " ");

  if (!slaName) return <Navigate to={"/CPD/Dashboard"} />;
  const nav = useNavigate();
  const { axios } = useAxiosClient();
  const [canSubmit, setCanSubmit] = useState(false);
  const getSlaQuery = useQuery({
    queryKey: ["sla", `${slaName}`],
    queryFn: () =>
      axios(`admin/sla/name?value=${slaName}`, {
        method: "GET",
      })
        .then((resp: any) => {
          console.log(resp.data);
          return resp.data;
        })
        .catch((err: Error) => err),
  });
  const editSlaQuery = useMutation({
    mutationKey: ["sla", "edit", slaName],
    mutationFn: (data: requestEntry[]) =>
      new Promise((resolve, reject) => {
        axios(`admin/sla/name?value=${slaName}`, {
          method: "PATCH",
          data,
        })
          .then((resp: any) => {
            resolve(resp.data);
          })
          .catch((err: Error) => {
            reject(err);
          });
      }),
  });
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

  const editSlaForm = useForm<z.infer<typeof newSlaSchema>>({
    mode: "all",
    defaultValues: useMemo(() => {
      return {
        slaName: getSlaQuery.data?.slaName,
        resolutionTime: `${getSlaQuery.data?.resolutionHour} ${getSlaQuery.data?.resolutionMinute}`,
        responseTime: `${getSlaQuery.data?.responseHour} ${getSlaQuery.data?.responseMinute}`,
        resolutionDay: getSlaQuery.data?.resolutionDay,
        responseDay: getSlaQuery.data?.responseDay,
        slaPauseCondition: getSlaQuery.data?.slaPauseCondition,
        slaStartCondition: getSlaQuery.data?.slaStartCondition,
        slaResetCondition: getSlaQuery.data?.slaResetCondition

      }
    }, [getSlaQuery.isSuccess]),
    resolver: zodResolver(newSlaSchema),
  });
  type requestEntry = {
    op: string;
    path: string;
    value: string | number;
  };
  const tryEditSla = (values: z.infer<typeof newSlaSchema>) => {
    const requestBody: requestEntry[] = [
      { op: "replace", path: "/slaName", value: values.slaName },
      {
        op: "replace",
        path: "/resolutionDay",
        value: parseInt(values.resolutionDay),
      },
      {
        op: "replace",
        path: "/resolutionHour",
        value: parseInt(values.resolutionTime.split(" ")[0]),
      },
      {
        op: "replace",
        path: "/resolutionMinute",
        value: parseInt(values.resolutionTime.split(" ")[1]),
      },
      {
        op: "replace",
        path: "/responseDay",
        value: parseInt(values.responseDay),
      },
      {
        op: "replace",
        path: "/responseHour",
        value: parseInt(values.responseTime.split(" ")[0]),
      },
      {
        op: "replace",
        path: "/responseMinute",
        value: parseInt(values.responseTime.split(" ")[1]),
      },
      {
        op: "replace",
        path: "/slaStartCondition",
        value: values.slaStartCondition,
      },
      {
        op: "replace",
        path: "/slaPauseCondition",
        value: values.slaPauseCondition,
      },
      {
        op: "replace",
        path: "/slaResetCondition",
        value: values.slaResetCondition,
      },
    ];

    toast.promise(
      new Promise((resolve, reject) => {
        editSlaQuery.mutate(requestBody, {
          onSuccess: (res) => {
            resolve(res);
            setTimeout(() => {
              nav("/CPD/Configuration/Sla");
            }, 1000);
          },
          onError: (err) => {
            reject(err);
          },
        });
      }),
      {
        loading: "Trying to edit SLA...",
        success: "Sla Edited Successfully!",
        error: (err: Error) => {
          return (
            <div>
              <p>{err.message}</p>
            </div>
          );
        },
      }
    );
  };

  useEffect(() => {

    if (getSlaQuery.isSuccess && !editSlaForm.formState.isDirty) {
      const {
        slaName,
        responseDay,
        resolutionDay,
        slaPauseCondition,
        slaStartCondition,
        slaResetCondition,
      } = getSlaQuery.data;
      editSlaForm.reset({
        slaName,
        responseDay: `${responseDay}`,
        resolutionDay: `${resolutionDay}`,
        slaPauseCondition,
        slaResetCondition,
        slaStartCondition,
        resolutionTime: `${getSlaQuery.data.resolutionHour} ${getSlaQuery.data.resolutionMinute}`,
        responseTime: `${getSlaQuery.data.responseHour} ${getSlaQuery.data.responseMinute}`,
      });

    }
  }, [getSlaQuery.isSuccess]);
  return (
    <section className=" w-full  p-4 lg:p-2">
      <div role="button" onClick={()=>{nav(-1)}} className="w-6 rounded-md h-6 flex items-center justify-center bg-ncBlue text-white">
        <MdArrowBack className="w-4 h-4 shrink"/>
      </div>
       <p className="my-2 text-xl font-semibold text-ncBlue">Edit Sla</p>
        <p className="my-4 text-[0.725rem] font-semibold">
          Time will be measured between Start and Stop conditions below.
        </p>
        {getSlaQuery.isSuccess && (
          <Form {...editSlaForm}>
            <form onSubmit={editSlaForm.handleSubmit(tryEditSla)}>
              <FormField
                name="slaName"
                control={editSlaForm.control}
                render={({ field }) => {
                  // console.log(field.value)
                  // field.defaultValue=
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-2 my-4">
                          <Label htmlFor="Name">Sla Name</Label>
                          <Input
                            defaultValue={getSlaQuery.data.slaName}
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
                  control={editSlaForm.control}
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
                            active={getSlaQuery.data.slaStartCondition}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                ></FormField>
                <FormField
                  name="slaPauseCondition"
                  control={editSlaForm.control}
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
                            active={getSlaQuery.data.slaPauseCondition}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                ></FormField>
                <FormField
                  name="slaResetCondition"
                  control={editSlaForm.control}
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
                            active={getSlaQuery.data.slaResetCondition}
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
                Issues will be checked against this list,top to bottom and
                assigned a time target.
              </p>
              <div className="flex items-start gap-x-2 my-2 flex-wrap">
                <div className="">
                  <FormField
                    name="resolutionDay"
                    control={editSlaForm.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-col gap-1">
                              <p className="text-[0.75rem] text-darkBlue font-semibold">
                                Resolution Days
                              </p>
                              <Input
                                defaultValue={`${getSlaQuery.data.resolutionDay} days`}
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
                                    value = parseInt(value || "0")
                                      .toString()
                                      .substring(0, value.length - 4)
                                      .trim(); // Remove "days" from the end
                                  }
                                  if (/^\d+$/.test(value)) {
                                    e.target.value = parseInt(
                                      value || "0"
                                    ).toString(); // Set input value to processed value
                                  } else {
                                    value = ""; // Set value to empty string if it contains non-digit characters
                                    e.target.value = parseInt(
                                      value || "0"
                                    ).toString(); // Update input value
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
                    control={editSlaForm.control}
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
                                defaultTimeValue={{
                                  hours: getSlaQuery.data.resolutionHour,
                                  minutes: getSlaQuery.data.resolutionMinute,
                                }}
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
                    control={editSlaForm.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-col gap-1">
                              <p className="text-[0.75rem] text-darkBlue font-semibold">
                                Response Days
                              </p>
                              <Input
                                defaultValue={`${getSlaQuery.data.responseDay} days`}
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
                    control={editSlaForm.control}
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
                                defaultTimeValue={{
                                  hours: getSlaQuery.data.responseHour,
                                  minutes: getSlaQuery.data.responseMinute,
                                }}
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
                  className="md:w-48 w-full disabled:bg-neutral-100 disabled:text-black disabled:ring-1 disabled:ring-neutral-500 disabled:hover:scale-100 disabled:hover:cursor-not-allowed disabled:hover:shadow-none h-9 rounded-md bg-darkBlue text-white hover:font-semibold hover:scale-105 transition-all hover:bg-purple-400 hover:shadow-md flex-grow-1 md:flex-grow-0"
                  type="submit"
                  disabled={!editSlaForm.formState.isDirty}
                >
                  Save
                </button>
                <button className="md:w-48 flex-grow  rounded-md h-9 border-2 border-darkBlue bg-white hover:bg-lightPink hover:border-lightPink hover:text-white hover:scale-105 transition-all md:flex-grow-0">
                  Cancel
                </button>
              </div>
            </form>
          </Form>
        )}
 
    </section>
  );
};
