import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CiLogin } from "react-icons/ci";
import { useNavigate } from "react-router";
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
} from "../../components/ui/form";
import { useToast } from "../../components/ui/use-toast";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../api/useAuth";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
const home_pages = {
  CPO: "/CPD/Tickets",
  DGO: "/CPD/Dashboard",
  SHIFT_SUPERVISOR: "/CPD/Dashboard",
  TERMINAL_SUPERVISOR: "/CPD/Dashboard",
  AIRLINE: "/CPD/Tickets",
  ADMIN: "/CPD/Dashboard",
};
// import { useAxiosClient } from "../../api/useAxiosClient";
export const AuthForm = () => {
  const { generalUpdate, access, refresh, user } = useAuth();
  console.log(access);
  // const { axios } = useAxiosClient();
  const { toast } = useToast();
  const Navigate = useNavigate();
  const [visibilityMode, setVisibilityMode] = useState("password");
  const LoginSchema = z.object({
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
    resolver: zodResolver(LoginSchema),
  });

  const tryLogin = async (values) => {
    if (!values.email || !values.password) {
      throw new Error("Ensure both fields are filled");
    }
    try {
      const resp = await axios("http://176.58.117.18:8080/api/users/login", {
        method: "Post",
        data: values,
      });
      if (resp) {
        const { access_token, refresh_token, data } = resp.data;
        console.log(resp.data);
        generalUpdate({
          access_token,
          refresh_token,
          user: data,
          verified: data.verified,
        });
        if (!data.verified) {
          setTimeout(() => {
            Navigate("/Verify");
          }, 1000);
          return;
        }
        Navigate(home_pages[data.roles[data.roles.length - 1]]);
      }
    } catch (err) {
      if ((err.message = "Request failed with status code 401")) {
        toast({
          title: "Error Logging in",
          description: "Invalid username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error Logging in",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section className="w-full h-full   md:p-2 p-6 mt-4 ">
      <div className="mx-auto">
        <p className="lg:text-2xl text-3xl">Welcome Back</p>
      </div>
      <div className="flex md:gap-4 gap-8  flex-1 h-full md:flex-row flex-col    justify-center ">
        <div className="flex-1  flex flex-col  justify-center p-2 ">
          <button
            className="lg:w-[80%] w-full mx-auto bg-[#FF007C] h-12 text-white rounded-md  flex justify-center gap-2 items-center shadow-md lg:p-0"
            onClick={() => {
              if (refresh) {
                Navigate("/Home");
              }
            }}
          >
            <span>Company Single Sign-On</span>{" "}
            <CiLogin className=" w-8 h-8 rounded-full p-1 hover:w-10 hover:h-10 text-sm hover:text-sm hover:p-2 hover:shadow-sm transition-[1s] bg-[#FFF] text-[#FF007C] hover:text-black " />{" "}
          </button>
        </div>

        <div className="flex-grow-[0.25] flex lg:flex-col justify-center items-center">
          <span className="line lg:h-[48%] bg-black lg:w-[2px] w-[40%] opacity-25  h-[2px]"></span>
          <span className="leading-10 text-xl lg:w-auto w-[50px]">OR</span>
          <span className="line lg:h-[48%]  w-[40%] bg-black lg:w-[2px] opacity-25 h-[2px]"></span>
        </div>
        <div className="flex-1  w-full flex flex-col  justify-center p-2 mt-4">
          {refresh ? (
            <button
              className="lg:w-[90%] mx-auto w-full h-12 flex items-center justify-center bg-lightPink rounded-lg text-white my-2"
              onClick={() => {
                Navigate(home_pages[user.roles[user.roles.length - 1]]);
              }}
            >
              {" "}
              Go To Dashboard{" "}
            </button>
          ) : (
            <Form {...form}>
              <form
                className="w-[90%] mx-auto text-start space-y-4"
                onSubmit={form.handleSubmit(tryLogin)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          className="dark:bg-white dark:focus:bg-neutral-200 dark:border-2 dark:border-neutral-500 transition-colors"
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
                    <FormItem className="relative w-full ">
                      <FormLabel>Password</FormLabel>
                      <div className="relative ">
                        <FormControl>
                          <Input
                            type={visibilityMode}
                            placeholder="Password"
                            className="dark:bg-white w-full dark:focus:bg-neutral-200 dark:border-2 dark:border-neutral-500 transition-colors"
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

                <button
                  className="w-full h-10 flex items-center justify-center bg-lightPink rounded-lg text-white"
                  disabled={form.formState.isSubmitting}
                >
                  Login
                </button>
              </form>
            </Form>
          )}
          <p
            onClick={() => {
              Navigate("/forgot-password");
            }}
            className="text-[0.75rem] text-darkBlue font-semibold mx-auto  cursor-pointer mt-2 text-sm"
          >
            Forgot password
          </p>
        </div>
      </div>
    </section>
  );
};
