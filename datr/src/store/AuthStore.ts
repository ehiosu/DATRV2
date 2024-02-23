import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
type state = {
  access: string;
  refresh: string;
  user: user;
};
type user = {
  id: string;
  email: string;
  firstName: string;
  roles: string[];
};
type tokenUpdatePayload = {
  access_token: string;
  refresh_token: string;
};
type generalUpdate ={
  access_token: string;
  refresh_token: string;
  user:user
}
type actions = {
  updateTokens: (data: tokenUpdatePayload) => void;
  updateUser: (data:user)=>void;
  generalUpdate:(data:generalUpdate)=>void;
};
export const useAuthStore = create(persist<state & actions> (
  (set) => ({
    access: "",
    refresh: "",
    user: {
      id: "",
      email: "",
      firstName: "",
      roles: [],
    },
    updateTokens: (data) =>{
      // await new Promise((resolve) => setTimeout(resolve, 100));
      set(()=>({
        access: data["access_token"],
        refresh: data["refresh_token"],
      }))},
    updateUser: (data) => set(() => ({ user: { ...data } })),
    generalUpdate:(data:generalUpdate)=>{set(()=>({access:data.access_token,refresh:data.refresh_token,user:data.user}))}
  }),{
name:"auth-store",
storage:createJSONStorage(()=>sessionStorage)
  }
));
