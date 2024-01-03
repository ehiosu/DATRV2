import React from "react";

export const Sidebar = () => {
  return (
    <>
      <MidSizedSidebar />
      <SmallSideBar />
    </>
  );
};

const MidSizedSidebar = () => {
  return <aside className="md:block hidden"></aside>;
};
const SmallSideBar = () => {
  return <aside className=""></aside>;
};
