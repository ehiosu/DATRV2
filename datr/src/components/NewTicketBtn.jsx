import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../api/useAuth";

export const NewTicketBtn = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  if (user.roles.includes("AIRLINE")) return <></>;
  return (
    <button
      className="w-44 bg-white transition   hover:bg-darkBlue rounded-lg  text-black ring-2 ring-neutral-400 duration-300  hover:ring-transparent hover:text-white  h-10"
      onClick={() => {
        nav("/CPD/New-Ticket");
      }}
    >
      New Ticket
    </button>
  );
};
