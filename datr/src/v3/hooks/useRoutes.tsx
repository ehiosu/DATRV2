import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useAxiosClient } from "@/api/useAxiosClient.jsx";
import { AxiosError, AxiosResponse } from "axios";
import { useAuth } from "@/api/useAuth";
import axios from "axios";
export const useRoutes = () => {
  const { access } = useAuth();
  const isExternal = access === "access" || !access;
  const { axios: axiosClient } = useAxiosClient();
  const query = useQuery({
    queryKey: ["routes", "all"],
    queryFn: () =>
      isExternal
        ? axios("http://176.58.117.18:8080/api/routes/active", {
            method: "GET",
          })
            .then((resp: AxiosResponse) => resp.data)
            .catch((err: AxiosError) => {
              throw err;
            })
        : axiosClient("routes/active", {
            method: "GET",
          })
            .then((resp: AxiosResponse) => resp.data)
            .catch((err: AxiosError) => {
              console.log(err);
              throw err;
            }),
  });
  return query;
};
