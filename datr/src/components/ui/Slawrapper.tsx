import { slaEntry } from "@/CPD/data/data";
import { FaArrowRight } from "react-icons/fa";
import { Input } from "./input";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

export const SingleSlaWrapper = ({
    first = true,
    onChange,
    data,
    name,
    subtext,
    active=""
  }: {
    first: boolean;
    onChange?: (...event: any[]) => void;
    data: slaEntry[];
    name: string;
    subtext: string;
    active?:string
  }) => {
 
    return (
      <div className="flex items-start gap-2 md:mx-0 mx-auto">
        {!first && <FaArrowRight className="grid place-items-center mt-4 " />}
  
        <div className="flex flex-col">
          <p className="text-[0.9275rem] font-semibold">{name}</p>
          <p className="text-[0.7275rem] text-neutral-500 my-1">{subtext}</p>
          <div className="w-60  max-h-80 bg-white rounded-md border-2 border-neutral-200 my-2 p-2">
            <Input
              placeholder="Search"
              className="dark:bg-white rounded-md border-neutral-200 dark:border-neutral-200 "
            />
            <RadioGroup className="flex flex-col" defaultValue="active"  onValueChange={onChange}>
              {data.map((entry) => {
                return (
                  <div className="flex items-center space-x-2 my-2">
                    <RadioGroupItem
                      
                      checked={active===entry.value && active!==""}
                      className="dark:border-neutral-500 border-neutral-500 dark:text-blue-300 text-blue-300"
                      value={entry.value}
                      id={entry.title}
                    />
                    <Label className="font-[400]" htmlFor={entry.title}>
                      {entry.title}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  };