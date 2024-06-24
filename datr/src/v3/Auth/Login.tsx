import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { useAuth } from "@/api/useAuth";
import { home_pages } from "../data";
import { MdError } from "react-icons/md";
export const Login = () => {
    const {generalUpdate}=useAuth()
  const loginFormSchema = z.object({
    email: z
      .string()
      .min(3, { message: "Enter a Valid Email" })
      .email("This is not a valid email")
      .default(""),
    password: z
      .string()
      .min(1, { message: "Please type in a valid password" })
      .default(""),
  });
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });
  const [visibilityMode, setVisibilityMode] = useState<"password" | "text">(
    "password"
  );
  const nav=useNavigate()
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (values: z.infer<typeof loginFormSchema>) =>
      new Promise((resolve, reject) =>
        axios("http://176.58.117.18:8080/api/users/login", {
          method: "Post",
          data: values,
        })
          .then((resp: AxiosResponse) => resolve(resp))
          .catch((err: AxiosError) => reject(err))
      ),
  });
  const tryLogin = (values: z.infer<typeof loginFormSchema>) => {
    toast.promise(
      new Promise((resolve, reject) => {
        loginMutation.mutate(values, {
          onSuccess: (resolvedData:any, variables, context) => {
            const { access_token, refresh_token, data } = resolvedData.data;
            resolve(resolvedData);
            generalUpdate({
              access_token,
              refresh_token,
              user: data,
              verified: data.verified,
            });
            resolve(resolvedData);
            console.log(data,resolvedData)
            if (!data.verified) {
              setTimeout(() => {
                nav("/Verify");
              }, 1000);
              return;
            }
            setTimeout(() => {
                console.log("navving to home page")
                const home_page=home_pages[data.roles[data.roles.length - 1] as keyof typeof home_pages]
                nav(home_page as string);
              }, 1000);
          },
        });
      }),
      {
        loading: "Trying to login...",
        success:"Logged In Successfully!",
        error:(error)=>{
            return (
                <div className="text-black flex flex-col">
                  <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                    <MdError /> Error
                  </p>
                  <p>{error.response.data.message || error.response.data.detail}</p>
                </div>
              );
        }
      }
    );
  };
  return (
    <main className="bg-ncBlue flex justify-center w-full min-h-screen relative">
      <img
        src={
          "https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"
        }
        alt=""
        className="absolute   left-8  w-[20vw]  md:w-[10vw] aspect-square top-8 "
      />
      <div className="pt-6 pb-16 px-8 bg-[#FFFFFF] h-max min-h-[70vh] md:w-[50%]  flex lg:w-[40%] xl:w-[35%] mt-[12vh] rounded-xl border-[1px] border-[#B9B9B9] flex-col max-h-screen">
        <p className="font-[600] text-center text-2xl font-nunito-sans w-full text-ncBlue mt-4">
          Login to Account
        </p>
        <p className="mt-3 w-full text-center text-sm text-neutral-400">
          Please enter your email and password to continue
        </p>
        <Form {...form}>
          <form className="w-[90%] mx-auto text-start space-y-4" onSubmit={form.handleSubmit(tryLogin)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mt-5 space-y-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="w-full h-10 p-2 rounded-none border-[1px] dark:bg-[#F1F4F9] bg-[#F1F4F9] dark:border-[#D8D8D8] border-[#D8D8D8] transition-all focus:border-darkBlue text-[0.77rem]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter your Email here.</FormDescription>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative w-full space-y-3">
                  <FormLabel>Password</FormLabel>
                  <div className="relative ">
                    <FormControl>
                      <Input
                        type={visibilityMode}
                        placeholder="Password"
                        className="w-full h-10 p-2 rounded-none border-[1px] dark:bg-[#F1F4F9] bg-[#F1F4F9] dark:border-[#D8D8D8] border-[#D8D8D8] transition-all focus:border-darkBlue text-[0.77rem]"
                        {...field}
                      />
                    </FormControl>
                    {visibilityMode === "password" ? (
                      <div
                        role="button"
                        onClick={() => {
                          setVisibilityMode((state) =>
                            state === "password" ? "text" : "password"
                          );
                        }}
                        className="absolute top-1/2  right-2 -translate-y-1/2"
                      >
                        <Eye className="w-5 h-5 shrink " />
                      </div>
                    ) : (
                      <div
                        role="button"
                        onClick={() => {
                          setVisibilityMode((state) =>
                            state === "password" ? "text" : "password"
                          );
                        }}
                        className="absolute top-1/2  right-2 -translate-y-1/2"
                      >
                        <EyeOff className="w-5 h-5 shrink " />
                      </div>
                    )}
                  </div>

                  <FormDescription>
                    Ensure to keep your password a secret!
                  </FormDescription>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Link
                to={"/forgot-password"}
                className="text-[13px] w-max ml-auto text-ncBlue"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              className="w-full h-10 flex items-center justify-center bg-ncBlue rounded-lg text-white"
              disabled={form.formState.isSubmitting}
            >
              Login
            </button>
            <div className="flex items-center gap-x-1 text-[13px] justify-center">
              <p>Don't Have an Account?</p>
              <Link className="text-ncBlue " to={"/Create-Account"}>
                Create Account
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};
