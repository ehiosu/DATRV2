import React from 'react'
import {useAxiosClient} from "@/api/useAxiosClient.jsx"
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/api/useAuth'
import axios from 'axios'
export const useTerminal = () => {
    const {axios:axiosClient}=useAxiosClient()
    const {access}=useAuth()
    const isExternal = access === "access" || !access
    console.log(isExternal)
    const terminalQuery=useQuery({
        queryKey:["terminals","all"],
        queryFn:()=>isExternal?
        axios("http://176.58.117.18:8080/api/terminals/active",{
            method:"GET"
        }).then((resp:any)=>resp.data)
        :axiosClient('terminals/active',{
            method:"GET"
        }).then((resp:any)=>resp.data)
    })
 return terminalQuery
}
