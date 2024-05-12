import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { DASDashboardPerformanceGraphData } from "../../CPD/data/data";
import { StatCard } from "../../CPD/Components/DashboardStats";
import { useNavigate, useParams } from "react-router";
import { DashboardPerformanceGraph } from "../Components/Graph";
import { AiOutlinePlus } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { ArrowUpFromLine } from "lucide-react";
import Dropzone from "react-dropzone";
import { useAxiosClient } from "../../api/useAxiosClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TbError404 } from "react-icons/tb";

export const DASDashboard = () => {
  const { Location } = useParams();
  const nav = useNavigate();
  return (
    <section className="w-full max-h-screen overflow-y-auto">
      <SearchPage heading={Location}>
        <div
          role="button"
          className="flex justify-center  text-sm items-center rounded-lg shadow-md w-36 hover:w-40 h-10 bg-lightPink text-white gap-2 group transition-all "
          onClick={() => {
            nav(`/DAS/${Location}/New`);
          }}
        >
          Add Entry{" "}
          <AiOutlinePlus className="w-4 h-4 aspect-square bg-white text-lightPink rounded-full shrink group-hover:opacity-100 opacity-0 transition duration-300" />
        </div>
        <FileUploadComponent />
        <div className="flex  gap-4 justify-evenly  my-2  items-center  flex-wrap">
          <StatCard
            title={"Total Scheduled Flights"}
            figure={"258"}
            showTotal={false}
          />
          <StatCard
            title={"Total Delayed Flights"}
            figure={"78"}
            onClick={() => {
              nav(`/DAS/${Location}/Delays`);
            }}
          />
          <StatCard
            title={"Cancelled Flights"}
            figure={"145"}
            onClick={() => {
              nav(`/DAS/${Location}/Cancelled`);
            }}
          />
          <StatCard
            title={"Flights Delayed Under an Hour"}
            figure={"24"}
            showTotal={false}
          />
          <StatCard
            title={"Flight Delayed Over 2 Hours"}
            figure={"3"}
            showTotal={false}
          />
        </div>
        <DashboardPerformanceGraph
          data={DASDashboardPerformanceGraphData}
          categories={["Apr 1st", "Apr 2nd"]}
          title={"Flight Performance"}
        />
      </SearchPage>
    </section>
  );
};

const FileUploadComponent = () => {
  const [selectedAirline, setSelectedAirline] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportType, SetReportType] = useState("");
  const { axios } = useAxiosClient();
  const client = useQueryClient();
  const allAirlinesQuery = useQuery({
    queryKey: ["airlines", "all"],
    queryFn: () =>
      axios("airlines/active", {
        method: "GET",
      })
        .then((resp) => resp.data)
        .catch((err) => err),
  });
  const { Location } = useParams();
  const trySubmitFile = () => {
    const submitFilePromise = new Promise(async (resolve, reject) => {
      const formdata = new FormData();
      formdata.append("file", selectedFile);

      axios(
        `data-entries/upload?terminal=${Location}&airline=${selectedAirline.replace(
          " ",
          "-"
        )}&report-type=${reportType}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          method: "POST",
          data: formdata,
        }
      )
        .then((resp) => {
          return resolve(resp);
        })
        .catch((err) => reject(err));
    });
    toast.promise(submitFilePromise, {
      loading: "Trying to Upload file...",
      success: "File Uploaded Successfully",
      error: (error) => {
        console.log(error.response.data.message);
        return (
          <div className="text-black flex flex-col">
            <p className="flex flex-row items-center font-semibold text-[0.9275rem] gap-2">
              <TbError404 /> Error
            </p>
            <p>{error.response.data.message || error.response.data.detail}</p>
          </div>
        );
      },
    });
  };
  return (
    <Dialog>
      <DialogTrigger className="w-[9.2rem] text-sm py-2 bg-darkBlue rounded-lg text-white flex flex-row group hover:w-40 items-center transition-all duration-300 justify-center px-2">
        Upload Reports{" "}
        <ArrowUpFromLine className="w-4 h-4 shrink group-hover:opacity-100 opacity-0 transition-opacity duration-500 ml-2" />
      </DialogTrigger>
      <DialogContent>
        <div>
          <p className="my-2 pl-3 font-[300]">Airline</p>
          <Select
            defaultValue={selectedAirline}
            onValueChange={setSelectedAirline}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select An Airline" />
            </SelectTrigger>
            {allAirlinesQuery.isSuccess && (
              <SelectContent>
                {allAirlinesQuery.data.map((airline) => (
                  <SelectItem value={airline.airlineName} key={airline.id}>
                    {airline.airlineName}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
        </div>
        <div>
          <p className="my-2 pl-3 font-[300]">Report Type</p>
          <Select defaultValue={reportType} onValueChange={SetReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select A Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ARRIVAL">Arrival</SelectItem>
              <SelectItem value="DEPARTURE">Departure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dropzone
          maxFiles={1}
          onDrop={(acceptedFiles) => {
            console.log(acceptedFiles);
            setSelectedFile(acceptedFiles[0]);
          }}
          accept={{
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
          }}
        >
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
            <section className="w-full   ">
              <div
                {...getRootProps()}
                className={`flex flex-col items-center ${
                  isDragReject && "border-red-500"
                } ${
                  !selectedFile
                    ? isDragReject
                      ? "border-red-500"
                      : isDragActive
                      ? "border-blue-400"
                      : "border-slate-100"
                    : "border-blue-500"
                } border-2 rounded-md h-full p-2 group`}
              >
                <img
                  className="w-32 aspect-square"
                  src="https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715548111/asseco-ncaa/Digital_personal_files-rafiki_doe0zm.png"
                  alt="file"
                />
                <input {...getInputProps()} />
                {!selectedFile && !isDragReject && !isDragActive ? (
                  <p className="text-neutral-500 text-sm">
                    Drop A file Containing data belonging to this terminal
                  </p>
                ) : (
                  <p className="text-blue-600 text-sm  transition-opactiy duration-500">
                    {!selectedFile ? " Drop File!" : selectedFile.name}
                  </p>
                )}
                {selectedFile && (
                  <p className="text-neutral-500 text-sm">
                    Upload Your Selected file.
                  </p>
                )}
                {isDragReject && (
                  <p className="text-red-500 text-[0.92rem] font-[400]">
                    Upload only 1 file at a time!
                  </p>
                )}
                {!selectedFile ? (
                  <button className="mx-auto w-32 rounded-full py-3 my-4 bg-blue-400 text-white font-semibold ">
                    Select file
                  </button>
                ) : (
                  <button
                    disabled={!selectedAirline || !selectedFile || !reportType}
                    className="mx-auto w-32 disabled:bg-slate-400 rounded-full py-3 my-4 bg-blue-400 text-white font-semibold "
                    onClick={(e) => {
                      e.stopPropagation();
                      trySubmitFile();
                    }}
                  >
                    Upload File
                  </button>
                )}
              </div>
            </section>
          )}
        </Dropzone>
      </DialogContent>
    </Dialog>
  );
};
