import { useState } from "react";
import { toast as sonnerToast } from "sonner";
import { cn, createWordReport } from "@/lib/utils";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { removeTags } from "@/lib/utils";
import { useAxiosClient } from "../../api/useAxiosClient";

export const useDocumentDownload = () => {
  const { axios } = useAxiosClient();
  const [isDownloading, setIsDownloading] = useState({
    pdf: false,
    doc: false,
  });

  const requestWordDocument = async (id: string) => {
    const ticketDataPromise = new Promise((resolve) =>
      resolve(getTicketData(id))
    );
    const commentsPromise = new Promise((resolve) =>
      resolve(getTicketComments(id))
    );
    let comments: any;
    let ticketData: any;
    let hasPulled = false;
    setIsDownloading((state) => ({ ...state, doc: true }));
    sonnerToast.promise(
      Promise.all([ticketDataPromise, commentsPromise])
        .then((values) => {
          ticketData = values[0];
          comments = values[1];
          console.log(values);
          hasPulled = true;

          const report = createWordReport(values[0], values[1]);
          Packer.toBlob(report).then((blob) => {
            console.log("report complete");
            saveAs(
              blob,
              `${ticketData.complainantName}-${ticketData.id}-${format(
                new Date(ticketData.dateTimeCreated),
                "dd/mmmm/yyyy"
              )}`
            );
          });
          console.log("downloaded report");
          setIsDownloading((state) => ({ ...state, doc: false }));
        })
        .catch((err) => {
          hasPulled = true;
          setIsDownloading((state) => ({ ...state, doc: false }));

          return err;
        }),
      {
        loading: "Trying to Create your document...",
        success: "Document Created Successfully!",
        error: "Error Creating document...",
      }
    );
  };

  const requestPdfDocument = async (id: string) => {
    const ticketDataPromise = new Promise((resolve) =>
      resolve(getTicketData(id))
    );
    const commentsPromise = new Promise((resolve) =>
      resolve(getTicketComments(id))
    );

    let ticketData: any;
    setIsDownloading((state) => ({ ...state, pdf: true }));
    sonnerToast.promise(
      Promise.all([ticketDataPromise, commentsPromise])
        .then((values) => {
          ticketData = values[0];
          const comments: any = values[1];
          let _ticketContent = "";
          const _ticketContentInfo = [
            { key: "id", title: "Ticket ID" },
            { key: "assignerName", title: "Assignee" },
            { key: "complainantType", title: "Complaint Type" },
            { key: "slaName", title: "SLA Type" },
            { key: "airline", title: "Airline" },
            { key: "route", title: "Route" },
            { key: "dateOfIncident", title: "Date Of Incident" },
            {
              key: "dateTimeCreated",
              title: "Ticket Creation Date",
              text: (value: any) =>
                `${format(new Date(value), "dd / MM / yyyy")}`,
            },
            { key: "redress", title: "Redress Sought" },
          ];
          _ticketContentInfo.map(
            (ticketContent) =>
              (_ticketContent += `
    <div class="w-44 flex flex-row items-center h-4 ">
    <div class="w-1/3  flex flex-row bg-neutral-200 items-center justify-start h-full">
        <p class="text-[0.2rem] mb-1 ml-1">${ticketContent.title}</p>
    </div>
    <div class="w-2/3 bg-[#FAFAFA] flex flex-row items-center justify-start h-full">
        <p class="text-[0.2rem]  mb-1 ml-1">${
          ticketContent.text
            ? ticketContent.text(ticketData[ticketContent.key])
            : ticketData[ticketContent.key] || "None"
        }</p>
    </div>
    </div>
    
    `)
          );
          let _messages = "";
          comments.map(
            (comment: any, index: number) =>
              (_messages += `
  <div class="w-48 flex flex-col  ${index !== 0 && ""} justify-center">
  <div class="flex flex-col w-40 ${index === 0 && ""}  my-1 outline'>
    <div class="w-full h-3 p-2 flex-1 bg-neutral-300">
      <p class="text-[0.23rem] px-[0.1rem] font-semibold  h-3 bg-neutral-200 whitespace-nowrap">
        ${
          comment.commentType === "COMMENT"
            ? "Comment sent by:"
            : "Message sent by :"
        }${"  "}<span class="font-bold">${comment.authorName}</span>
      </p>
    </div>
    <div class="w-40 px-[0.2rem]   flex-1">
  <p class="text-[0.2rem] mb-1 font-semibold"> ${removeTags(
    comment.content
  )}</p>

    </div>
    <div>

    </div>    
    
    `)
          );

          const doc = new jsPDF();
          doc.html(
            `<div class="flex flex-col p-2 w-48">
      <div class="flex flex-col h-7  justify-center  items-center  bg-neutral-100 w-full space-x-2 ">
        <p class="text-[0.3rem] tracking-widest ">${
          ticketData.complainantName
        }'s ${" "} ${ticketData.complainantType} ${" "} Ticket </>
        <p class="text-[0.18rem] text-center tracking-widest mt-1 font-thin flex flex-row flex-wrap justify-center items-center "><span>Contact Mail: ${
          ticketData.complainantEmail
        }</span> ${" "} <span>Complainant Phone Number: ${
              ticketData.complainantPhoneNo
            }</span> ${" "}  </>
      </div>
    <p class="my-2 tracking-wider underline-2 text-[0.26rem] font-semibold text-darkBlue">
    Ticket Information:
    </p>
<div class="">
${_ticketContent}
</div>
<p class="my-2 tracking-wider underline-2 text-[0.26rem] font-semibold text-darkBlue w-40 ">
Ticket Messages / Comments:
</p>

${_messages}

    </div>`,
            {
              callback: (_doc) => {
                _doc.save(
                  `${ticketData.complainantName}-${ticketData.id}-${format(
                    new Date(ticketData.dateTimeCreated),
                    "dd/mmmm/yyyy"
                  )}`
                );
                setIsDownloading((state) => ({ ...state, pdf: false }));
              },

              autoPaging: "slice",
              margin: 10,
              width: 170,
            }
          );

          console.log("downloaded report");
        })
        .catch((err) => {
          setIsDownloading((state) => ({ ...state, pdf: false }));

          return err;
        }),
      {
        loading: "Trying to Create your document...",
        success: "Document Created Successfully!",
        error: "Error Creating document...",
      }
    );
  };
  const getTicketData = async (id: string) => {
    const ticketInformation = await axios(`tickets/${id}`, {
      method: "GET",
    }).then((resp: any) => resp.data);
    return ticketInformation;
  };
  const getTicketComments = async (id: string) => {
    const comments = await axios(`comments/ticket-id?value=${id}`).then(
      (resp: any) => resp.data
    );
    return comments;
  };

  return {
    isDownloading,
    requestWordDocument,
    requestPdfDocument,
  };
};
