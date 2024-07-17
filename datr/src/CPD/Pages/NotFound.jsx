import React from "react";
import { useAuth } from "../../api/useAuth";
import notfound from "/not-found.png";
const NotFound = () => {
  const { user, access } = useAuth();
  const home_page = home_;
  return (
    <div className="w-full h-screen relative flex flex-col items-center justify-center">
      <img
        src={notfound}
        alt="Not-found.png"
        className="w-[35%] min-w-[320px] object-contain"
      />
      <div className="flex flex-col justify-center text-center">
        <p>Page not Found!</p>
      </div>
    </div>
  );
};

export default NotFound;
