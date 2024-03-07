import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/api/useAuth";
// import { useAxiosClient } from "@/api/useAxiosClient";
import axios from "axios"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GoPencil } from "react-icons/go";
import { MdClose } from "react-icons/md";
import {  useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
export const AccountSettings = () => {
  return (
    <section className="flex flex-row space-x-3  bg-[#FAFAFA]">
      <Sidebar />
      <div className="flex flex-col p-4 flex-1 w-full h-full  my-4">
        <p className="text-[1.2rem] font-semibold text-neutral-600">
          Account settings
        </p>
        <section className="flex-1 bg-white w-full h-full  rounded-tl-xl shadow-sm p-4 my-2">
          <Tabs
            className="w-full flex flex-col md:flex-row"
            defaultValue="myProfile"
          >
            <TabsList className="flex flex-row md:flex-col items-center justify-between gap-4 py-2 h-24 w-48 dark:bg-transparent bg-transparent border-b-2 border-b-neutral-100 md:border-b-0 md:border-r-2 md:border-r-neutral-200 rounded-none">
              <TabsTrigger
                className="w-32 dark:bg-white bg-white dark:data-[state=active]:bg-blue-400/40 data-[state=active]:bg-blue-400/40 rounded-xl dark:data-[state=active]:shadow-none data-[state=active]:shadow-none  dark:data-[state=active]:text-blue-600 dark:data-[state=active]:font-semibold data-[state=active]:font-semibold data-[state=active]:text-blue-600"
                value="myProfile"
              >
                My Profile
              </TabsTrigger>
              {/* <TabsTrigger
                className="w-32 dark:bg-white bg-white dark:data-[state=active]:bg-blue-400/40 data-[state=active]:bg-blue-400/40 rounded-xl dark:data-[state=active]:shadow-none data-[state=active]:shadow-none dark:data-[state=active]:text-blue-600 dark:data-[state=active]:font-semibold data-[state=active]:font-semibold data-[state=active]:text-blue-600"
                value="security"
              >
                Security
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="myProfile" className="px-6 w-full">
              <MyProfile />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </section>
  );
};

const MyProfile = () => {
  const { user,access } = useAuth();
  // const {axios}=useAxiosClient()
  const containsSpecialCharacter = (input: string) => {
    return /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(input);
  };
  const resetPasswordSchema = z
    .object({
      initialPassword: z.string().min(1, {
        message: "Enter a valid password!",
      }),
      newPassword: z
        .string()
        .min(6, {
          message: "Enter a valid password!",
        })
        .max(12, {
          message: "Password can't be more than 12 characters long!",
        })
        .refine((data) => containsSpecialCharacter(data), {
          message: "Password must contain a special character!",
        }),
      confirmPassword: z
        .string()
        .min(6, {
          message: "Enter a valid password!",
        })
        .max(12, {
          message: "Password can't be more than 12 characters long!",
        })
        .refine((data) => containsSpecialCharacter(data), {
          message: "Password must contain a special character!",
        }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords don't match",
    });
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    mode:"onChange",
    resolver: zodResolver(resetPasswordSchema),
  });

  const tryChangePassword=async(values:z.infer<typeof resetPasswordSchema>) =>{
    await axios('http://localhost:8080/passwords/change',{
      headers:{
        Authorization:`Bearer ${access}`
      },
      method:"PUT",
      data:{
        email:user.email,
        ...values
      }
    }).then((resp:any)=>{
      toast({
        title:"Success!",
        description:resp.data.message,
        variant:"default"
      })
    return true
    }).catch((err:Error)=>{
      toast({
        title:"Error!",
        description:err.message,
        variant:"destructive"
      })
      return false
    })

  }
  return (
    <section className="flex flex-col gap3 w-full md:w-[80%] mx-auto">
      <p className="font-semibold text-[1.3rem]">My Profile</p>
      <div className="flex flex-row p-3 my-4 border-2 border-neutral-100 rounded-xl flex-1">
        <img
          className="h-24 aspect-square rounded-full object-cover "
          src={
            "https://cdn.leonardo.ai/users/2873f752-1089-4391-999f-1f947e3baa50/generations/01e3023e-5b9f-4164-9149-8b97452f5fa2/variations/Default_Create_an_image_of_the_Viking_Ragnar_Lothbrok_looks_an_0_01e3023e-5b9f-4164-9149-8b97452f5fa2_0.jpg?w=512"
          }
          alt="User logo"
        />
        <div className="flex flex-col ml-6 justify-center whitespace-nowrap">
          <p className="font-semibold tracking-widest text-[1.1rem]">
            {user.firstName}
          </p>
          <p className="text-[0.75rem] text-neutral-300 tracking-wider">
            {user.roles[0]}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger className="ml-auto w-max px-4 py-[0.3rem] h-max my-auto flex items-center justify-center border-2 border-neutral-100 rounded-full space-x-2">
            <p>Edit</p>
            <GoPencil />
          </AlertDialogTrigger>
          <AlertDialogContent></AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="border-2 rounded-xl border-neutral-100 p-4 whitespace-nowrap">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[1.1rem]">Personal Information</p>
          <AlertDialog>
            <AlertDialogTrigger className="ml-auto w-max px-4 py-[0.3rem] h-max my-auto flex items-center justify-center border-2 border-neutral-100 rounded-full space-x-2">
              <p>Edit</p>
              <GoPencil />
            </AlertDialogTrigger>
            <AlertDialogContent></AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-row items-center flex-wrap w-1/2 my-3 space-y-3 gap-4 ">
          <div className="w-[45%] flex flex-col space-y-3 text-start">
            <p className="font-semibold text-[0.8275rem] text-neutral-800">
              First Name
            </p>
            <p className="text-[0.8rem] font-semibold text-neutral-500">
              {user.firstName}
            </p>
          </div>
          <div className="w-[45%] flex flex-col space-y-3 text-start">
            <p className="font-semibold text-[0.8275rem] text-neutral-800">
              Last Name
            </p>
            <p className="text-[0.8rem] font-semibold text-neutral-500">
              {user.firstName}
            </p>
          </div>
          <div className="w-[45%] flex flex-col space-y-3 text-start">
            <p className="font-semibold text-[0.8275rem] text-neutral-800">
              Email
            </p>
            <p className="text-[0.8rem] font-semibold text-neutral-500">
              {user.email}
            </p>
          </div>
          <div className="w-[45%]  flex flex-col space-y-3 text-start">
            <p className="font-semibold text-[0.8275rem] text-neutral-800">
              Phone
            </p>
            <p className="text-[0.8rem] font-semibold text-neutral-500">
              {" -"}
            </p>
          </div>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger className="w-max px-3 text-[0.8275rem] py-2 bg-blue-400 rounded-full my-3 text-white font-semibold">
          Change Password
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="flex items-center justify-end">
            <AlertDialogCancel>
              <MdClose />
            </AlertDialogCancel>
          </div>
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(tryChangePassword)}>
              <FormField
                name="initialPassword"
                control={resetPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel>Initial Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" type="password" />
                    </FormControl>
                    <FormDescription>Your current password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="newPassword"
                control={resetPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" type="password" />
                    </FormControl>
                    <FormDescription>
                      New Password must contain a special character and must be
                      between 6 and 12 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={resetPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="my-3">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="submit" disabled={resetPasswordForm.formState.isSubmitting} className="disabled:bg-neutral-500 disabled:hover:bg-neutral-700 bg-lightPink text-white grid place-items-center py-2 w-full h-12 rounded-xl my-4 hover:bg-darkBlue transition-colors">Change Password</button>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};