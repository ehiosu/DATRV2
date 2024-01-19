import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check } from 'lucide-react'
import React from 'react'

export const TicketAlerts = () => {
  return (
    <div className='w-full'>
      <p className="text-[1rem] ml-2 font-semibold ">Request Type</p>
      <Select>
        <SelectTrigger className='w-[18rem] my-2 dark:ring-offset-transparent dark:focus:ring-transparent max-w-full dark:bg-white bg-white h-8 rounded-none border-2 dark:border-neutral-300  '>
          <SelectValue placeholder="Select Group"/>
        </SelectTrigger>
        <SelectContent className='p-2'>
          <Input placeholder='Search for a Group' className='text-[0.75rem] text-neutral dark:ring-offset-transparent dark:focus:ring-transparent'/>
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-2 ">
          <input type="checkbox" name="" id=""  className=''/>
          <p className='text-[0.8275rem] text-neutral-700'>Repeat Every One hour</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="" id=""  className=''/>
          <p className='text-[0.8275rem] text-neutral-700'>Disable Snooze</p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="" id=""  className=''/>
          <p className='text-[0.8275rem] text-neutral-700'>Escalate after two repetitions</p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="" id=""  className=''/>
          <p className='text-[0.8275rem] text-neutral-700'>Enable User Flagging</p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="" id=""  className=''/>
          <p className='text-[0.8275rem] text-neutral-700'>Automatically reassign tickets in critical cases</p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger className="mt-4 w-max px-6 text-[0.9rem] font-semibold bg-darkBlue cursor-pointer hover:bg-purple-500  text-white rounded-md py-2">
          Save Changes
        </DialogTrigger>
        <DialogContent className="flex flex-col ">
          <DialogClose></DialogClose>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-darkBlue text-[1.2rem] font-semibold">
              Changed Successfully
            </p>
            <span className="w-[20%] aspect-square rounded-full bg-blue-300 text-white grid place-items-center my-2">
              <Check className="w-full aspect-square" />
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
