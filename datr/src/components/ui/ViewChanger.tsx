import { BarChart, LucideIcon, PieChart, Table } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export type view = "Table"|"Bar"|"Pie"
type ViewChangerProps={
view:view,
currentView:view
setView:React.Dispatch<React.SetStateAction<view>>,
className?:string
}
type viewIconEntry=Record<view,LucideIcon>
const viewIconMap:viewIconEntry={
    "Table":Table,
    "Bar":BarChart,
    "Pie":PieChart
}
export const ViewChanger=({view,setView,className,currentView}:ViewChangerProps)=>{
    const Icon = viewIconMap[view]
    return(
<button onClick={()=>{setView(view)}} className={cn("w-6 h-6 aspect-square  flex items-center justify-center bg-neutral-200 dark:bg-neutral-200 rounded-md hover:bg-neutral-200/60 transition-all duration-300",currentView===view && "bg-slate-300 dark:bg-slate-300",className)}>
<Icon className="w-4 h-4 shrink text-black"/>
</button>
    )
}