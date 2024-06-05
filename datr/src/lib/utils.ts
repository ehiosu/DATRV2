import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  SectionType,
  ShadingType,
  TabStopPosition,
  TabStopType,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from "docx";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const containsSpecialCharacter = (input: string) => {
  return /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(input);
};

export const removeTags = (htmlString:any) => {
  const regex = /<[^>]+>/g; // Matches all HTML tags
  return htmlString.replace(regex, '') as string;
};
export const createWordReport = (ticketData: any,comments:any) => {
  const commentArray = comments.map((comment:any) => new TableRow({
    children: [
      new TableCell({
        width: {
          size: "100%",
          type: "pct"
        },
        verticalAlign: "center",
        shading: {
          fill: "EEEEEE",
          color: "000000"
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${comment.commentType === "COMMENT" ? 'Comment made by ' : 'Message sent by '} ${comment.authorName} at ${format(new Date(comment.dateTimeCreated), 'dd,mmmm,yyyy p')}`,
                size: '24pt'
              })
            ]
          }),
          new Table({
            width: {
              size: "100%",
              type: "pct"
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: {
                      fill: "FAFAFA",
                      color: "000000"
                    },
                    width: {
                      size: "100%",
                      type: "pct"
                    },
                    verticalAlign: "center",
                    children: [
                      new Paragraph({
                        children:[
                          new TextRun({
                            text: removeTags(comment.content),
                            size: '18pt',
                            bold:true
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  }));
  const document = new Document({
    sections: [
      {
        properties: {
          type: SectionType.EVEN_PAGE,
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            shading: {
              fill: "EEEEEE",
              color: "000000",
            },
            alignment: "center",
            children: [
              new TextRun({
                text: `${ticketData?.complainantName}'s ${ticketData?.complainantType} ticket.`,
                size: "40pt",
              }),
              new TextRun({
                text: `Contact Mail: ${ticketData.complainantEmail}, Contact Number: ${ticketData.complainantPhoneNo}`,
                break: 1,
              }),
            ],
          }),
          new Paragraph("\n"),
          new Paragraph({
            text: "Ticket Content:",
            alignment: "left",
            heading: HeadingLevel.HEADING_2,
           
          }),
          new Paragraph("\n"),
          new Table({
            width: {
              size: "100%",
              type: "pct",
            },
            rows: [
              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t Ticket ID",
                            size:'22pt',
                            
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${ticketData.id}`,
                            size: "22pt",
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),
              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },

                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t Assignee",
                            size: "22pt",
                            
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${ticketData.assigneeName || "None"} `,
                            size: "22pt",
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),
              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },

                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t Complaint Type",
                            size: "22pt",
                           
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${ticketData.complainantType || "None"} `,
                            size: "22pt",
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),
              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },

                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t SLA Type",
                            size: "22pt",
                            
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${ticketData.slaName || "None"} `,
                            size: "22pt",
                            
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),

              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },

                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t Airline",
                            size: "22pt",
                           
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${ticketData.airline || "None"} `,
                            size: "22pt",
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),
              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },

                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t Route",
                            size: "22pt",
                           
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${ticketData.route || "None"} `,
                            size: "22pt",
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),
              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },

                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t Date of Incident ",
                            size: "22pt",
                            
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${ticketData.dateOfIncident || "None"}, ${
                              ticketData.timeOfIncident
                            }`,
                            size: "22pt",
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),
              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },

                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t Ticket Creation Date  ",
                            size: "22pt",
                           
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${
                              format(
                                new Date(ticketData.dateTimeCreated),
                                "dd / MM / yyyy"
                              ) || "None"
                            }`,
                            size: "22pt",
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),
              new TableRow({
                height: {
                  value: "22pt",
                  rule: "atLeast",
                },
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "E5E5E5",
                      color: "000000",
                    },

                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "\t Redress Sought  ",
                            size: "22pt",
                            
                          }),
                        ],
                      }),
                    ],

                    width: {
                      size: `30%`,
                      type: "pct",
                    },
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    shading: {
                      fill: "FAFAFA",
                      color: "000000",
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `\t ${
                              ticketData.redressSought|| "None"
                            }`,
                            size: "22pt",
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: `70%`,
                      type: "pct",
                    },
                  }),
                ],
              }),
            ],
          }),
          new Paragraph("\n"),
          new Table({
            width: {
              size: "100%",
              type: "pct",
            },
            rows:commentArray
          })
          
    ]},
  
    ],
  });

  return document;
};

const barChartColorOptions = [
  "#2CA58D",
  "#0A2342",
  "#FFFDF7",
  "#F46197",
  "#FDECEF",
  "#9D6381",
  "#6610F2",
  "#1A8FE3",
  "#6CD4FF",
  "#8B80F9",
  "#CFBFF7",
  "#5AA9E6",
  "#7FC8F8",
  "#F9F9F9",
  "#FFE45E",
  "#FF6392",
  "#BCF4DE",
  "#EEC6CA",
  "#FFB7C3",
  "#416788",
  "#7389AE",
  "#81D2C7",
  "#B5BAD0",
  "#B5BAD0",
  "#2AFC98",
  "#214F4B",
  "#16C172",
  "#2DE1FC",
  "#F2E3BC",
];
export const getRanHex = () => {
  return barChartColorOptions[
    Math.floor(Math.random() * barChartColorOptions.length)
  ];
};