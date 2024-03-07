import React from "react";
import logo from "/NCAA.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
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
import { useAuthStore } from "@/store/AuthStore";
import {useAxiosClient} from '../../api/useAxiosClient.jsx'
import { toast } from "@/components/ui/use-toast";
import { containsSpecialCharacter } from "@/lib/utils.js";
const ResetPassword = () => {
  const nav = useNavigate();
  const {axios} =useAxiosClient()
  const email=useAuthStore((state)=>state.user.email)

  const formSchema = z
    .object({
      password: z
        .string()
        .min(6, {
          message: "Password is too short!",
        })
        .refine((value) => containsSpecialCharacter(value), {
          message: "Password must contain a special character",
        }),
      confirmPassword: z
        .string()
        .min(6, {
          message: "Password is too short!",
        })
        .refine((value) => containsSpecialCharacter(value), {
          message: "Password must contain a special character",
        }),
      otp: z.string().length(6, {
        message: "OTP must be 6 characters long!",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Password don't match",
    });
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const resetPassword=async(values:{password:string,confirmPassword:string,otp:string})=>{
    const {password,confirmPassword,otp}=values
    
    await axios('/password/effect-forgot-password',{
      method:"PUT",
      data:{
        newPassword:password,
        confirmPassword,
        otp,
        email
      }
    }).then((resp:any)=>{
      toast({
        title:"Success!",
        description:resp.data.message,
        variant:"default"
      })
      setTimeout(()=>{
        nav('/Home')
      },1500)
    }).catch((err:any)=>{
      console.log(err)
      toast({
        title:"Error!",
        description:String(err.message).includes("400")?"Invalid OTP!":err.message,
        variant:"destructive"
      })
    })
  }
  return (
    <main className="w-full h-screen grid place-items-center relative overflow-hidden">
      <div className="lg:w-[35%] xl:w-[30%] md:w-[45%] w-[80%]  p-2 bg-white shadow-md rounded-lg border-2 border-neutral-200 flex flex-col pt-2 pb-8">
        <img
          src={logo}
          className="w-[70%] mx-auto aspect-video object-contain "
          alt=""
        />
        <div className="flex-1 w-[80%] text-center mx-auto flex flex-col">
          <p className="text-[1.4rem] font-semibold text-neutral-700">
            Password Change Required
          </p>
          <p className="my-2 text-[0.77rem] text-neutral-400">
            In order to protect your account and the CPD system, you are
            required to change your default generated password on your first
            login.
          </p>

          <Form {...form} >
            <form className="flex flex-col" onSubmit={form.handleSubmit(resetPassword)}>
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="text-darkBlue text-[0.8rem]">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                          {...field}
                          type="password"
                          placeholder="Password"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col items-start my-2">
                      <FormLabel className="text-darkBlue text-[0.8rem]">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                          {...field}
                          type="password"
                          placeholder="Password"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  );
                }}
              />

<FormField
                name="otp"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col items-start my-2">
                      <FormLabel className="text-darkBlue text-[0.8rem]">
                        OTP
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                          {...field}
                          
                          placeholder="123456"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  );
                }}
              />
                 <p className="my-2 text-[0.77rem] text-neutral-400">
            Your new password must be at least 6 characters long and must
            contain a special character.
          </p>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className=" w-full mt-auto dark:bg-darkBlue bg-darkBlue dark:text-white text-white dark:hover:bg-darkBlue hover:bg-darkBlue rounded-lg"
          >
           Reset Password
          </Button>
            </form>
          </Form>

       
        </div>
      </div>
      <img
        src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1706869558/private/NCAALogo_l7hkhg.png"
        className="absolute bottom-0 w-[420px] aspect-square translate-y-1/2 right-0 translate-x-1/3 z-[-1]"
        alt=""
      />
    </main>
  );
};

export default ResetPassword;
