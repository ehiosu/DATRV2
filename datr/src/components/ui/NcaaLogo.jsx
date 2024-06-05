import React from "react";

export const NcaaLogo = ({
  imageClassName,
  textClassName,
  ContainerClassName,
}) => {
  return (
    <div className={`flex flex-row space-x-1 ${ContainerClassName}`}>
      <img
        src={
          "https://res.cloudinary.com/dpxuxtdbh/image/upload/v1715615431/asseco-ncaa/ncaalogo_hklh3e.png"
        }
        className={imageClassName}
        alt=""
      />
      <div className="flex flex-col space-y-2 flex-wrap">
        <p className={textClassName}>Nigeria Civil Aviation Authority</p>
      </div>
    </div>
  );
};
