import { createContext } from "react";

type SelectedItemsContextType = {
    selectedSlas: string[],
    setSelectedSlas: React.Dispatch<React.SetStateAction<string[]>>,
  };
  
  const initialSelectedSlas: string[] = [];
  
  export const SelectionContext = createContext<SelectedItemsContextType>({
    selectedSlas: initialSelectedSlas,
    setSelectedSlas: () => {},
  });
  export default SelectionContext