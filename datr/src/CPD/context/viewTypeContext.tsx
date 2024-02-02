import { createContext, useState } from "react";

type viewType="list" |"grid"
const ViewTypeContext = createContext<{
    currentView:viewType,
    setCurrentView:React.Dispatch<React.SetStateAction<viewType>>
}>({
    currentView:"list",
    setCurrentView:()=>{}
})

export default ViewTypeContext