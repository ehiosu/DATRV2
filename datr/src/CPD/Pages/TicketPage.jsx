import React, { useEffect, useRef, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router";
import { SearchPage } from "../../Reusable/SearchPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Textarea } from "../../components/ui/textarea";
import { ArrowDown, CheckCircle, Trash } from "lucide-react";
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
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import useWindowSize from "../Sidebar/Hooks/useWindowSize";
import { TipTapEditor } from "../Components/TipTapEditor";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as sanitizeHtml from "sanitize-html";
import { toast as sonnerToast } from "sonner";
export const TicketPage = () => {
  const { id } = useParams();
  if (!id) return redirect("/CPD/Dashboard");
  const { axios } = useAxiosClient();
  const [messages, setMessages] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  const messageEndRef = useRef(null);
  const containerRef = useRef(null);
  const currentMessageCount = useRef(0);
  const scrollArrowRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState("");
  const textAreaRef = useRef(null);
  const btnStyles = {
    PENDING: "bg-[#162ADD]/40 border-2 border-[#162ADD]",
    UNRESOLVED: "bg-[#F8C74D29] border-2 border-[#F8C74D]",
    RESOLVED: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
    OPENED: "bg-[#FF585821] border-2 border-[#FF5858]",
    ESCALATED: "bg-[#D016DD21] border-2 border-[#D116DD]",
    UNASSIGNED: "",
    CLOSED: "bg-red-200 border-2 border-red-500",
    NEW: "bg-[#5AD1AD]/40 border-2 border-[#5AD1AD]",
  };
  const [ticketContent, setTicketContent] = useState("");
  const ticketQuery = useQuery({
    queryKey: ["tickets", `${id}`],
    queryFn: () =>
      axios(`tickets/${id}`, {
        method: "Get",
      }).then((resp) => resp.data),
  });
  const sendMessageMutation = useMutation({
    mutationKey: ["comment", "new"],
    mutationFn: () =>
      new Promise((resolve, reject) =>
        axios("comments/add", {
          method: "POST",
          data: {
            ticketId: ticketQuery.data["id"],
            content: ticketContent,
            commentType: "MESSAGE",
            mentions: [],
            cc: [],
            bcc: [],
          },
        })
          .then((resp) => resolve(resp.data))
          .catch((err) => reject(err))
      ),
  });
  useEffect(() => {
    if (
      currentMessageCount.current < messages.length &&
      scrollArrowRef.current
    ) {
      scrollArrowRef.current.style.setProperty("opacity", 100);
      setNewMessageCount(messages.length - currentMessageCount.current);
      currentMessageCount.current = messages.length;
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
    staleTime: Infinity,
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

  const handleMouseMove = (e) => {
    console.log("mouse move");
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      console.log({ scrollTop, scrollHeight, clientHeight });
      const isAtBottom =
        Math.abs(scrollHeight - Math.round(scrollTop)) <= clientHeight;
      if (isAtBottom) {
        scrollArrowRef.current.style.setProperty("opacity", 0);
        currentMessageCount.current = messages.length;
      }
    }
  };
  const trySendMessage = () => {
    sonnerToast.promise(
      new Promise((resolve, reject) =>
        sendMessageMutation.mutate(undefined, {
          onSuccess: (data) => {
            resolve(data);
            setMessages((state) => [...state, data]);
            setTicketContent("");
            commentsQuery.refetch();
          },
          onError: (error) => {
            reject(error);
          },
        })
      ),
      {
        loading: "Trying to send message...",
        success: "Message Sent Successfully!",
        error: (error) => {
          return (
            <div className="text-black flex flex-col">
              <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                <MdError /> Error
              </p>
              <p>{error.response.data.message || error.response.data.detail}</p>
            </div>
          );
        },
      }
    );
  };
  return (
    <section className="w-full ">
      {ticketQuery.isSuccess && (
        <>
          <div className="flex md:gap-0 gap-3 justify-between items-center flex-wrap flex-1 ">
            <div className="flex flex-col">
              <div className="flex  gap-2 items-center ">
                <p className="text-[1.4rem] font-semibold text-darkBlue">
                  {ticketQuery.data.complainantType}
                </p>
                <span
                  className={`block w-max px-3 text-[0.7275rem] rounded-md ${
                    btnStyles[ticketQuery.data.ticketStatus]
                  }`}
                >
                  {ticketQuery.isSuccess &&
                    ticketQuery.data.ticketStatus.toLowerCase()}
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
          <div className="flex mt-3 r">
            <div className="flex-[2.5] border-r-2 border-t-2 p-2 h-[70vh] max-w-full relative ">
              <div
                className=" border-neutral-200 flex flex-col px-5 py-2 gap-3  h-[45vh] overflow-y-auto relative "
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
                <div
                  role="button"
                  className="w-6 hover:scale-110 transition hover:font-semibold aspect-square rounded-full shadow-md p-1 absolute bottom-0 text-white   right-12 z-[10] bg-darkBlue flex flex-col items-center justify-center space-y-2"
                  ref={scrollArrowRef}
                  style={{ opacity: 0 }}
                  onClick={() => {
                    scrollToNewMessages();
                  }}
                >
                  <ArrowDown size={12} />
                </div>
              </div>
              {replyingTo && (
                <div className="text-[0.8275rem] w-max px-1.5 rounded-md  bg-ncBlue text-white py-1  shadow-sm flex items-center justify-between group/reply">
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
              <div
                className={cn(
                  "flex flex-col mt-3  bg-white text-parent shadow-sm rounded-md p-1.5",
                  isTextAreaFocused && "focused"
                )}
              >
                <Textarea
                  value={ticketContent}
                  onChange={(e) => {
                    setTicketContent(e.target.value);
                  }}
                  onFocus={(e) => {
                    setIsTextAreaFocused(true);
                  }}
                  ref={textAreaRef}
                  className="flex-1 resize-none text-child bg-transparent dark:bg-transparent ring-transparent dark:ring-transparent outline-none dark:outline-none focus:outline-none dark:focus:outline-none focus-within:outline-none dark:focus-within:outline-none border-transparent dark:border-transparent focus-visible:outline-none dark:focus-visible:outline-none focus-visible:ring-transparent dark:focus-visible:ring-transparent dark:focus-visible:border-transparent focus-visible:border-transparent text-sm"
                ></Textarea>
                <button
                  disabled={ticketContent.length === 0}
                  onClick={() => {
                    trySendMessage();
                  }}
                  className="ml-auto w-max h-max py-1.5 px-5 bg-ncBlue text-white rounded-md"
                >
                  Send
                </button>
              </div>
              {/* <TipTapEditor
                disabled={!commentsQuery.isSuccess}
                addMessage={addMessage}
              /> */}
            </div>
            <LeftPanel />
          </div>
        </>
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
      axios("comments/add", {
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
  const { id } = useParams();
  const { axios } = useAxiosClient();
  const client = useQueryClient();
  const escalateTicketMutation = useMutation({
    mutationKey: ["ticket", `${id}`, "escalate"],
    mutationFn: (values) =>
      new Promise((resolve, reject) => {
        return axios(`tickets/escalate/${id}`, {
          method: "PUT",
          data: {
            agentEmail: values.agentEmail,
            reason: values.reasonForEscalation,
          },
        })
          .then((resp) => resolve(resp.data))
          .catch((err) => reject(err));
      }),
  });
  const tryEscalate = (values) => {
    sonnerToast.promise(
      new Promise((resolve, reject) => {
        escalateTicketMutation.mutate(values, {
          onSuccess: (data) => {
            client.invalidateQueries({
              queryKey: ["tickets", `${id}`],
            });
            resolve(data);
          },
          onError: (err) => reject(err),
        });
      }),
      {
        loading: "Trying to escalate ticket...",
        success: "Ticket Escalated successfully..",
        error: (error) => {
          console.log(error.response.data.message);
          return (
            <div className="text-black flex flex-col">
              <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
                <BiError /> Error
              </p>
              <p>{error.response.data.message || error.response.data.detail}</p>
            </div>
          );
        },
      }
    );
  };
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
        <EscalateTicketForm onSubmitForm={tryEscalate} />
      </PopoverContent>
    </Popover>
  );
};
import logo from "/NCAALogo.png";
const SeekApprovalPopover = () => {
  const { screenSize } = useWindowSize();
  // const { axios } = useAxiosClient();
  // const client = useQueryClient();
  const { id } = useParams();
  const [approvalRemark, SetApprovalRemark] = useState("");
  const [HasFocused, SetHasFocused] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-xs text-center w-full hover:cursor-pointer hover:text-blue-400 h-6 my-2">
        Submit For Approval
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-1 overflow-hidden max-h-screen overflow-y-auto">
        <AlertDialogCancel className="w-7 h-7 p-0 ml-auto bg-opacity-0 bg-transparent dark:bg-transparent border-0 hover:bg-lightPink hover:text-white">
          <AiOutlineClose />
        </AlertDialogCancel>
        <AlertDialogHeader className="font-semibold text-[1.2rem]">
          Approval Request
        </AlertDialogHeader>
        <div className="flex flex-row space-x-1">
          <p className="font-semibold">Ticket ID </p> <p> {`${id}`}</p>
        </div>
        <Textarea
          onFocus={(e) => {
            if (approvalRemark.length > 0 && !HasFocused) {
              SetHasFocused(true);
            }
          }}
          placeholder="Add Closing Remark.."
          onChange={(e) => {
            if (approvalRemark.length > 0) {
              SetHasFocused(() => true);
            }
            SetApprovalRemark(() => e.target.value);
          }}
          className="dark:focus-visible:ring-transparent placeholder:text-[0.75rem] dark:ring-offset-transparent focus-visible:ring-transparent max-h-[300px]"
        />
        {HasFocused && approvalRemark.length == 0 ? (
          <p className="text-sm text-red-400">Ensure to type in a remark</p>
        ) : (
          <></>
        )}
        <Button
          variant={"ghost"}
          disabled={approvalRemark.length == 0}
          className="hover:bg-lightPink dark:hover:bg-lightPink transition hover:text-white dark:hover:text-white"
        >
          Submit
        </Button>
        <img
          src={
            "https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"
          }
          className="absolute z-[-1] opacity-30 w-1/2   -translate-y-1/2 -left-20"
          alt=""
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};
const EscalateTicketForm = ({ onSubmitForm }) => {
  const formSchema = z.object({
    agentEmail: z.string().email(),
    reasonForEscalation: z.string(),
  });
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const trySubmit = (values) => {
    onSubmitForm(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(trySubmit)}>
        <FormField
          name="agentEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem className="my-2">
              <FormLabel className="text-sm text-neutral-500 font-[400]">
                Agent Email
              </FormLabel>
              <FormControl>
                <Input
                  className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          name="reasonForEscalation"
          control={form.control}
          render={({ field }) => (
            <FormItem className="my-2">
              <FormLabel className="text-sm text-neutral-500 font-[400]">
                Reason For Escalation
              </FormLabel>
              <FormControl>
                <Textarea
                  className="w-full h-8 outline-none  border-b-2 dark:bg-white bg-white dark:border-gray-200  border-gray-200"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <Button type="submit" variant={"outline"} className="w-full my-2">
          Submit
        </Button>
      </form>
    </Form>
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
        <EscalatePopover />
        <SeekApprovalPopover />
        <DeleteAction />
      </PopoverContent>
    </Popover>
  );
};
import { FiMessageCircle } from "react-icons/fi";
const ExtraActions = () => {
  return (
    <div className="w-full flex flex-col mt-2 px-2 gap-2">
      <DetailsSubAction />
      <HistorySubAction />
      <ApprovalSubAction />
    </div>
  );
};

const LeftPanel = () => {
  return (
    <div className="flex-[1] border-t-2 border-neutral-200 md:block hidden">
      <TimerComponentManager />
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
import { MdError, MdHistory } from "react-icons/md";
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
    Airline: ticketData.airline,
    Assigner: ticketData.assigneeName,
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="w-full h-12 focus:text-blue-400 focus-within:text-blue-400  bg-ncBlue dark:bg-ncBlue text-white dark:text-white hover:bg-slate-700 dark:hover:bg-slate-700  flex items-center justify-start gap-2">
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

const ApprovalSubAction = () => {
  const { id } = useParams();
  const popoverRef = useRef(null);
  return (
    <Popover>
      <PopoverTrigger ref={popoverRef}>
        <Button className="w-full h-12 focus:text-blue-400 focus-within:text-blue-400 bg-ncBlue dark:bg-ncBlue text-white dark:text-white hover:bg-slate-700 dark:hover:bg-slate-700 flex items-center justify-start gap-2">
          <CheckCircle className="w-3 h-3 shrink" />
          Approval
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        className="md:w-[35vw] min-w-[420px] w-[70vw] h-[60vh] px-4 flex flex-col overflow-y-auto scroll-smooth relative"
      >
        <div className="h-12 p-1 border-b-2 border-b-neutral-300/60">
          <p className="text-xl font-semibold ">Approvals</p>
        </div>
        <p className="font-semibold text-[0.9rem] my-2">CPO Remark</p>
        <p className="text-sm text-neutral-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
          molestias eos deleniti ad. Magni, obcaecati at ad necessitatibus
          ducimus numquam itaque exercitationem non, quae et nostrum quia animi
          optio minus?
        </p>
        <div className="flex mt-3 items-center flex-wrap space-x-2">
          <ConfirmationDialog>
            <button className="w-28  h-9 bg-blue-400 text-white rounded-md">
              Approve
            </button>
          </ConfirmationDialog>
          <button
            onClick={() => {
              popoverRef.current.click();
            }}
            className="w-28 bg-lightPink  h-9 rounded-lg text-white"
          >
            Return
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
const HistorySubAction = () => {
  const { id } = useParams();
  const { axios } = useAxiosClient();
  const [historyFilter, setHistoryFilter] = useState("");
  const [key, setKey] = useState(new Date());
  const GetTicketHistoryQuery = useQuery({
    queryKey: ["ticket", `${id}`, "history"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 5000,
    queryFn: () =>
      axios(`histories/ticket/${id}`)
        .then((resp) => resp.data)
        .catch((err) => {
          throw err;
        }),
  });
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="w-full h-12 focus:text-blue-400 focus-within:text-blue-400 bg-ncBlue dark:bg-ncBlue text-white dark:text-white hover:bg-slate-700 dark:hover:bg-slate-700 flex items-center justify-start gap-2">
          <MdHistory />
          History
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        className="md:w-[35vw] min-w-[420px] w-[70vw] h-[60vh] px-4 flex flex-col overflow-y-auto scroll-smooth"
      >
        <p className="text-[1.3rem] font-semibold ">History</p>
        <div className="flex items-center gap-3">
          <p className="text-[0.675rem] text-neutral-400 font-semibold ">
            Filter By
          </p>
          <Select
            key={key}
            value={historyFilter}
            onValueChange={(value) => setHistoryFilter(value)}
          >
            <SelectTrigger className="w-60 h-8 py-0 focus:ring-transparent text-[0.6275rem]">
              <SelectValue placeholder="Select A Value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="COMMENT">Comment</SelectItem>
              <Button
                onClick={() => {
                  setHistoryFilter("");
                  setKey(new Date());
                }}
                variant={"ghost"}
                className="w-full rounded-none text-start font-normal flex justify-start pl-8 pr-2 h-7 py-1.5"
              >
                None
              </Button>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col flex-1">
          {GetTicketHistoryQuery.isError ? (
            <div className="flex flex-1 items-center justify-center flex-col">
              <span className="flex flex-row items-center text-sm font-[400]">
                <MdError /> Error Fetching Data
              </span>
              <Button
                onClick={() => {
                  GetTicketHistoryQuery.refetch();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : GetTicketHistoryQuery.isSuccess ? (
            <TicketHistoryList
              filter={historyFilter}
              data={GetTicketHistoryQuery.data}
            />
          ) : (
            <TicketHistoryLoading />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

import { Skeleton } from "../../components/ui/skeleton";
import { BiError } from "react-icons/bi";
import { ConfirmationDialog } from "../Components/DataTable";
import { AiOutlineClose } from "react-icons/ai";
import { cn } from "../../lib/utils";
const TicketHistoryLoading = () => {
  return (
    <div>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
};

const TicketHistoryList = ({ data = [], filter = "" }) => {
  return (
    <div className="flex flex-col flex-1 ">
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p>No History To Display</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col mt-2 space-y-2">
          <div className="flex items-center md:h-8 ">
            <div className="flex-1 text-sm pl-4 py-2">
              <p>Date</p>
            </div>
            <div className="flex-1 text-sm pl-4 py-2">
              <p>Time</p>
            </div>
            <div className="flex-1 text-sm pl-4 py-2">
              <p>Operation</p>
            </div>
            <div className="flex-[2] text-sm pl-4 py-2">
              <p>Description</p>
            </div>
          </div>
          {data
            .filter((entry) => entry.operation.startsWith(filter))
            .map((histroyEntry, index) => (
              <div
                className={`flex items-start md:min-h-10  text-neutral-600 ${
                  index % 2 === 1 &&
                  index !== data.length - 1 &&
                  "pb-8 border-b-2 border-b-neutral-100"
                }`}
                key={histroyEntry.id}
              >
                <div className="flex-1 text-[14px] pl-4 py-2">
                  <p>
                    {format(
                      new Date(histroyEntry.dateTimeCreated),
                      "dd-MM-yyyy"
                    )}
                  </p>
                </div>
                <div className="flex-1 text-[14px]  pl-4 py-2 ">
                  <p> {format(new Date(histroyEntry.dateTimeCreated), "pp")}</p>
                </div>
                <div className="flex-1 text-[14px]  pl-4 py-2 flex items-start">
                  <p>{histroyEntry.operation}</p>
                </div>
                <div className="flex-[2] text-[14px]  pl-4 py-2 flex  flex-col space-y-2">
                  <p>{histroyEntry.remark}</p>
                  <p className="text-[0.75rem]">
                    Handled By{" "}
                    <span className="text-blue-400 font-semibold">
                      {histroyEntry.userFullName}
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
const TimerComponentManager = () => {
  const { id } = useParams();
  const client = useQueryClient();
  const ticketData = client.getQueryData(["tickets", `${id}`]);
  const isPaused = ticketData.dateTimeTicketReaderPaused !== null;
  const expired = ticketData.expired;
  const deleted = ticketData.deleted;
  const isResting = ticketData.slaMode === "RESTING";
  console.log({ isPaused, expired, deleted, isResting });
  if (deleted)
    return (
      <DeletedTicketTimer dateTimeModified={ticketData.dateTimeModified} />
    );
  if (isResting)
    return <PausedTicketTimer dateTimeModified={ticketData.dateTimeModified} />;
  if (!expired && !isPaused && !deleted && !isResting)
    return <TimerComponent />;
};

const PausedTicketTimer = ({ dateTimeModified }) => {
  return (
    <div className="w-full lg:w-[80%] m-2 h-20 bg-ncBlue text-white border-neutral-200 border-2 rounded-md flex items-center justify-center flex-col ">
      <p className="font-semibold text-white">Timer Paused</p>
      <p className="text-[0.75rem] pt-2">
        Last Modification :{" "}
        {dateTimeModified !== null ? (
          <span className="font-semibold text-neutral-700">
            {format(new Date(dateTimeModified), "dd / MM / yyyy")}
          </span>
        ) : (
          <span className="font-semibold text-white">none</span>
        )}
      </p>
    </div>
  );
};
const DeletedTicketTimer = ({ dateTimeModified }) => {
  return (
    <div className="w-[80%] m-2 h-20 bg-ncBlue text-white border-neutral-200 border-2 rounded-md flex items-center justify-center flex-col ">
      <p className="font-semibold text-neutral-500">Ticket Deleted</p>
      <p className="text-[0.75rem] pt-2">
        Last Modification :{" "}
        {dateTimeModified !== null ? (
          <span className="font-semibold text-neutral-700">
            {format(new Date(dateTimeModified), "dd / MM / yyyy")}
          </span>
        ) : (
          <span className="font-semibold text-neutral-700">none</span>
        )}
      </p>
    </div>
  );
};

const DeleteAction = () => {
  const { axios } = useAxiosClient();
  const { id } = useParams();
  const nav = useNavigate();

  const deleteMutation = useMutation({
    mutationKey: ["ticket", `${id}`, "delete"],
    mutationFn: () =>
      new Promise((resolve, reject) =>
        axios(`tickets/remove/${id}`, {
          method: "DELETE",
        })
          .then((resp) => resolve(resp.data))
          .catch((err) => reject(err))
      ),
  });

  const tryDelete = () => {
    console.log("deleting");
    sonnerToast.promise(
      new Promise((resolve, reject) =>
        deleteMutation.mutate(
          {},
          {
            onSuccess: (res) => {
              resolve(res);
              setTimeout(() => {
                nav("/CPD/Dashboard");
              }, 1500);
            },
            onError: (err) => reject(err),
          }
        )
      ),
      {
        loading: "Trying to delete ticket...",
        success: "Ticket Deleted Succesfully.",
        error: "Error deleting ticket.",
      }
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={deleteMutation.isPending} asChild>
        <div
          className="flex items-center gap-2 justify-center h-8 group  hover:bg-neutral-50 hover:rounded-md transition hover:font-semibold"
          role="button"
        >
          <Trash className="h-4 w-4 opacity-0 group-hover:opacity-100 transition  shrink rounded-md " />
          <p className="text-xs">Delete Ticket</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            ticket from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              tryDelete();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
