import { useAuth } from '@/api/useAuth'
import React from 'react'
type authorizedComponentProps={
    roles:string[],
    children:React.ReactElement
}
export const AuthorizedComponent:React.FC<authorizedComponentProps> = ({roles,children}) => {
    const {user}=useAuth()
    if(!roles.includes(user.roles[user.roles.length-1]))return <></>
  return (
    <>
    {children}
    </>
  )
}
