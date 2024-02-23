import { createContext, useContext } from "react";

const AxiosClientContext = createContext({
  axios: null,
  updateTokens: null,
  updateUser: null,
});

import React from "react";
import { useAuth } from "./useAuth";
import createAxiosClient from "./axios";

export const AxiosClient = ({ children }) => {
  const { refresh, access, updateTokens, updateUser } = useAuth();
  const getNewToken = () => {
    return fetch("/users/refresh/token", {
      headers: {
        Authorization: `Bearer ${refresh}`,
      },
    });
  };
  const client = createAxiosClient(access, refresh, updateTokens, getNewToken);

  return (
    <AxiosClientContext.Provider
      value={{ axios: client, updateTokens, updateUser }}
    >
      {children}
    </AxiosClientContext.Provider>
  );
};

export const useAxiosClient = () => {
  return useContext(AxiosClientContext);
};
