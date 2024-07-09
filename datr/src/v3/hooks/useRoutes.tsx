import { useQuery } from '@tanstack/react-query'
import React from 'react'
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { AxiosError, AxiosResponse } from 'axios'
export const useRoutes = () => {
    const {axios}=useAxiosClient()
const query = useQuery({
    queryKey:["routes","all"],
    queryFn:()=>axios('routes/active',{
        method:"GET"
    }).then((resp:AxiosResponse)=>resp.data).catch((err:AxiosError)=>{
        throw err
    })
})
return query
}
