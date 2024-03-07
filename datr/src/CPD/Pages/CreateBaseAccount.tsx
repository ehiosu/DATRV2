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

import { Input } from "@/components/ui/input";
import { containsSpecialCharacter } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as z from "zod";
import {useMutation} from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
export const CreateBaseAccount = () => {
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
      }).default("")
      .refine((value) => containsSpecialCharacter(value), {
        message: "Password must contain a special character",
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const nav=useNavigate()

  const createAccountMutation=useMutation({
    mutationKey:["createAccount"],
    mutationFn:(values:z.infer<typeof formSchema>)=>axios('http://localhost:8080/api/users/create',{
      method:"POST",
      data:{...values}
    }).then((resp:any)=>{
      toast({
        title:"Success!",
        description:"Account Successfully created!"
      })
      setTimeout(()=>{
        nav('/')
      },1500)
    }).catch((err:Error)=>{
      console.log(err)
      toast({
        title:"Error!",
        description:err.message==="Cannot read properties of undefined (reading 'status')"?"Connect to the internet and try again! or Contact support":err.message,
        variant:"destructive"
      })
    })
  })
  const trySubmitForm=(values:z.infer<typeof formSchema>)=>{
    createAccountMutation.mutate(values)
  }
  return (
    <section className="w-full min-h-screen bg-neutral-100 grid place-items-center relative overflow-hidden ">
      <img
            src={logo}
            alt=""
            className="absolute  opacity-30 left-0 -translate-x-1/3 w-[440px] top-0 -translate-y-1/4"
          />
      <div onClick={()=>{nav("/")}} className="absolute left-4 top-4 w-12 hover:scale-105 transition-all hover:cursor-pointer aspect-square bg-white rounded-bl-xl rounded-tr-xl grid place-items-center">
          <ArrowBigLeft/>
      </div>
      <div className="min-w-[420px] px-5 py-4 bg-white rounded-md shadow-md xl:w-[32%] shadow-blue-100/50">
        <p className="text-2xl text-center font-[800]">Create Your Account</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(trySubmitForm)}  className="space-y-4">
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

            <button className="w-full h-8 grid place-items-center disabled:bg-neutral-400 disabled:hover:bg-neutral-600 disabled:text-black text-white bg-lightPink hover:bg-darkBlue transition-all rounded-xl text-[0.75rem] hover:font-semibold hover:scale-[1.01]" disabled={createAccountMutation.isPending} type="submit">Submit</button>
          </form>
        </Form>
      </div>
      <img
          src={logo}
          alt=""
          className="absolute w-[320px] right-0 translate-x-1/2 bottom-0  opacity-30"
        />
    </section>
  );
};
