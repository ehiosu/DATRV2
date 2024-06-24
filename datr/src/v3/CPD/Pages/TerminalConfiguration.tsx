import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useRef } from 'react'
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { GenericDataTable, TerminalDataTable, generalTerminalColumnDef } from '@/CPD/Components/DataTable'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'

export const TerminalConfiguration = () => {
  const dialogRef=useRef<HTMLButtonElement|null>(null)
    const {axios}=useAxiosClient()
    const getTerminalsQuery=useQuery({
        queryKey:["terminals","all"],
        queryFn:()=>axios('terminals/all',{
            method:"GET"
        }).then((resp:any)=>resp.data)
    })
  return (
    <section className='w-full space-y-3 pb-6'>
      <Dialog>
        <DialogTrigger ref={dialogRef} asChild>
        <button className='mt-2 w-max text-sm bg-ncBlue px-3 py-1.5 text-white rounded-lg'>
      Add Terminal  
    </button> 
        </DialogTrigger>
        <DialogContent>
        <NewTerminalForm closeDialog={()=>{
          dialogRef.current?.click()
          getTerminalsQuery.refetch()
          }}/>
        </DialogContent>
      </Dialog>
    <div className="mx-auto w-max">
        <p className='px-1 py-1.5 text-lg font-semibold text-ncBlue border-b-2 border-b-ncBlue'>Termianls</p>
    </div>
    {
        getTerminalsQuery.isSuccess&&<div className="max-h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full"> <GenericDataTable  filterHeader='Terminal Name' hasFilter filterColumn='name' columns={generalTerminalColumnDef} data={getTerminalsQuery.data}/></div>
    }
    </section>
  )
}
import * as z from "zod"
import { toast } from 'sonner'
import { MdError } from 'react-icons/md'
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
const NewTerminalForm = ({ closeDialog }:{closeDialog:()=>void}) => {
  const { axios } = useAxiosClient();
  const createTerminalMutation = useMutation({
    mutationKey: ["terminal", "new"],
    mutationFn: (value:{name:string,abbreviation:string}) =>
      new Promise((resolve, reject) =>
        axios("terminals/add", {
          method: "POST",
          data: value,
        })
          .then((resp:any) => resolve(resp))
          .catch((err:any) => reject(err))
      ),
  });
  const tryCreateNewTerminal = (values:z.infer<typeof newTerminalSchema>) => {
    toast.promise(
      new Promise((resolve, reject) =>
        createTerminalMutation.mutate(
          { abbreviation: values.name, ...values },
          {
            onSuccess: (data) => {
              resolve(data);
              closeDialog();
            },
            onError: (err) => reject(err),
          }
        )
      ),
      {
        loading: "Trying to create terminal...",
        success: "Terminal Created Successfully!",
        error: (error) => {
         
          return (
            <div className="text-black flex flex-col">
              <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                <MdError /> Error
              </p>
              <p>{error.response.data.message || error.response.data.detail}</p>
            </div>
          );
        },
      }
    );
  };

  const newTerminalSchema = z.object({
    name: z.string().min(1, {
      message: "Enter a valid name!",
    }),
  });
  const newTerminalForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(newTerminalSchema),
  });
  return (
    <Form {...newTerminalForm}>
      <form
        className="space-y-3"
        onSubmit={newTerminalForm.handleSubmit(tryCreateNewTerminal as any)}
      >
       
        <FormField
          name="name"
          control={newTerminalForm.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full h-8 p-2 rounded-lg border-[1px] dark:bg-white dark:border-neutral-400 border-neutral-400 transition-all focus:border-darkBlue text-[0.77rem]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The name of the termianl to be created.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <button
          disabled={Object.keys(newTerminalForm.formState.errors).length > 0}
          className="w-full h-8 flex flex-row items-center justify-center my-3 bg-neutral-100 hover:bg-lightPink transition-all duration-300 rounded-lg hover:text-white group disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:text-black"
        >
          Submit
          <Send className="ml-2 w-4 h-4 shrink flex flex-row items-center justify-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:duration-700 group-hover:disabled:opacity-0" />
        </button>
      </form>
    </Form>
  );
};
