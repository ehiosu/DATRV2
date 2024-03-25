import React, { useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { BreadCrumb3 } from "./CPOView";
import { Navigate, redirect, useParams } from "react-router";
import {
  CpoViewTable,
  cpoTableColumnDef,
  cpoViewPlaceholderData,
} from "../Components/DataTable";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { CgClose } from "react-icons/cg";
import { useQuery as useQueryParameter } from "../Sidebar/Hooks/useQuery";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "../../api/useAxiosClient";

export const GroupView = () => {
  // const { group } = useParams();
  const query = useQueryParameter();
  const group = query.get("group");
  const { axios } = useAxiosClient();
  if (!group) return redirect("/CPD/Dashboard");

  const [page, setPage] = useState(1);
  const groupDataQuery = useQuery({
    queryKey: ["groups", group, page - 1],
    queryFn: () =>
      axios(`users/role?value=${group}&page=0&size=10`, {
        method: "GET",
      }).then((resp) => resp.data),
  });
  const updated_group = group.replaceAll("_", " ");
  console.log(updated_group);
  return (
    <section className="w-full">
      <SearchPage heading={"User Groups"}>
        <BreadCrumb3
          data={[
            {
              title: "User Groups",
              index: 0,
              link: `/CPD/Configuration/Groups`,
            },
            {
              title: `${updated_group}`,
              index: 1,
            },
          ]}
        />
        <p className="border-b-4 border-b-blue-400 py-1 px-2 text-[0.875rem] text-blue-400 font-semibold mx-auto">
          Members
        </p>
        <div className="flex justify-between items-center flex-wrap  md:gap-0 gap-2">
          <AlertDialog>
            <AlertDialogTrigger className="w-max px-4 py-[6px] md:py-2 bg-darkBlue rounded-md text-white text-[0.7275rem] md:text-[0.875rem]">
              + Add New Group
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col ">
              <AlertDialogCancel className="w-max ml-auto border-none">
                <CgClose />
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex items-center text-[0.8275rem] text-neutral-600 font-semibold ">
            <p>Show on Page </p>
            <span className="ml-2">
              <span className="text-neutral-600">1</span> --{" "}
              <span className="text-neutral-600">11</span> out of{" "}
              <span className="text-neutral-600">30</span>
            </span>
            <button className="ml-3 text-[0.975rem] hover:text-blue-400">
              {"<"}
            </button>
            <button className="ml-3 hover:text-blue-400 text-[0.975rem]">
              {">"}
            </button>
          </div>
          {/* //TODO:CPOs Table */}
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
          {groupDataQuery.isSuccess && (
            <CpoViewTable
              columns={cpoTableColumnDef}
              data={groupDataQuery.data.ncaaUserResponseDtoList}
            />
          )}
        </div>
      </SearchPage>
    </section>
  );
};
