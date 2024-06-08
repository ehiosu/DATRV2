import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
type state={
    terminal:string,
    date:DateRange
}
type dateRange={from:Date|null,to:Date|null}
type actions={
    setTerminal:(Terminal:string)=>void,
    setDate:(value:DateRange|undefined)=>void
}
const terminalStore = create(persist<state&actions>(
    (set)=>({
        terminal:"All",
        setTerminal:(terminal:string)=>set((state)=>({terminal:terminal})),
        date:{
            from:new Date(),
            to:undefined
        },
        setDate:(value:DateRange|undefined)=>set((state)=>({date:value}))
    }),
    {
        name:"terminal-store",
        storage:createJSONStorage(()=>sessionStorage)
          }
))

export const useTerminalStore=()=>terminalStore((state)=>state)