import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { GoReply } from "react-icons/go";
import { TbArrowForward } from "react-icons/tb";
import { CiStickyNote } from "react-icons/ci";
import { FiPrinter } from "react-icons/fi";
import { AlertDialog } from "../../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../components/ui/dialog.tsx";
import { cn } from "../../lib/utils.ts";
import sanitizeHtml from "sanitize-html";
export const SignleMessage = ({
  name,
  username,
  date,
  message,
  priority,
  complaintDetails = {},
}) => {
  return (
    <div className="w-full flex flex-col ">
      <div className="flex justify-between items-center ">
        <div className="flex gap-2 ">
          <span className=" w-10 rounded-full text-white aspect-square bg-darkBlue grid place-items-center">
            {name}
          </span>
          <div className="flex flex-col justify-between ">
            <p className="text-[0.8275rem] font-semibold">{username}</p>
            <p className="text-[0.6275rem] font-semibold text-orange-400 mt-auto">
              {priority}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Actions>
            <SingleAction name={"Reply"} Icon={GoReply} />
            <SingleAction name={"Forward"} Icon={TbArrowForward} />
            <SingleAction name={"Add Note"} Icon={CiStickyNote} />
          </Actions>
          <p className="text-[0.725rem] font-semibold text-darkBlue">{date}</p>
        </div>
      </div>
      <div className="px-6 mx-auto text-[0.7275rem] py-2 bg-neutral-200 rounded-md leading-4 mt-4">
        {message}
      </div>
    </div>
  );
};

const Actions = ({ children }) => {
  return (
    <div className="">
      <div className="md:flex items-center gap-4 hidden">{children}</div>
      <ActionsDropdown />
    </div>
  );
};

const ActionsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="md:hidden block w-28  ">
        <Button
          variant={"outline"}
          className="w-full text-[0.8275rem] dark:bg-background dark:hover:bg-neutral-200 dark:hover:text-black h-8"
        >
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent></DropdownMenuContent>
    </DropdownMenu>
  );
};

const SingleAction = ({ onClick, name, Icon }) => {
  return (
    <div
      className="flex gap-1 items-center text-neutral-400 hover:text-blue-500/60 text-[1.2rem] font-bold hover:cursor-pointer"
      onClick={onClick}
    >
      <Icon />
      <p className="text-[0.6275rem]">{name}</p>
    </div>
  );
};

export const SignleTicketMessage = ({
  name,
  username,
  date,
  message,
  priority,
  complaintDetails = [],
  isMessage = false,
  setReplyingTo,
}) => {
  const cleanHtml = (message) => {
    return sanitizeHtml(message, {
      allowedTags: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "span",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
      ],
      allowedAttributes: {
        a: ["href"],
      },
      allowedIframeHostnames: ["www.youtube.com"],
    });
  };

  return (
    <div className="w-full flex flex-col ">
      <div className="flex justify-between items-center ">
        <div className="flex gap-2 ">
          <span className=" w-10 rounded-full text-white aspect-square bg-darkBlue grid place-items-center">
            {name}
          </span>
          <div className="flex flex-col justify-between ">
            <p className="text-[0.8275rem] font-semibold">{username}</p>
            <p className="text-[0.6275rem] font-semibold text-orange-400 mt-auto">
              {priority}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Actions>
            <SingleAction name={"Print"} Icon={FiPrinter} />
            <SingleAction
              name={"Reply"}
              Icon={GoReply}
              onClick={() => {
                setReplyingTo(username);
              }}
            />
            <SingleAction name={"Forward"} Icon={TbArrowForward} />
            <SingleAction name={"Add Note"} Icon={CiStickyNote} />
          </Actions>
          <p className="text-[0.725rem] font-semibold text-darkBlue">{date}</p>
        </div>
      </div>
      {complaintDetails.length > 0 && (
        <div className="w-full  rounded-lg bg-neutral-300 my-2 grid grid-cols-3  md:grid-cols-4 md:grid-rows-2 p-2 gap-y-3 text-center">
          {complaintDetails?.map((complaintInfo) => {
            if (complaintInfo.title === "Attachments")
              return <Attachments data={complaintInfo.data} />;
            if (complaintInfo.title === "Rating")
              return <StarRating value={complaintInfo.data} />;
            return (
              <div className="col-span-1 flex flex-col justify-between items-center p-1 h-[3.5rem] ">
                <p className="text-[0.75rem]   text-neutral-500 font-semibold">
                  {complaintInfo.title}
                </p>
                <p className="text-[0.6275rem] text-neutral-700 mt-auto">
                  {complaintInfo.data}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {message && !isMessage && (
        <div className="px-6  text-[0.7275rem] py-2 bg-neutral-200 rounded-md leading-4 mt-4">
          {message}
        </div>
      )}
      {message && isMessage && (
        <div
          className=" ticketMessage px-6  py-2 bg-neutral-200 rounded-md leading-4 mt-4"
          dangerouslySetInnerHTML={{ __html: cleanHtml(message) }}
        ></div>
      )}
    </div>
  );
};

const Attachments = ({ data }) => {
  console.log(data);
  return (
    <div className="col-span-1 flex flex-col justify-between h-full items-center  p-1">
      <Dialog>
        <DialogTrigger
          className={cn(
            "border-none outline-none text-blue-400 text-[0.75rem] grid place-items-center",
            data.length === 0 && "text-neutral-800 line-through"
          )}
        >
          View Attachments
        </DialogTrigger>
        {data.length > 0 && (
          <DialogContent className="">
            {data.map((link) => (
              <a href={link} target="_blank" className="text-sm text-blue-5a00">
                {link}
              </a>
            ))}
          </DialogContent>
        )}
      </Dialog>
      <p className="text-[0.6275rem] text-neutral-700 mt-auto">Attachments</p>
    </div>
  );
};
const StarRating = ({ value }) => {
  return (
    <div className="col-span-1 flex flex-col items-center justify-between p-1 ">
      <p className="text-[0.75rem] text-neutral-600 font-semibold">
        {value} Stars
      </p>
      <p className="text-[0.6275rem] text-neutral-800">Rating</p>
    </div>
  );
};
