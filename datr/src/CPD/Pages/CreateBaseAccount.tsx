import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import logo from "/NCAALogo.png";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn, containsSpecialCharacter } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeft, ArrowLeftSquare, ArrowRightSquare } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {toast as SonnerToast} from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { airlines as ActiveAirlines } from "@/data.ts";
type airlineRegisterFrom = UseFormReturn<
  {
    email: string;
    firstName: string;
    lastName: string;
    airlineName: string;
    password: string;
    contactAddress: string;
    contactNumber: string;
  },
  any,
  undefined
>;

export const CreateBaseAccount = () => {
  const [asAirline, setAsAirline] = useState(false);
  return (
    <>
      {asAirline ? (
        <CreateAirlineAccount />
      ) : (
        <UserAccountForm setAsAirline={setAsAirline} />
      )}
    </>
  );
};

const UserAccountForm: React.FC<{
  setAsAirline: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setAsAirline }) => {
  const formSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1, {
      message: "Enter a valid first name!",
    }),
    lastName: z.string().min(1, {
      message: "Enter a valid last name!",
    }),
    password: z
      .string()
      .min(8, {
        message: "Enter a valid Password!",
      })
      .default("")
      .refine((value) => containsSpecialCharacter(value), {
        message: "Password must contain a special character",
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const nav = useNavigate();

  const createAccountMutation = useMutation({
    mutationKey: ["createAccount"],
    mutationFn: (values: Partial<z.infer<typeof formSchema>>) =>
      axios("http://176.58.117.18:8080/api/users/create", {
        method: "POST",
        data: { ...values },
      })
        .then((resp: any) => {
          toast({
            title: "Success!",
            description: "Account Successfully created!",
          });
          setTimeout(() => {
            nav("/");
          }, 1500);
        })
        .catch((err: any) => {
          console.log(err);
          toast({
            title: "Error!",
            description: err.response.data.message,
            variant: "destructive",
          });
        }),
  });
  const trySubmitForm = (values: z.infer<typeof formSchema>) => {
    const { email, firstName, lastName, password } = values;

    createAccountMutation.mutate({ email, firstName, lastName, password });
  };
  return (
    <section className="w-full min-h-screen bg-neutral-100 grid place-items-center relative overflow-hidden ">
      <img
        src={"https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"}
        alt=""
        className="absolute  opacity-30 left-0 -translate-x-1/3 w-[440px] top-0 -translate-y-1/4 "
      />
      <div
        onClick={() => {
          nav("/");
        }}
        className="absolute left-4 top-4 w-12 hover:scale-105 transition-all hover:cursor-pointer aspect-square bg-white rounded-bl-xl rounded-tr-xl grid place-items-center"
      >
        <ArrowBigLeft />
      </div>
      <div className="min-w-[420px] px-5 py-4 bg-white rounded-md shadow-md xl:w-[32%] shadow-blue-100/50 relative z-20">
        <p className="text-2xl text-center font-[800]">Create Your Account</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(trySubmitForm)}
            className="space-y-4"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      placeholder="abc@ncaa.gov.ng"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">First Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      placeholder="Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[0.75rem]">
                    Password must be at least 8 characters long and must contain
                    a special character.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex my-2 items-center space-x-2">
             
              <p className="text-sm  text-neutral-700 hover:text-blue-400 cursor-pointer mx-auto" onClick={()=>setAsAirline(true)}>Register as Airline?</p>
            </div>

            <button
              className="w-full h-8 grid place-items-center disabled:bg-neutral-400 disabled:hover:bg-neutral-600 disabled:text-black text-white bg-lightPink hover:bg-darkBlue transition-all rounded-xl text-[0.75rem] hover:font-semibold hover:scale-[1.01]"
              disabled={createAccountMutation.isPending}
              type="submit"
            >
              Submit
            </button>
          </form>
        </Form>
      </div>
      <img
        src={"https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"}
        alt=""
        className="absolute w-[320px] right-0 translate-x-1/2 bottom-0  opacity-30"
      />
    </section>
  );
};

const CreateAirlineAccount: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const formSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1, {
      message: "Enter a valid first name!",
    }),
    lastName: z.string().min(1, {
      message: "Enter a valid last name!",
    }),
    airlineName: z.string().min(1, {
      message: "Enter a valide airline name!",
    }),
    password: z
      .string()
      .min(8, {
        message: "Enter a valid Password!",
      })
      .default("")
      .refine((value) => containsSpecialCharacter(value), {
        message: "Password must contain a special character",
      }),
    contactAddress: z.string().min(1, {
      message: "Enter a valid contact Address",
    }),
    contactNumber: z.string().length(11, {
      message: "Contact Number must be 11 characters long",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const nav = useNavigate();
  const createAccountMutation=useMutation({
    mutationKey:["account","new"],
    mutationFn:(values:z.infer<typeof formSchema>)=>new Promise((resolve,reject)=>
      axios("http://176.58.117.18:8080/api/airlines/accounts/request", {
    method: "POST",
    data: { airlineName:values.airlineName,email:values.email,lastName:values.lastName,firstName:values.firstName,password:values.password,contactAddress:values.contactAddress,contactNumber:values.contactNumber },
}).then((resp)=>resolve(resp)).catch((err)=>reject(err))
)  
  })
  const trySubmit=(values:z.infer<typeof formSchema>)=>{
    console.log(values)

    SonnerToast.promise(
      new Promise((resolve, reject) =>
        createAccountMutation.mutate(
          values,
          {
            onSuccess: (res) => {
              resolve(res);
             setTimeout(()=>{
              nav('/')
             },1500)
            },
            onError: (err) => {
              console.log(err)
              reject(err)
            },
          }
        )
      ),
      {
        loading: "Trying to Create Account...",
        success: "Account Created Succesfully.",
        error:(err)=>{
          return <div className="text-black font-semibold">
              <p className="text-sm">
                {err.response.data.message}
              </p>
          </div>
        },
      }
    );
  }
  return (
    <section className="w-full h-screen relative flex items-center justify-center overflow-hidden">
      <img
        src={"https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"}
        alt=""
        className="absolute   opacity-30 left-0 -translate-x-1/3 w-[440px] top-0 -translate-y-1/4 "
      />
      <img
        src={"https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"}
        alt="logo"
        className="absolute w-[320px] right-0 translate-x-1/2 bottom-0  opacity-30"
      />
      <div
        onClick={() => {
          nav("/");
        }}
        className="absolute left-4 top-4 w-12 shadow-md hover:scale-105 transition-all hover:cursor-pointer aspect-square bg-white rounded-bl-xl rounded-tr-xl grid place-items-center"
      >
        <ArrowBigLeft />
      </div>
      <div className="md:w-2/3 lg:w-1/2 mx-auto rounded-md pb-4 bg-white shadow-md  p-4 my-auto">
        <Stepper
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          steps={["Account information", "Airline Information"]}
        />
        <section>
         <Form {...form}>
       <form onSubmit={form.handleSubmit(trySubmit)}>
       <DisplayFormStep step={currentStep} form={form} />
       </form>
         </Form>
        </section>
        <StepperControls
          current={currentStep}
          maxLength={2}
          setCurrent={setCurrentStep}
        />
      </div>
    </section>
  );
};
const DisplayFormStep = ({
  step,
  form,
}: {
  step: number;
  form: airlineRegisterFrom;
}) => {
  switch (step) {
    case 1:
      return <AirlineUserInformation form={form} />;
    case 2:
      return <AirlineAccountInformation form={form} />;
    default:
      return <AirlineUserInformation form={form} />;
  }
};

const Stepper = ({
  steps,
  currentStep,
  setCurrentStep,
}: {
  steps: any[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [newStep, setNewStep] = useState<any[]>([]);
  const stepRef = useRef<any>();
  const updateSteps = (stepNumber: number, steps: any[]) => {
    const _newSteps = [...steps];
    let count = 0;
    while (count < newStep.length) {
      if (count === stepNumber) {
        _newSteps[count] = {
          ..._newSteps[count],
          highlighted: true,
          selected: true,
          completed: true,
        };
        count++;
      } else if (count < stepNumber) {
        _newSteps[count] = {
          ..._newSteps[count],
          highlighted: false,
          selected: true,
          completed: true,
        };

        count++;
      } else {
        _newSteps[count] = {
          ..._newSteps[count],
          highlighted: false,
          selected: false,
          completed: false,
        };
        count++;
      }
    }
    console.log(_newSteps);
    return _newSteps;
  };
  useEffect(() => {
    const stepState = steps.map((step, index) =>
      Object.assign(
        {},
        {
          description: step,
          completed: false,
          highlighted: index === 0 ? true : false,
          selected: index === 0 ? true : false,
        }
      )
    );
    stepRef.current = stepState;
    const current = updateSteps(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  return (
    <div className="flex items-center justify-between mb-4">
      {newStep.map((step, index) => (
        <div className="w-full flex items-center  flex-row">
          <div className="relative flex w-full items-center flex-row">
            <div
              className={cn(
                "flex-auto mx-2  h-1 bg-gradient-to-r from-blue-50 to-blue-200 transition duration-500 my-auto",
                !step.highlighted && "from-neutral-50 to-neutral-200"
              )}
            ></div>

            <div
              role="button"
              onClick={() => {
                setCurrentStep(index + 1);
              }}
              className={cn(
                "rounded-full transition-all duration-500 ease-in-out border-2 border-neutral-100 hover:scale-110  grid place-items-center h-12 aspect-square text-darkBlue font-semibold py-2",
                step.highlighted && "bg-darkBlue text-white "
              )}
            >
              <p>{index}</p>
            </div>

            <div className="left-1/2 -translate-x-1/2 right-0  w-32 text-xs absolute top-full mt-1 font-medium uppercase whitespace-nowrap">
              <p>{step.description}</p>
            </div>
            <div
              className={cn(
                "flex-auto mx-2  h-1 bg-gradient-to-r from-blue-50 to-blue-200 transition duration-500 my-auto",
                !step.highlighted && "from-neutral-50 to-neutral-200"
              )}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StepperControls: React.FC<{
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  current: number;
  maxLength: number;
}> = ({ setCurrent, current, maxLength }) => {
  return (
    <div className=" flex items-center justify-between w-2/3 mx-auto space-x-3 mb-2">
      <button
        disabled={current == 1}
        onClick={() => {
          setCurrent((state) => state - 1);
        }}
        className={cn("bg-darkBlue group rounded-xl p-2 w-16 hover:w-32 h-10 transition-all ease-in-out duration-300 flex items-center justify-center text-white text-[0.725rem] gap-2 font-semibold hover:shadow-md",current===1&&"hidden")}
      >
        <ArrowLeftSquare className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 ease-in-out transition duration-300 hidden group-hover:block" />{" "}
        Previous
      </button>
      <button
        disabled={current == maxLength}
        onClick={() => {
          setCurrent((state) => state + 1);
        }}
        className={cn("bg-lightPink group rounded-xl p-2 w-16 hover:w-32 h-10 transition-all ease-in-out duration-300 flex items-center justify-center text-white text-[0.725rem] gap-2 font-semibold hover:shadow-md",current===maxLength &&"hidden")}
      >
        Next{" "}
        <ArrowRightSquare className="w-5 h-5 shrink opacity-0 group-hover:opacity-100 ease-in-out transition duration-300 hidden group-hover:block" />{" "}
      </button>
    </div>
  );
};

const AirlineUserInformation = ({ form }: { form: airlineRegisterFrom }) => {
  return (
    <AnimatePresence>
      <section className="flex  mt-8 mb-4">
  
         <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 100 }}
        exit={{ y: 50, opacity: 0 }}
        className="mb-2 mt-6 w-full flex flex-row space-x-3"
      >
            <img
          src="https://cdn.leonardo.ai/users/7bda8348-b1e4-4a39-9a81-416840f7afad/generations/22f662b9-496f-4bcd-be86-7b58d4baa917/variations/Default_abstract_vibrant_modern_illustration_0_22f662b9-496f-4bcd-be86-7b58d4baa917_0.jpg"
          className="w-1/3 h-[400px] object-cover rounded-md my-2"
          alt=""
        />
         
      
          <div className="grid grid-cols-1 flex-auto w-full md:w-[80%] mx-auto gap-y-2 gap-x-4 ">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      placeholder="abc@ncaa.gov.ng"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="font-semibold">First Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="font-semibold">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      placeholder="Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[0.75rem]">
                    Password must be at least 8 characters long and must contain
                    a special character.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        
      </motion.div>
      </section>
     
    </AnimatePresence>
  );
};

const AirlineAccountInformation = ({ form }: { form: airlineRegisterFrom }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 100 }}
        exit={{ x: 20, opacity: 0 }}
        className="mb-4 mt-10 flex flex-row space-x-2"
      >
        <img
          src="https://cdn.leonardo.ai/users/7bda8348-b1e4-4a39-9a81-416840f7afad/generations/22f662b9-496f-4bcd-be86-7b58d4baa917/variations/Default_abstract_vibrant_modern_illustration_0_22f662b9-496f-4bcd-be86-7b58d4baa917_0.jpg"
          className="w-1/3 h-[400px] object-cover rounded-md my-2"
          alt=""
        />
        <div className="flex flex-col flex-auto">
          <p className="font-semibold text-lg text-center w-full ">
            Airline Information
          </p>
          
            <div className="space-y-3" >
              <FormField
                name="airlineName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="font-semibold">
                      Airline Name
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-white dark:bg-white outline-none focus:outline-none focus-within:ring-transparent dark:focus:ring-transparent dark:ring-offset-blue-400 ring-offset-blue-400">
                          <SelectValue placeholder="Select An Airline"/>
                        </SelectTrigger>
                        <SelectContent>
                          {
                            ActiveAirlines.map((airline,index)=>(
                              <SelectItem value={airline} key={`${airline}-${index}`}>{airline}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="contactAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="font-semibold">
                      Contact Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                        placeholder="Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="contactNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="font-semibold">
                      Contact Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                        placeholder="Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
            </div>
            {Object.keys(form.formState.errors).length > 0 && (
    <p className="text-red-500 w-full text-center font-thin text-[0.8275rem]">
     {`${Object.keys(form.formState.errors).length} invalid ${Object.keys(form.formState.errors).length===1?'Field':'Fields'}.`}
    </p>
  )}
          <Button type="submit"  className="mt-auto hover:bg-lightPink hover:text-white transition duration-300 dark:hover:bg-lightPink rounded-lg">Submit Request</Button>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
