import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
type state = {
  access: string;
  refresh: string;
  user: user;
  verified:boolean;
};
type user = {
  id: string;
  email: string;
  firstName: string;
  roles: string[];
  imageUrl:string,
  airline?:string | null
};
type tokenUpdatePayload = {
  access_token: string;
  refresh_token: string;
};
type generalUpdate ={
  access_token: string;
  refresh_token: string;
  user:user;
  verified:boolean
}
type actions = {
  updateTokens: (data: tokenUpdatePayload) => void;
  updateUser: (data:user)=>void;
  generalUpdate:(data:generalUpdate)=>void;
  updateVerified:(data:boolean)=>void;
  updateImage:(data:string)=>void
};
export const useAuthStore = create(persist<state & actions> (
  (set) => ({
    access: "access",
    refresh: "",
    user: {
      id: "",
      email: "",
      firstName: "",
      roles: [],
      imageUrl:"",
      airline:null
    },
    verified:false,
    updateTokens: (data) =>{
      console.log(data)
      set(()=>({
        access: data["access_token"],
        refresh: data["refresh_token"],
      }))},
    updateUser: (data) => set(() => ({ user: { ...data } })),
    generalUpdate:(data:generalUpdate)=>{set(()=>({access:data.access_token,refresh:data.refresh_token,user:data.user,verified:data.verified}))},
    updateVerified:(data)=>set(()=>({verified:data})),
    updateImage:(data)=>set((state)=>({user:{...state.user,imageUrl:data}})) ,
  }),{
name:"auth-store",
storage:createJSONStorage(()=>sessionStorage)
  }
));
