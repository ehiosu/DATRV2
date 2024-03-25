import React, { useEffect, useRef, useState } from "react";
import { redirect, useParams } from "react-router";
import { SearchPage } from "../../Reusable/SearchPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Textarea } from "../../components/ui/textarea";
import { ArrowDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { DatePickerDemo } from "../../components/ui/Datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectLabel,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
} from "../../components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "../../components/ui/command";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import useWindowSize from "../Sidebar/Hooks/useWindowSize";
import { TipTapEditor } from "../Components/TipTapEditor";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as sanitizeHtml from "sanitize-html";

export const TicketPage = () => {
  const { id } = useParams();
  if (!id) return redirect("/CPD/Dashboard");
  const { axios } = useAxiosClient();
  const [messages, setMessages] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const messageEndRef = useRef(null);
  const containerRef = useRef(null);
  const currentMessageCount = useRef(0);
  const scrollArrowRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState("");
  const btnStyles = {
    PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
    UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
    RESOLVED: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
    OPENED: "bg-[#FF585821] border-2 border-[#FF5858]",
    ESCALATED: "bg-[#D016DD21] border-2 border-[#D116DD]",
    UNASSIGNED: "",
  };

  const ticketQuery = useQuery({
    queryKey: ["tickets", `${id}`],
    queryFn: () =>
      axios(`tickets/${id}`, {
        method: "Get",
      }).then((resp) => resp.data),
  });

  useEffect(() => {
    if (
      currentMessageCount.current < messages.length &&
      scrollArrowRef.current
    ) {
      console.log("new messages");
      scrollArrowRef.current.style.setProperty("opacity", 100);
      setNewMessageCount(messages.length - currentMessageCount.current);
      currentMessageCount.current = messages.length;
    } else {
      console.log("equal number of messages");
    }
  }, [messages]);

  const scrollToNewMessages = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      scrollArrowRef.current.style.setProperty("opacity", 0);
      currentMessageCount.current = messages.length;
    }
  };
  const commentsQuery = useQuery({
    queryKey: ["comments", `${id}`],
    queryFn: () =>
      axios(`comments/ticket-id?value=${id}`, {
        method: "GET",
      })
        .then((resp) => {
          setMessages(resp.data);
          return resp.data;
        })
        .catch((err) => err),
  });

  const addMessage = (message) => {
    let _messages = [...messages];
    _messages.push(message);
    setMessages([..._messages]);
  };
  const handleMouseMove = (e) => {
    console.log("mouse move");
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      console.log({ scrollTop, scrollHeight, clientHeight });
      const isAtBottom =
        Math.abs(scrollHeight - Math.round(scrollTop)) <= clientHeight;
      if (isAtBottom) {
        console.log("is at bottom");
        scrollArrowRef.current.style.setProperty("opacity", 0);
        currentMessageCount.current = messages.length;
      }
    }
  };
  return (
    <section className="w-full max-h-screen overflow-y-auto">
      {ticketQuery.isSuccess && (
        <SearchPage isRedirect={true} heading={"Back"}>
          <div className="flex md:gap-0 gap-3 justify-between items-center flex-wrap flex-1 ">
            <div className="flex flex-col">
              <div className="flex  gap-2 items-center ">
                <p className="text-[1.4rem] font-semibold text-darkBlue">
                  {ticketQuery.data.complainantType}
                </p>
                <span
                  className={`block w-max px-3 text-[0.7275rem] rounded-md ${btnStyles.Pending}`}
                >
                  Pending
                </span>
              </div>
              <div className="flex items-center gap-2 text-[0.8275rem]">
                <p className="font-semibold">{ticketQuery.data.priority}</p>
                <p className="text-darkBlue font-semibold">Ticket ID: {id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ticketQuery.data.assignerName && (
                <>
                  <span className=" h-8 grid place-items-center aspect-square rounded-full bg-darkBlue text-white">
                    {ticketQuery.data.assignerName?.substring(0, 1)}
                  </span>
                  <p className="text-[0.8275rem] text-darkBlue font-semibold">
                    {ticketQuery.data.assignerName}
                  </p>
                </>
              )}
              <ActionsComponent />
            </div>
          </div>
          <div className="flex mt-3 ">
            <div className="flex-[2.5] border-r-2 border-t-2 p-2 h-[70vh] max-w-full relative">
              <div
                role="button"
                className="w-6 hover:scale-110 transition hover:font-semibold aspect-square rounded-full shadow-md p-1 absolute bottom-28 text-white   right-12 z-[10] bg-darkBlue flex flex-col items-center justify-center space-y-2"
                ref={scrollArrowRef}
                style={{ opacity: 0 }}
                onClick={() => {
                  scrollToNewMessages();
                }}
              >
                <ArrowDown size={12} />
              </div>
              <div
                className=" border-neutral-200 flex flex-col px-5 py-2 gap-3  h-[45vh] overflow-y-auto relative"
                ref={containerRef}
                onScroll={handleMouseMove}
              >
                <SignleTicketMessage
                  name={"DG"}
                  username={"DG Office"}
                  priority={ticketQuery.data.slaName}
                  date={format(
                    new Date(ticketQuery.data.dateTimeCreated),
                    "dd, MMMM yyyy"
                  )}
                  setReplyingTo={() => {}}
                  message={""}
                  complaintDetails={[
                    {
                      title: "Request Type",
                      data: ticketQuery.data.complainantType,
                    },
                    {
                      title: "Complainant Name",
                      data: ticketQuery.data.complainantName,
                    },
                    {
                      title: "Complainant Email",
                      data: ticketQuery.data.complainantEmail,
                    },
                    {
                      title: "Complainant Phone",
                      data: ticketQuery.data.complainantPhoneNo,
                    },
                    { title: "Location", data: ticketQuery.data.route },
                    { title: "Zone", data: ticketQuery.data.location },
                    { title: "Rating", data: "3" },
                    {
                      title: "Attachments",
                      data: ticketQuery.data.attachment.attachmentUrl,
                    },
                  ]}
                />
                {commentsQuery.isSuccess &&
                  messages.map((comment) => (
                    <SignleTicketMessage
                      isMessage={comment.commentType === "MESSAGE"}
                      name={`${comment.authorName.split(" ")[0][0]} ${
                        comment.authorName.split(" ")[1][0]
                      }`}
                      username={comment.authorName}
                      setReplyingTo={setReplyingTo}
                      message={comment.content}
                      date={format(
                        new Date(comment.dateTimeCreated),
                        "dd, MMMM yyyy"
                      )}
                    />
                  ))}
                <div ref={messageEndRef} />
              </div>
              {replyingTo && (
                <div className="text-[0.8275rem] w-[40%] bg-neutral-200 py-1 px-3 rounded-sm shadow-sm flex items-center justify-between group/reply">
                  <p>{replyingTo}</p>
                  <div className="h-full aspect-square group/reply-btn  group-hover/reply:opacity-100 transition duration-300 group-hover/reply:bg-neutral-300  p-1 rounded-md opacity-0">
                    <CgClose
                      onClick={() => {
                        setReplyingTo("");
                      }}
                      className="group-hover/reply-btn:font-bold group-hover/reply-btn:text-red-600 group-hover/reply-btn:scale-110 transition"
                      role="button"
                    />
                  </div>
                </div>
              )}
              <TipTapEditor
                disabled={!commentsQuery.isSuccess}
                addMessage={addMessage}
              />
            </div>
            <LeftPanel />
          </div>
        </SearchPage>
      )}
    </section>
  );
};
const AddNotePopover = () => {
  const { screenSize } = useWindowSize();
  const { axios } = useAxiosClient();
  const { id } = useParams();
  const client = useQueryClient();
  const popoverTrigger = useRef(null);
  const noteFormSchema = z.object({
    content: z.string("Enter a valid comment!"),
  });
  const addNoteForm = useForm({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(noteFormSchema),
  });
  const addNoteMutation = useMutation({
    mutationKey: ["note"],
    mutationFn: (content) =>
      axios("/comments/add", {
        method: "POST",
        data: {
          commentType: "COMMENT",
          mentions: [],
          ticketId: id,
          content: content,
        },
      })
        .then((resp) => {
          addNoteForm.reset({
            content: "",
          });
          popoverTrigger.current?.click();
          toast({
            title: "Success!",
            description: "Comment successfully added.",
          });
          client.invalidateQueries({ queryKey: ["comments", `${id}`] });
          return resp.data;
        })
        .catch((err) => err),
  });

  const tryAddNote = (values) => {
    addNoteMutation.mutate(values.content);
  };
  return (
    <Popover>
      <PopoverTrigger
        className="text-xs text-center  w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2"
        ref={popoverTrigger}
      >
        Add Comment
      </PopoverTrigger>
      <PopoverContent
        side={screenSize == "small" ? "top" : "left"}
        className="w-80 h-40"
      >
        <Form {...addNoteForm}>
          <form onSubmit={addNoteForm.handleSubmit(tryAddNote)}>
            <FormField
              name="content"
              control={addNoteForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Please Type here"
                      {...field}
                      className="focus:outline-none focus:ring-0 focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                  <Button
                    disabled={addNoteMutation.isPending}
                    type="submit"
                    variant={"outline"}
                    className="w-full my-2  disabled:cursor-wait "
                  >
                    Submit
                  </Button>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

const AddReminderPopover = () => {
  const { screenSize } = useWindowSize();
  return (
    <Popover>
      <PopoverTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2">
        Add Reminder
      </PopoverTrigger>
      <PopoverContent
        side={screenSize == "small" ? "top" : "left"}
        className="w-80 "
      >
        <p className="my-2 text-[0.8275rem] font-semibold text-blue-400">
          Date
        </p>
        <DatePickerDemo className="w-full h-8" />
        <p className="my-2 text-[0.8275rem] font-semibold text-blue-400">
          Time
        </p>
        <input
          type="time"
          className="w-full focus-within:outline-none focus:outline-none focus:border-neutral-100 focus-within:border-neutral-100  rounded-md border-[2px] border-neutral-100"
        />
        <p className="my-2 text-[0.8275rem] font-semibold text-blue-400">
          Snooze
        </p>
        <Select defaultValue="0">
          <SelectTrigger className="focus:outline-none focus-within:outline-none focus:ring-0 focus-within:ring-0">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0 minutes</SelectItem>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="15">10 minutes</SelectItem>
            <SelectItem value="20">15 minutes</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={"outline"} className="w-full my-2">
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const AddWorkLogPopover = () => {
  const { screenSize } = useWindowSize();
  return (
    <Popover>
      <PopoverTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2">
        Add Work Log
      </PopoverTrigger>
      <PopoverContent
        side={screenSize == "small" ? "top" : "left"}
        className="w-80 h-40"
      >
        <Textarea
          placeholder="Please Type here"
          className="focus:outline-none focus:ring-0 focus-visible:ring-0"
        />
        <Button variant={"outline"} className="w-full my-2">
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const AddCommentDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2 focus:ring-0 focus:outline-none focus-within:ring-0 focus-within:outline-none">
        Add Comment
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="text-darkBlue font-semibold">
          Add Comment
        </AlertDialogHeader>
        <Textarea
          placeholder="Type here..."
          className="focus:outline-none focus:ring-0 focus-visible:ring-0"
        />
        <div className="flex items-center gap-4">
          <AlertDialogAction className="flex-1 bg-darkBlue">
            Submit
          </AlertDialogAction>
          <AlertDialogCancel className="flex-1 bg-lightPink hover:bg-lightPink hover:bg-blend-darken text-white hover:text-white">
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EscalatePopover = () => {
  const { screenSize } = useWindowSize();
  return (
    <Popover>
      <PopoverTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2">
        Escalate Ticket
      </PopoverTrigger>
      <PopoverContent
        side={screenSize == "small" ? "top" : "left"}
        className="px-2 py-1 w-[20rem]"
      >
        <p className="text-xl text-blue-400">Escalate Ticket</p>
        <p className="text-[0.8275rem] text-darkBlue my-2">Escalate Issue To</p>
        <Command>
          <CommandInput
            className="border-none ring-0 focus:border-none focus:ring-0 h-8 text-[0.8275rem] text-neutral-700"
            placeholder="Search for Agent"
          ></CommandInput>
          <CommandEmpty>Agent doesn't exist</CommandEmpty>
          <CommandGroup></CommandGroup>
        </Command>
        <p className="text-[0.8275rem] text-darkBlue my-2">
          Reason For Escalation
        </p>
        <Select>
          <SelectTrigger className="w-full my-2 ring-0 focus:ring-0 ">
            <SelectValue placeholder="Reason for escalation..." />{" "}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">Issue Out of Control</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={"outline"} className="w-full my-2">
          Submit
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const ActionsComponent = () => {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center gap-2 text-[0.8275rem] w-40 bg-neutral-200 h-8 rounded-md">
        Needs action <ArrowDown className="w-4 aspect-square" />
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-44">
        <AddNotePopover />
        <AddReminderPopover />
        {/* <AddWorkLogPopover /> */}
        {/* <AddCommentDialog /> */}
        <EscalatePopover />
      </PopoverContent>
    </Popover>
  );
};
import { FiMessageCircle } from "react-icons/fi";
const ExtraActions = () => {
  return (
    <div className="w-full flex flex-col mt-2 px-2 gap-2">
      <Button className="w-full h-12 focus:text-blue-400 dark:bg-white bg-white flex items-center justify-start gap-2 ">
        <FiMessageCircle />
        Conversations
      </Button>
      <DetailsSubAction />
      <HistorySubAction />
    </div>
  );
};

const LeftPanel = () => {
  return (
    <div className="flex-[1] border-t-2 border-neutral-200 md:block hidden">
      <TimerComponent />
      <ExtraActions />
    </div>
  );
};

const TimerComponent = () => {
  const { id } = useParams();
  const client = useQueryClient();
  const ticketData = client.getQueryData(["tickets", `${id}`]);
  const [timeToTimeout, setTimeToTimeout] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const expiry = new Date(ticketData.dateTimeTicketExpired);
      const now = new Date();
      let dif = now - expiry;
      const hours = Math.abs(Math.floor(dif / 3600000)); // 1 hour = 3600000 milliseconds
      dif %= 3600000;
      const minutes = Math.abs(Math.floor(dif / 60000)); // 1 minute = 60000 milliseconds
      dif %= 60000;
      const seconds = Math.abs(Math.floor(dif / 1000));
      setTimeToTimeout(`${hours} h : ${minutes} m : ${seconds} s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className=" ml-2 h-24 w-[80%] mt-2 border-2 border-neutral-200 rounded-lg bg-white text-center flex flex-col items-center justify-center">
      <p className="text-darkBlue lg:text-[1.3rem] font-semibold">
        Time To Expiry:
      </p>
      <p className="text-blue-400 lg:text-[1.3rem] font-semibold">
        {timeToTimeout}
      </p>
    </div>
  );
};
import { CgClose, CgDetailsMore } from "react-icons/cg";
import { MdHistory } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { toast } from "../../components/ui/use-toast";
import { SignleTicketMessage } from "../Components/SingleMessage";
import { useForm } from "react-hook-form";
const DetailsSubAction = () => {
  const { id } = useParams();
  const client = useQueryClient();

  const ticketData = client.getQueryData(["tickets", `${id}`]);

  const detailsInfo = {
    ticketId: ticketData.id,
    status: ticketData.ticketStatus,
    life_cycle: "24 Hours",
    consumer_protection_officer: ticketData.creatorName,
    tasks: "0",
    reminders: "0",
    Approval_Status: "Not Approved",
    Attachments: ticketData.attachment.attachmentUrl.length,
    Responded_Date: format(new Date(ticketData.dateTimeModified), "dd/MM/yyyy"),
    Due_By: format(new Date(ticketData.dateTimeTicketExpired), "dd/MM/yyyy"),
    Working_Timer: "4h:30M:20S",
    Assigner: ticketData.assigneeName,
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="w-full h-12 focus:text-blue-400 focus-within:text-blue-400 dark:bg-white bg-white flex items-center justify-start gap-2">
          <CgDetailsMore />
          Details
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" className="w-[35vw] h-[60vh] px-4">
        <p className="text-[1.3rem] font-semibold ">Details</p>
        <div className=" w-full grid grid-cols-3 grid-rows-4 gap-y-3 h-[90%]">
          {Object.keys(detailsInfo).map((key, index) => {
            return <DetailCellManager cellKey={key} value={detailsInfo[key]} />;
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DetailCellManager = ({ cellKey, value }) => {
  const { id } = useParams();
  const { axios } = useAxiosClient();
  const client = useQueryClient();
  const statusesQuery = useQuery({
    queryKey: ["Tickets", "statuses"],
    queryFn: () =>
      axios("tickets/statuses", {
        method: "GET",
      }).then((resp) => {
        console.log(resp.data);
        return resp.data;
      }),
    staleTime: Infinity,
  });
  const changeStatusMutation = useMutation({
    mutationKey: ["statusChange"],
    mutationFn: (value) =>
      axios
        .patch(`/tickets/${id}`, [
          { op: "replace", path: "/ticketStatus", value: `${value}` },
        ])
        .then((resp) => {
          toast({
            title: "Success!",
            description: "Ticket Updated",
          });
          client.invalidateQueries({ queryKey: ["tickets", `${id}`] });
        })
        .catch((err) => {
          toast({
            title: "Error!",
            description: err.message,
            variant: "destructive",
          });
        }),
  });
  const tryChangeStatus = (status) => {
    changeStatusMutation.mutate(status);
  };
  if (cellKey === "ticketID")
    return (
      <div className="col-span-1  flex flex-col  items-center   justify-center">
        <p className="text-[0.75rem] text-neutral-700 font-semibold">{id}</p>
        <p className="text-[0.6275rem] text-neutral-500 ">{cellKey}</p>
      </div>
    );
  if (cellKey !== "status")
    return (
      <div className="col-span-1  flex flex-col  items-center  justify-center">
        <p className="text-[0.75rem] text-neutral-700 font-semibold">{value}</p>
        <p className="text-[0.6275rem] text-neutral-500 ">
          {cellKey.replaceAll("_", " ")}
        </p>
      </div>
    );

  return (
    <div className="col-span-1 flex flex-col justify-center items-center ">
      <Select
        defaultValue={value}
        disabled={!statusesQuery.isSuccess || changeStatusMutation.isPending}
        onValueChange={tryChangeStatus}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select A Status" />
        </SelectTrigger>
        {statusesQuery.isSuccess && (
          <SelectContent>
            {statusesQuery.data.map((status) => {
              return <SelectItem value={status}>{status}</SelectItem>;
            })}
          </SelectContent>
        )}
      </Select>
      <p className="text-[0.6275rem] text-neutral-400"></p>
    </div>
  );
};

const HistorySubAction = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="w-full h-12 focus:text-blue-400 focus-within:text-blue-400 dark:bg-white bg-white flex items-center justify-start gap-2">
          <MdHistory />
          History
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" className="w-[35vw] h-[60vh] px-4">
        <p className="text-[1.3rem] font-semibold ">History</p>
        <div className="flex items-center gap-3">
          <p className="text-[0.675rem] text-neutral-400 font-semibold ">
            Filter By
          </p>
          <Select>
            <SelectTrigger className="w-60 h-8 py-0 focus:ring-transparent text-[0.6275rem]">
              <SelectValue placeholder="Select A Value" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};
