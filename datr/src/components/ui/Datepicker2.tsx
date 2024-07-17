import { useEffect, useState,useCallback } from 'react';
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface ComponentProps {
  value: Date;
  onFieldChange: (date: Date) => void;
  maxDate:Date
}

export default function Component({ value, onFieldChange,maxDate }: ComponentProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [hasMounted,setHasMounted]=useState(false)
    const [hour, setHour] = useState<string>('');
    const [minute, setMinute] = useState<string>('');
  
    useEffect(() => {
      if (value) {
        const date = new Date(value);
        setSelectedDate(date);
        setHour(date.getHours().toString().padStart(2, '0'));
        setMinute(date.getMinutes().toString().padStart(2, '0'));
      }
    }, [value]);
  
    const handleDateChange = useCallback((date: Date) => {
      date.setHours(parseInt(hour || '0'));
      date.setMinutes(parseInt(minute || '0'));
      setSelectedDate(new Date(date));
      onFieldChange(new Date(date));
    }, [hour, minute, onFieldChange]);
  
    const handleHourChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 23) {
        setHour(newValue.toString().padStart(2, '0'));
        if (selectedDate) {
          const newDate = new Date(selectedDate);
          newDate.setHours(newValue);
          onFieldChange(newDate);
        }
      }
    }, [selectedDate, onFieldChange]);
  
    const handleMinuteChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 59) {
        setMinute(newValue.toString().padStart(2, '0'));
        if (selectedDate) {
          const newDate = new Date(selectedDate);
          newDate.setMinutes(newValue);
          onFieldChange(newDate);
        }
      }
    }, [selectedDate, onFieldChange]);

  

  return (
    <div className="grid w-full max-w-sm ">
      <div className="">
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start font-normal bg-transparent dark:bg-transparent hover:bg-slate-100 hover:text-black dark:hover:text-black dark:hover:bg-slate-100 border-none outline-none h-5">
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span>{selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate as Date} toDate={maxDate} onSelect={handleDateChange as any} />
              </PopoverContent>
            </Popover>
            <Input type="number"  min="0" max="23" placeholder="Hour" value={hour}   onChange={handleHourChange} className="w-20 bg-transparent dark:bg-transparent outline-none border-0 h-5" />
            <Input type="number" min="0" max="59" placeholder="Minute" value={minute} onChange={handleMinuteChange} className="w-20 bg-transparent dark:bg-transparent outline-none border-0 h-5" />
          </div>
        </div>
      </div>
      
    </div>
  );
}

function CalendarDaysIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}