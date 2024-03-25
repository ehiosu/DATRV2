import React, { useEffect, useRef, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router'
import { useAuth } from '@/api/useAuth.js'
import axios from 'axios'
export const Verify = () => {
    const [otp,setOtp]=useState<string[]>(Array(6).fill(""))
    const [canResendOtp,setCanResendOtp]=useState<boolean>(true)
    const {updateVerified,user:{email}}=useAuth()
    const [activeInput,setActiveInput]=useState(0)
    const inputRefs=useRef<HTMLInputElement|null>(null)
    const nav=useNavigate()


    const handleChange=(e:React.ChangeEvent<HTMLInputElement>,index:number):void=>{
        const value=e.target.value.substring(e.target.value.length-1)
        let temp = [...otp]
        temp[index]=value
       setOtp(temp)
       if(!value){
        setActiveInput(index-1)
        return
       }
      else{
        setActiveInput(index+1)
      }
    }
    const handlePaste=(e:React.ClipboardEvent<HTMLInputElement>,index:number)=>{
        return
    }

    const tryVerifyCode=async()=>{
        const code = otp.join("")
        if(code.length!==6){
            toast({
                title:"Error!",
                description:"OTP code must contain 6 characters only",
                variant:"destructive"
            })
        }
        await axios(`http://176.58.117.18:8080/api/users/verify?otp=${code}`,{
            method:"GET"
        }).then((resp:any)=>{
            toast({
                title:"Verified!",
                description:resp.data.message,
                variant:"default"
            })
            updateVerified(true)
            setTimeout(()=>{nav('/Home')},1000)
        }).catch((err:Error)=>{
            console.log(err.message)
            setCanResendOtp(true)
            toast({
                title:"Error!",
                description:err.message,
                variant:"destructive"
            })
        })
    }

    const resendOtp=async()=>{
      setCanResendOtp(false)
     try{
      const resp = await axios(`http://176.58.117.18:8080/api/users/verification/resend?email=${email}`)
      if(resp.data){
       
        toast({
          title:"Success!",
          description:"OTP successfully resent."
        })
      }
     } catch(err){
      setCanResendOtp(true)
        toast({
          title:"Error",
          description:"Error resending otp,try again in a few minutes.",
          variant:"destructive"
        })
     }
     
    }
    useEffect(()=>{
        inputRefs.current?.focus()
    },[activeInput])
  return (
    <main className="w-full h-screen grid place-items-center relative overflow-hidden">
      <div className="lg:w-[35%] xl:w-[30%] md:w-[45%] w-[80%]  rounded-lg border-2 border-darkBlue shadow-md relative flex flex-col justify-center text-center p-2 pb-12 bg-white">
        <img
          src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1706868253/private/NCAA-removebg-preview_onmbl2.png"
          className="w-[70%]  bg-white absolute -top-16  left-1/2 -translate-x-1/2  object-contain  "
          alt=""
        />
        <div className="flex flex-col justify-center text-center w-[80%] mx-auto mt-20 gap-2">
        <p className="text-[1.4rem] font-semibold text-neutral-700">
            OTP Required
          </p>
          <p className="my-2 text-[0.77rem] text-neutral-400">
            In order to protect your account and the CPD system, you are
            required to verify it by inputting the OTP sent to your mail here.
          </p>
         <div className="flex flex-row gap-2 items-center justify-center">
         {
                otp.map((singleOtp,index)=>(
                    <input onPaste={(e)=>{handlePaste(e,index)}} ref={activeInput===index ? inputRefs :null} value={otp[index]} onChange={(e)=>{handleChange(e,index)}} type='number' className='w-10 spin-button-none aspect-square grid text-center p-0  text-[0.7rem] text-neutral-400 font-semibold  rounded-md border-2 border-blue-400' key={index}/>
                ))
            }
         </div>
         <button  onClick={()=>{resendOtp()}} className='text-[0.75rem] text-blue-300 my-2 cursor-pointer font-semibold hover:underline-offset-2 hover:udnerline-2  transition-all hover:underline-offset-blue-300' disabled={!canResendOtp}>Resend OTP</button>
         <button className='w-full bg-lightPink text-white text-center py-2 rounded-2xl hover:ring-offset-4 transition-all hover:ring-2 hover:ring-lightPink my-4' onClick={()=>{tryVerifyCode()}}>Verify</button>
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
  )
}
