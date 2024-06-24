import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { BreadCrumb3 } from "./CPOView";
import { Navigate, redirect, useNavigate, useParams } from "react-router";
import {
  AirlineTableColumnDef,
  CpoViewTable,
  GenericDataTable,
  cpoTableColumnDef,
  cpoViewPlaceholderData,
} from "../Components/DataTable";

import { CgClose } from "react-icons/cg";
import { useQuery as useQueryParameter } from "../Sidebar/Hooks/useQuery";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

export const GroupView = () => {
  // const { group } = useParams();
  const query = useQueryParameter();
  const group = query.get("group");
  const { axios } = useAxiosClient();
  const nav = useNavigate();
  if (!group) return redirect("/CPD/Dashboard");

  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    totalElements: 0,
  });
  const groupDataQuery = useQuery({
    queryKey: ["groups", group, page - 1],
    queryFn: () =>
      axios(
        group === "AIRLINE"
          ? "users/role/non-pageable?value=AIRLINE"
          : `users/role?value=${group}&page=${page - 1}&size=10`,
        {
          method: "GET",
        }
      ).then((resp) => {
        if (group !== "AIRLINE") {
          console.log(resp);
          setPaginationInfo({
            totalPages: resp.data.totalPages,
            totalElements: resp.data.totalElements,
          });
          return resp.data;
        } else {
          console.log("else");
          const result = {
            ncaaUserResponseDtoList: resp.data.sort((a, b) => {
              if (a.airline < b.airline) {
                return -1;
              } else if (a.airline > b.airline) {
                return 1;
              }
              return 0;
            }),
          };
          console.log(result);
          return result;
        }
      }),
  });
  const updated_group = group.replaceAll("_", " ");
  console.log(updated_group);
  return (
    <section className="w-full space-y-2">
      <p className="text-xl font-semibold text-ncBlue mt-2 items-center">
        Group : {updated_group}
      </p>
      <div
        onClick={() => {
          nav(-1);
        }}
        className="w-7 h-7 rounded-md bg-ncBlue flex items-center justify-center text-white mt-2"
        role="button"
      >
        <ArrowLeft className="w-4 h-4 shrink" />
      </div>
      <p className="border-b-4 border-b-blue-400 py-1 px-2 text-[0.875rem] text-blue-400 font-semibold mx-auto w-max">
        Members
      </p>
      <div className="flex justify-between items-center flex-wrap  md:gap-0 gap-2">
        <div className="flex items-center text-[0.8275rem] text-neutral-600 font-semibold ">
          <p>Show on Page </p>
          <span className="ml-2">
            <span className="text-neutral-600">{(page - 1) * 10 + 1}</span> --{" "}
            <span className="text-neutral-600">
              {page === paginationInfo.totalPages
                ? paginationInfo.totalElements
                : (page - 1) * 10 + 10}
            </span>{" "}
            out of{" "}
            <span className="text-neutral-600">
              {paginationInfo.totalElements}
            </span>
          </span>
          <button
            disabled={page === 1}
            className="ml-3 text-[0.975rem] hover:text-blue-400 disabled:cursor-not-allowed disabled:text-neutral-500"
            onClick={() => {
              setPage((currentPage) => currentPage - 1);
            }}
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              setPage((state) => state + 1);
            }}
            disabled={page === paginationInfo.totalPages}
            className="ml-3 hover:text-blue-400 text-[0.975rem] disabled:cursor-not-allowed disabled:text-neutral-500"
          >
            {">"}
          </button>
        </div>
        {/* //TODO:CPOs Table */}
      </div>

      {groupDataQuery.isSuccess ? (
        <div className="h-[50vh] overflow-auto border-t-4 border-t-ncBlue bg-white  border-2 border-neutral-300 rounded-lg py-1 mt-4 scroll-smooth w-full">
          <GenericDataTable
            filterColumn={group === "AIRLINE" ? "airline" : "firstName"}
            hasFilter
            filterHeader={group === "AIRLINE" ? "Airline Name" : "First Name"}
            columns={
              group === "AIRLINE" ? AirlineTableColumnDef : cpoTableColumnDef
            }
            data={groupDataQuery.data.ncaaUserResponseDtoList}
          />
        </div>
      ) : (
        <Skeleton className="w-full h-[50vh]" />
      )}
    </section>
  );
};
