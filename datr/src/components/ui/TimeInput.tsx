import React, { useEffect, useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { MdClose } from "react-icons/md";

interface timeInputProps extends HTMLDivElement {
  onChange: (value: string) => void;
  inputClassname: string;
  value: string;
}
export const TimeInput = (props: timeInputProps) => {
  const { value, onChange, inputClassname } = props;
  const parseTime = (timeString: string) => {
    const parts = timeString ?timeString.split(":"):["0","0"];
    const clampedHour = Math.max(0, Math.min(Number(parts[0] || 0), 23)).toString();
    const clampedMinute = Math.max(0, Math.min(Number(parts[1] || 0), 59)).toString();
    return { hour: clampedHour.padStart(2, "0"), minute: clampedMinute.padStart(2, "0") };
  };


  const formatTime = (hour:string, minute:string) => {
    const formattedHour = hour.padStart(2, "0");
    const formattedMinute = minute.padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
  };
  const [time, setTime] = useState(parseTime(value));
  useEffect(() => {
    setTime(parseTime(value));
  }, [value]);
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = e.target.value;
    if (newHour === '' || (Number(newHour) >= 0 && Number(newHour) <= 23)) {
      setTime({ ...time, hour: newHour });
      onChange(formatTime(newHour, time.minute));
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = e.target.value;
    if (newMinute === '' || (Number(newMinute) >= 0 && Number(newMinute) <= 59)) {
      setTime({ ...time, minute: newMinute });
      onChange(formatTime(time.hour, newMinute));
    }
  };

  const handleBlur = () => {
    const formattedHour = time.hour.length === 1 ? '0' + time.hour : time.hour;
    const formattedMinute = time.minute.length === 1 ? '0' + time.minute : time.minute;
    const formattedTime = formatTime(formattedHour, formattedMinute);
    setTime({ hour: formattedHour, minute: formattedMinute });
    onChange(formattedTime);
  };
  return (
    <div className={cn(props.className, "flex items-center gap-x-2")}>
      <Input
        type="number"
        className={cn(inputClassname)}
        min={0}
        value={time.hour}
        max={23}
        onChange={handleHourChange}
        onBlur={handleBlur}
        placeholder="HH"
      />
      <Input
        type="number"
        className={cn(inputClassname)}
        min={0}
        max={60}
        value={time.minute}
        onChange={handleMinuteChange}
        onBlur={handleBlur}
        placeholder="MM"
      />
      <div role="button" onClick={() => {onChange("")}} className="ml-auto">
        <MdClose className="w-4 h-5 shrink ml-auto" />
      </div>
    </div>
  );
};
