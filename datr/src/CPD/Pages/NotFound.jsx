import React from "react";
import { useAuth } from "../../api/useAuth";

const NotFound = () => {
  const { user, access } = useAuth();
  return (
    <div className="w-full h-screen relative grid place-items-center">
      <div className="flex flex-col justify-center text-center">
        <p>Page not Found!</p>
      </div>
    </div>
  );
};

export default NotFound;
