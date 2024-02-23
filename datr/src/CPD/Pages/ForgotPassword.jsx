import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router";
import { useAxiosClient } from "../../api/useAxiosClient.jsx";
import { useState } from "react";
import { toast } from "../../components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
const ForgotPassword = () => {
  const nav = useNavigate();
  const { axios } = useAxiosClient();
  const [formState, setFormState] = useState({
    email: "",
    canResetPassword: false,
  });
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formState.email);
  };
  const tryResetPassword = async () => {
    if (!(formState.email.length > 0) || !validateEmail()) {
      toast({
        title: "Error",
        description: "Enter a valid Email",
        variant: "destructive",
      });
    }
    await axios("/password/forgot-password-attempt", {
      method: "POST",
      data: { email: formState.email },
    })
      .then((resp) => {
        console.log(resp.data);
        toast({
          title: "Success!",
          description: resp.data.message,
        });
        setFormState((state) => ({ ...state, canResetPassword: true }));
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error!",
          description:
            err.message === "Request failed with status code 400"
              ? "Email doesn't exist on the system"
              : err.message,
          variant: "destructive",
        });
      });
  };
  return (
    <main className="w-full h-screen grid place-items-center relative overflow-hidden">
      <div className="lg:w-[35%] xl:w-[30%] md:w-[45%] w-[80%]  rounded-lg border-2 border-darkBlue shadow-md relative flex flex-col justify-center text-center p-2 pb-12 bg-white">
        <img
          src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1706868253/private/NCAA-removebg-preview_onmbl2.png"
          className="w-[70%]  bg-white absolute -top-16  left-1/2 -translate-x-1/2  object-contain  "
          alt=""
        />
        <div className="flex flex-col justify-center text-center w-[80%] mx-auto mt-20 gap-2">
          {formState.canResetPassword ? (
            <CompleteResetComponent email={formState.email} />
          ) : (
            <RequestResetComp
              setFormState={setFormState}
              nav={nav}
              sumbitForm={tryResetPassword}
            />
          )}
        </div>
      </div>
      <img
        src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1706869558/private/NCAALogo_l7hkhg.png"
        className="absolute bottom-0 w-[420px] aspect-square translate-y-1/2 right-0 translate-x-1/3 z-[-1]"
        alt=""
      />
      <img
        src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1706869558/private/NCAALogo_l7hkhg.png"
        className="absolute top-0 w-[420px] aspect-square -translate-y-1/2 left-0 -translate-x-1/3 z-[-1]"
        alt=""
      />
    </main>
  );
};

// type requestResetCompProps={
//   setFormState:React.Dispatch<React.SetStateAction<{
//     email: string;
//     canResetPassword: boolean;
// }>>,
// nav:NavigateFunction,
// sumbitForm:()=>void
// }
const RequestResetComp = ({ setFormState, nav, sumbitForm }) => {
  return (
    <>
      <p className="text-[1.5rem]  font-semibold text-neutral-500 ">
        Forgot Password
      </p>
      <p className="text-[0.77rem] w-[80%] mx-auto">
        A link to reset your password will be sent to this email address. If you
        do not receive an email from us, please contact info@ncaa.ng for further
        assistance.
      </p>
      <div className="flex gap-1 flex-col justify-start text-start my-4">
        <p className="text-darkBlue text-[0.8rem]">Enter Email Address</p>
        <input
          type="text"
          name="email"
          onChange={(e) => {
            setFormState((state) => ({ ...state, email: e.target.value }));
          }}
          placeholder="abc@ncaa.gov.ng"
          className="w-full h-8 p-2 rounded-lg border-[1px]  border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
          id=""
        />
      </div>
      <Button
        onClick={() => {
          sumbitForm();
        }}
        className=" w-full mt-auto dark:bg-darkBlue bg-darkBlue dark:text-white text-white dark:hover:bg-darkBlue hover:bg-darkBlue rounded-lg h-12"
      >
        Reset Password
      </Button>
      <Button
        onClick={() => {
          nav("/");
        }}
        className=" w-full mt-auto dark:bg-lightPink bg-lightPink dark:text-white text-white dark:hover:bg-lightPink hover:bg-lightPink rounded-lg h-12"
      >
        Cancel
      </Button>
    </>
  );
};

const CompleteResetComponent = ({ email }) => {
  const nav = useNavigate();
  const containsSpecialCharacter = (input) => {
    return /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(input);
  };
  const { axios } = useAxiosClient();
  const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(6, {
          message: "Password must contain at least 6 characters!",
        })
        .refine((data) => containsSpecialCharacter(data), {
          message: "Password must contain a special character!",
        }),
      rePassword: z
        .string()
        .min(6, {
          message: "Password must contain at least 6 characters!",
        })
        .refine((data) => containsSpecialCharacter(data), {
          message: "Password must contain a special character!",
        }),
      otp: z.string().length(6, {
        message: "OTP must be 6 characters long!",
      }),
    })
    .refine((data) => data.password === data.rePassword, {
      path: ["rePassword"],
      message: "Password don't match",
    });
  const form = useForm({
    defaultValues: {
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const tryResetPassword = async (values) => {
    await axios("/password/effect-forgot-password", {
      method: "PUT",
      data: {
        email,
        otp: values.otp,
        newPassword: values.password,
        confirmPassword: values.rePassword,
      },
    })
      .then((resp) => {
        toast({
          title: "Success!",
          description: resp.data.message,
          variant: "default",
        });
        setTimeout(() => {
          nav("/Home");
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error!",
          description:
            err.message === "Request failed with status code 400"
              ? "Invalid OTP!"
              : err.message,
          variant: "destructive",
        });
      });
  };
  return (
    <>
      <p className="text-[1.5rem]  font-semibold text-neutral-500 ">
        Forgot Password
      </p>
      <p className="text-[0.77rem] w-[80%] mx-auto">
        Password must contain a special character Though minimum 6 characters
        length is OK, we consider the password better if it contains more than 8
        characters.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(tryResetPassword)}>
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel className="text-start text-[0.8275rem] text-darkBlue font-semibold">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="password"
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white bg-white  border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            name="rePassword"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start gap-1 my-3">
                  <FormLabel className="text-start text-[0.8275rem] text-darkBlue font-semibold">
                    Re-enter New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="password"
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white bg-white  border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="otp"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start gap-1 my-3">
                  <FormLabel className="text-start text-[0.8275rem] text-darkBlue font-semibold">
                    OTP
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456"
                      className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white bg-white  border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            type="submit"
            className=" w-full mt-auto dark:bg-darkBlue bg-darkBlue dark:text-white text-white dark:hover:bg-darkBlue hover:bg-darkBlue rounded-lg h-12"
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </>
  );
};
export default ForgotPassword;
