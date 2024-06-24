import React from 'react'
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { useQuery } from '@tanstack/react-query'
export const useTerminal = () => {
    const {axios}=useAxiosClient()
    const terminalQuery=useQuery({
        queryKey:["terminals","all"],
        queryFn:()=>axios('terminals/active',{
            method:"GET"
        }).then((resp:any)=>resp.data)
    })
 return terminalQuery
}
