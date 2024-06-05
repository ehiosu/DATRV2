import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { CiBookmarkCheck } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { useAuth } from "../api/useAuth";
import { User } from "lucide-react";
export const SearchPage = ({
  children,
  heading,
  isRedirect = false,
  SearchElement,
}) => {
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();
  const isAirline = user.roles.includes("AIRLINE");
  const nav = useNavigate();

  return (
    <div className="w-full   flex    flex-col   gap-2  p-2">
      <div className="flex flex-wrap  justify-between items-center w-full md:space-x-2">
        {!isAirline ? (
          <p
            className={`text-[1.2rem] ${
              isRedirect && "hover:cursor-pointer"
            }  font-semibold`}
            onClick={() => {
              if (isRedirect) {
                nav(-1);
              }
            }}
          >
            {heading}
          </p>
        ) : (
          <div className="flex flex-col space-y-1 ">
            <p className="font-semibold text-lg">
              Welcome, {user.airline.replace("_", " ")}{" "}
            </p>
            <p
              className={`text-[1.2rem] ${
                isRedirect && "hover:cursor-pointer"
              }  font-semibold`}
              onClick={() => {
                if (isRedirect) {
                  nav(-1);
                }
              }}
            >
              {heading}
            </p>
          </div>
        )}

        <div className={`   h-16  flex  items-start  justify-end space-x-2 `}>
          {SearchElement ? (
            <SearchElement />
          ) : (
            <div
              className={`${
                searching ? "lg:w-[35rem]  w-[22rem]" : "w-60"
              } transition-all   h-12   relative grid place-items-center`}
            >
              <input
                type="text"
                name=""
                className="w-full   h-8    border-2 border-gray-400   rounded-xl  px-2  py-2  text-[0.8275rem] text-neutral-600   outline-none   "
                id=""
                placeholder="Search"
                onFocus={() => {
                  setSearching(() => true);
                }}
                onBlur={() => {
                  setSearching(() => false);
                }}
              />
              <div
                className={`absolute  top-12 right-0  ${
                  searching ? "block" : "hidden"
                } h-40 w-full  shadow-md  z-[10] absolute bg-white`}
              ></div>
            </div>
          )}
          <UserHeader searching={searching} />
        </div>
      </div>
      {children}
    </div>
  );
};

const UserHeader = ({ searching }) => {
  const { user, generalUpdate } = useAuth();
  const nav = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`outline-none ${
          searching ? "hidden" : "block"
        } ml-auto mt-1.5`}
      >
        <Avatar className="w-8  aspect-square rounded-full  border-2  border-gray-400/40  grid  place-items-center overflow-hidden">
          <AvatarImage
            className="w-full aspect-square object-cover"
            src={user.imageUrl}
          />
          <AvatarFallback>{user.firstName[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 outline-none bg-white p-2 rounded-md shadow-md  z-[10]  text-[0.8275rem] text-center   ">
        <DropdownMenuItem
          onClick={() => {
            nav("/Account-Settings");
          }}
          className="outline-none h-8 grid  place-items-center cursor-pointer hover:border-b-2 hover:bg-blue-300 hover:font-semibold hover:text-white hover:border-b-purple-300 rounded-md"
        >
          <p>Account Settings</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="outline-none h-8 grid  place-items-center cursor-pointer hover:border-b-2 hover:bg-blue-300 hover:font-semibold hover:text-white hover:border-b-purple-300 rounded-md"
          onClick={() => {
            generalUpdate({
              access_token: "",
              refresh_token: "",
              user: { id: "", email: "", firstName: "", roles: [] },
            });
            nav("/");
          }}
        >
          <p>Sign Out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
