import React, { useEffect, useState } from "react";
import { useReports } from "../hooks/useReports";
import { useTerminalStore } from "@/store/terminalstore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GenericDataTable,
  arrivalReportsColumnDef,
  departureReportsColumnDef,
} from "@/CPD/Components/DataTable";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/api/useAuth";

export const GeneralReports = () => {
  const { terminal } = useTerminalStore();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 30 | 40 | 200>(200);
  const [maxPages, setMaxPages] = useState<number>(1);
  const query = useReports(terminal, setMaxPages, currentPage, pageSize);
  const [reportData, setReportData] = useState<{
    Arrival: any[];
    Departure: any[];
  }>({
    Arrival: [],
    Departure: [],
  });

  useEffect(() => {
    let data: { Arrival: any[]; Departure: any[] } = {
      Arrival: [],
      Departure: [],
    };
    console.log(query.data);
    if (!query.data) return;
    Object.values(query.data["dataEntryResponses"]).map((datum: any) => {
      if (datum["reportType"] == "ARRIVAL") {
        data.Arrival.push(datum);
      } else {
        data.Departure.push(datum);
      }
    });
    console.log(data);

    setReportData(data);
  }, [query.data]);
  return (
    <section className="w-full px-6 py-2 ">
      <div className="flex items-center w-full justify-between">
        <p className="text-xl font-semibold">Reports</p>
      </div>

      <div className="w-full h-[60vh] overflow-y-auto border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth">
        <p className="text-lg font-semibold text-ncBlue my-3 ml-3">Arrivals</p>

        {
          // Object.values(query.data["dataEntryResponses"])
          query.isLoading ? (
            <Skeleton className="w-full h-[60vh]" />
          ) : (
            query.isSuccess && (
              <GenericDataTable
                DownloadComponent={ReportDownloadComponent}
                tableClassname=""
                headerClassname="rounded-lg"
                filterHeader="Airline"
                downloadExcel={true}
                columns={arrivalReportsColumnDef as any}
                data={reportData.Arrival}
                hasFilter={true}
                showColumnFilter
                filterColumn={"airline"}
              />
            )
          )
        }
      </div>
      <div className="mt-5 flex justify-center space-x-4 items-center">
        <button
          onClick={() => setCurrentPage((state) => state - 1)}
          disabled={currentPage === 1}
          className="w-max px-5 py-1.5 text-sm rounded-lg bg-ncBlue text-white disabled:bg-slate-400"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((state) => state + 1)}
          disabled={currentPage === maxPages}
          className="px-5 w-max py-1.5 rounded-lg bg-ncBlue text-white text-sm disabled:bg-slate-400"
        >
          Next
        </button>
      </div>

      <div className="w-full h-[60vh] overflow-y-auto border-2 border-neutral-300 rounded-lg py-1 mt-6 scroll-smooth ">
        <p className="text-lg font-semibold text-ncBlue my-3 ml-3">
          Departures
        </p>

        {
          // Object.values(query.data["dataEntryResponses"])
          query.isLoading ? (
            <Skeleton className="w-full h-[60vh]" />
          ) : (
            query.isSuccess && (
              <GenericDataTable
                DownloadComponent={DepartureReportDownloadComponent}
                tableClassname=""
                filterHeader="Airline"
                headerClassname="rounded-lg"
                downloadExcel={true}
                columns={departureReportsColumnDef as any}
                data={reportData.Departure}
                hasFilter={true}
                showColumnFilter
                filterColumn={"airline"}
              />
            )
          )
        }
      </div>
      <div className="mt-5 flex justify-center space-x-4 items-center">
        <button
          onClick={() => setCurrentPage((state) => state - 1)}
          disabled={currentPage === 1}
          className="w-max px-5 py-1.5 text-sm rounded-lg bg-ncBlue text-white disabled:bg-slate-400"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((state) => state + 1)}
          disabled={currentPage === maxPages}
          className="px-5 w-max py-1.5 rounded-lg bg-ncBlue text-white text-sm disabled:bg-slate-400"
        >
          Next
        </button>
      </div>
    </section>
  );
};
import ExcelJs from "exceljs";
import { format } from "date-fns";
const ReportDownloadComponent: React.FC<{ data: any[] }> = ({ data }) => {
  const { user } = useAuth();
  const {date}=useTerminalStore()
  const fromDate=format(date?.from? new Date(date?.from )as Date :new Date(),'dd-MM-yyyy')
  const toDate=format(date?.to?new Date(date?.to )as Date:new Date(),'dd-MM-yyyy'||"")
  const tryDownloadReport = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        const workbook = new ExcelJs.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.creator = `${user.email}-${user.firstName}`;
        workbook.views = [
          {
            x: 0,
            y: 0,
            width: 10000,
            height: 20000,
            firstSheet: 0,
            activeTab: 0,
            visibility: "visible",
          },
        ];
        let _filteredData: Record<any, Record<any, any[]>> = {};
        try {
          data.map((datum: any) => {
            const airline = datum.airline.toLowerCase()

            if (_filteredData[airline]) {
              if (!_filteredData[airline][datum.dateOfIncidence]) {
                _filteredData[airline][datum.dateOfIncidence] = [datum];
              } else {
                _filteredData[airline][datum.dateOfIncidence].push(datum);
              }
            } else {
              _filteredData[airline] = {
                [datum.dateOfIncidence]: [datum],
              };
            }
          });
          console.log(_filteredData);
        } catch (err: any) {
          console.log(err.message);
        }
        try {
          console.log(_filteredData)
          Object.keys(_filteredData).map((airline: string) => {
            const sheet = workbook.addWorksheet(airline);
            sheet.columns = [
              {
                header: "Date",
                key: "date",
                width: 20,
                style: {
                  font: {
                    size: 12,
                    bold: true,
                  },
                },
              },
              {
                header: "Ac-Type",
                key: "acType",
                width: 20,
              },
              {
                header: "FLT-No",
                key: "flightNumber",
                width: 20,
              },
              {
                header: "Route",
                key: "route",
                width: 20,
              },
              {
                header: "STA",
                key: "stipulatedTimeArrived",
                width: 20,
              },
              {
                header: "ATA",
                key: "actualTimeArrived",
                width: 20,
              },
              {
                header: "DELAY",
                key: "delayedDifferenceInHour",
                width: 20,
              },
              {
                header: "Report Type",
                key: "reportType",
                width: 20,
              },
              {
                header: "Status",
                key: "remark",
                width: 20,
              },
            ];

            sheet.eachColumnKey((column) => {
              column.eachCell((cell, index) => {
                console.log(cell);
                cell.font = {
                  size: 13,
                  bold: true,
                };
              });
            });
            Object.entries(_filteredData[airline]).map(([key, data]) => {
              sheet.addRow({
                date: key,
                delayedDifferenceInHour:"-"
              });
              data.map((datum) => {
                sheet.addRow({
                  acType: datum["acType"],
                  flightNumber: datum["flightNumber"],
                  route: datum["route"],
                  stipulatedTimeArrived:
                    datum["reportType"] === "ARRIVAL"
                      ? datum["stipulatedTimeArrived"] || "---"
                      : "---",
                  actualTimeArrived:
                    datum["reportType"] === "ARRIVAL"
                      ? datum["actualTimeArrived"] || "---"
                      : "---",
                  delayedDifferenceInHour: datum["delayedDifferenceInHour"]
                    ? `${Math.floor(
                        parseInt(datum["delayedDifferenceInHour"]!) / 3600
                      )} hours : ${
                        (parseInt(datum["delayedDifferenceInHour"]!) % 3600) /
                        60
                      } minutes`
                    : "",
                  reportType: datum["reportType"] || "---",
                  remark: datum["remark"] || "---",
                  stipulatedTimeDeparted:
                    datum["reportType"] === "DEPARTURE"
                      ? datum["stipulatedTimeArrived"] || "---"
                      : "---",
                  actualTimeDeparted:
                    datum["reportType"] === "DEPARTURE"
                      ? datum["actualTimeArrived"] || "---"
                      : "---",
                });
              });
            });
          });

          workbook.eachSheet((sheet) => {
            sheet.getColumn("delayedDifferenceInHour").eachCell((cell) => {
              const value = sheet.getCell(cell?.address).value;
              if (!value) {
                sheet.getCell(cell.address).value =  "#####";
                sheet.getCell(cell?.address).style = {
                  font: {
                    size: 14,
                    bold: true,
                    color: {
                      argb: "c1121f",
                    },
                  },
                };
              }
              if(value=="-"){
                sheet.getCell(cell.address).value=""
              }
            });
            //add "####" to all delay cells that are empty
          });
          workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `punctuality-report-Arrivals-${fromDate}-${toDate}.xlsx`;
            anchor.click();
            window.URL.revokeObjectURL(url);
          });
        } catch (err: any) {
          console.log(err.message);
        }

        resolve(workbook);
      }),
      {
        loading: "loading",
        success: "success!",
        error: "error!",
      }
    );
  };
  return (
    <div className="ml-auto">
      <button
        onClick={() => {
          tryDownloadReport();
        }}
        className="w-32 ml-auto text-white px-2 py-2 flex items-center justify-center bg-ncBlue text-sm rounded-lg "
      >
        Download <Download className="w-4 ml-2 h-4 shrink " />
      </button>
    </div>
  );
};
const DepartureReportDownloadComponent: React.FC<{ data: any[] }> = ({
  data,
}) => {
  const { user } = useAuth();
  const {date}=useTerminalStore()
  const fromDate=format(date?.from? new Date(date?.from) as Date :new Date(),'dd-MM-yyyy')
  const toDate=format(date?.to?new Date(date?.to) as Date:new Date(),'dd-MM-yyyy'||"")
  const tryDownloadReport = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        const workbook = new ExcelJs.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.creator = `${user.email}-${user.firstName}`;
        workbook.views = [
          {
            x: 0,
            y: 0,
            width: 10000,
            height: 20000,
            firstSheet: 0,
            activeTab: 1,
            visibility: "visible",
          },
        ];
        let filteredData: Record<any, Record<any, any[]>> = {};
        try {
          data.map((datum: any) => {
            if (filteredData[datum.airline]) {
              if (!filteredData[datum.airline][datum.dateOfIncidence]) {
                filteredData[datum.airline][datum.dateOfIncidence] = [datum];
              } else {
                filteredData[datum.airline][datum.dateOfIncidence].push(datum);
              }
            } else {
              filteredData[datum.airline] = {
                [datum.dateOfIncidence]: [datum],
              };
            }
          });
          console.log(filteredData);
        } catch (err: any) {
          console.log(err.message);
        }
        try {
          Object.keys(filteredData).map((airline: string) => {
            const sheet = workbook.addWorksheet(airline);
            sheet.columns = [
              {
                header: "Date",
                key: "date",
                width: 20,
                style: {
                  font: {
                    size: 12,
                    bold: true,
                  },
                },
              },
              {
                header: "Ac-Type",
                key: "acType",
                width: 20,
              },
              {
                header: "FLT-No",
                key: "flightNumber",
                width: 20,
              },
              {
                header: "Route",
                key: "route",
                width: 20,
              },
              {
                header: "STD",
                key: "stipulatedTimeArrived",
                width: 20,
              },
              {
                header: "ATD",
                key: "actualTimeArrived",
                width: 20,
              },
              {
                header: "DELAY",
                key: "delayedDifferenceInHour",
                width: 20,
              },
              {
                header: "Report Type",
                key: "reportType",
                width: 20,
              },
              {
                header: "Status",
                key: "remark",
                width: 20,
              },
              {
                header: "Outbound Delay 15mins - 1Hr",
                key: "d1",
                width:35,
                style:{
                 alignment:{
                  horizontal:"center",
                  vertical:"middle",
                  wrapText:true
                 } 
                }
              },
              {
                header: "Outbound Delay 1 - 2Hrs",
                key: "d2",
                width:35,
                style:{
                  alignment:{
                   horizontal:"center",
                   vertical:"middle",
                   wrapText:true
                  } 
                 }
               
              },
              {
                header: "Outbound Delay > 2Hrs",
                key: "d3",
                width:35,
                style:{
                  alignment:{
                   horizontal:"center",
                   vertical:"middle",
                   wrapText:true
                  } 
                 }
               
              },
            ];

            sheet.eachColumnKey((column) => {
              column.eachCell((cell, index) => {
                console.log(cell);
                cell.font = {
                  size: 13,
                  bold: true,
                };
              });
            });
           
            Object.entries(filteredData[airline]).map(([key, data]) => {
              let delayDif2Hours = 0;
              let delayDif15Minutes = 0;
              let delayDifL2Hours = 0;
              //adding a new block 
              sheet.addRow({
                date: key,
                delayedDifferenceInHour:"-"
              });
             
              data.map((datum) => {
                const delayDifferenceHours =
                  parseInt(datum["delayedDifferenceInHour"]!) / 3600;
                let state = null;
                if (delayDifferenceHours > 0.25 && delayDifferenceHours <= 1) {
                  delayDif15Minutes += 1;
                  state=0;
                }
                if (delayDifferenceHours > 1 && delayDifferenceHours <= 2) {
                  delayDifL2Hours += 1;
                  state = 1;
                }
                if (delayDifferenceHours > 2) {
                  delayDif2Hours += 1;
                  state = 2;
                }
                sheet.addRow({
                  acType: datum["acType"],
                  flightNumber: datum["flightNumber"],
                  route: datum["route"],
                  stipulatedTimeArrived:
                    datum["stipulatedTimeArrived"] || "---",
                  actualTimeArrived: datum["actualTimeArrived"] || "---",
                  delayedDifferenceInHour: datum["delayedDifferenceInHour"]
                    ? `${Math.floor(
                        parseInt(datum["delayedDifferenceInHour"]!) / 3600
                      )} hours : ${
                        (parseInt(datum["delayedDifferenceInHour"]!) % 3600) /
                        60
                      } minutes`
                    : "",
                  reportType: datum["reportType"] || "---",
                  remark: datum["remark"] || "---",
                  stipulatedTimeDeparted:
                    datum["reportType"] === "DEPARTURE"
                      ? datum["stipulatedTimeArrived"] || "---"
                      : "---",
                  actualTimeDeparted:
                    datum["reportType"] === "DEPARTURE"
                      ? datum["actualTimeArrived"] || "---"
                      : "---",
                  d1: state == 0 ? "1" : "",
                  d2: state == 1 ? "1" : "",
                  d3: state == 2 ? "1" : "",
                });
              });
              sheet.addRow({
                delayedDifferenceInHour:"-",
                "d1":delayDif15Minutes,
                "d2":delayDifL2Hours,
                "d3":delayDif2Hours
              });
            });
            });

            

          workbook.eachSheet((sheet) => {
            sheet.getColumn("delayedDifferenceInHour").eachCell((cell) => {
              const value = sheet.getCell(cell?.address).value;
              if (!value) {
                sheet.getCell(cell.address).value =  "#####";
                sheet.getCell(cell?.address).style = {
                  font: {
                    size: 14,
                    bold: true,
                    color: {
                      argb: "c1121f",
                    },
                  },
                };
              }
              if(value=="-"){
                sheet.getCell(cell.address).value=""
              }
            });
            //add "####" to all delay cells that are empty
          });
          workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `punctuality-report-departure${fromDate}-${toDate}.xlsx`;
            anchor.click();
            window.URL.revokeObjectURL(url);
          });
        } catch (err: any) {
          console.log(err.message);
        }

        resolve(workbook);
      }),
      {
        loading: "loading",
        success: "success!",
        error: "error!",
      }
    );
  };
  return (
    <div className="ml-auto">
      <button
        onClick={() => {
          tryDownloadReport();
        }}
        className="w-32 ml-auto text-white px-2 py-2 flex items-center justify-center bg-ncBlue text-sm rounded-lg "
      >
        Download <Download className="w-4 ml-2 h-4 shrink " />
      </button>
    </div>
  );
};
