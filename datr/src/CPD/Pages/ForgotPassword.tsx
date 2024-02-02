
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

const ForgotPassword = () => {
    const nav =useNavigate()
  return (
    <main className='w-full h-screen grid place-items-center relative overflow-hidden'>
        <div className='lg:w-[35%] xl:w-[30%] md:w-[45%] w-[80%]  rounded-lg border-2 border-darkBlue shadow-md relative flex flex-col justify-center text-center p-2 pb-12 bg-white'>
        <img
          src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1706868253/private/NCAA-removebg-preview_onmbl2.png"
          className="w-[70%]  bg-white absolute -top-16  left-1/2 -translate-x-1/2  object-contain  "
          alt=""
        />
       <div className="flex flex-col justify-center text-center w-[80%] mx-auto mt-20 gap-2">
       <p className="text-[1.5rem]  font-semibold text-neutral-500 ">Forgot Password</p>
        <p className="text-[0.77rem] w-[80%] mx-auto">A link to reset your password will be sent to this email address. If you do not receive an email from us, please contact info@ncaa.ng for further assistance.</p>
        <div className="flex gap-1 flex-col justify-start text-start my-4">
            <p className="text-darkBlue text-[0.8rem]">Enter Email Address</p>
            <input
              type="text"
              name=""
              placeholder="abc@ncaa.gov.ng"
              className="w-full h-8 p-2 rounded-lg border-[1px]  border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
              id=""
            />
          </div>
          <Button onClick={()=>{nav('/CPD/Dashboard')}} className=" w-full mt-auto dark:bg-darkBlue bg-darkBlue dark:text-white text-white dark:hover:bg-darkBlue hover:bg-darkBlue rounded-lg h-12">Reset Password</Button>
          <Button onClick={()=>{nav('/')}} className=" w-full mt-auto dark:bg-lightPink bg-lightPink dark:text-white text-white dark:hover:bg-lightPink hover:bg-lightPink rounded-lg h-12">Cancel</Button>

       </div>
        </div>
        <img src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1706869558/private/NCAALogo_l7hkhg.png" className="absolute bottom-0 w-[420px] aspect-square translate-y-1/2 right-0 translate-x-1/3 z-[-1]" alt="" />

    </main>
  )
}

export default ForgotPassword