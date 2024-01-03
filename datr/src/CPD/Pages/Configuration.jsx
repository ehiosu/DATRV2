import React, { useEffect, useRef, useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { GeneralConfigurations } from "./GeneralConfigurations";
import { SlaConfiguration } from "./SlaConfiguration";
import { UserGroupConfiguration } from "./UserGroupConfiguration";
import { ConversationConfiguration } from "./ConversationConfiguration";
import { TicketsConfiguration } from "./TicketsConfiguration";

export const Configuration = () => {
  const tabRefs = useRef([]);
  const [tabTransform, setTabTransofrm] = useState({
    left: -15,
    width: "70px",
  });
  const handleReposition = (index = 0) => {
    const element = tabRefs.current[index];
    const left = element.offsetLeft - 15;
    const width = element.clientWidth;
    setTabTransofrm((transform) => ({ left, width }));
  };
  useEffect(() => {
    handleReposition();
  }, []);
  return (
    <section className="w-full">
      <SearchPage>
        <Tabs defaultValue="general" className="">
          <TabsList className="space-x-4    relative h-10 ">
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(0)}
              value="general"
              className="inline p-1 text-[0.85rem] font-semibold"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(1)}
              value="sla"
              className="inline p-1 text-[0.85rem] font-semibold"
            >
              SLAs
            </TabsTrigger>
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(2)}
              value="tickets"
              className="inline p-1 text-[0.85rem] font-semibold"
            >
              Tickets
            </TabsTrigger>
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(3)}
              value="groups"
              className="inline p-1 text-[0.85rem] font-semibold"
            >
              User Groups
            </TabsTrigger>
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(4)}
              value="conversations"
              className="inline p-1 text-[0.85rem] font-semibold"
            >
              Conversations
            </TabsTrigger>
            <span
              className="h-1 bg-blue-300/70 w-40 absolute bottom-2 transition-all"
              style={{ width: tabTransform.width, left: tabTransform.left }}
            ></span>
          </TabsList>
          <GeneralConfigurations />
          <SlaConfiguration />
          <TicketsConfiguration />
          <UserGroupConfiguration />
          <ConversationConfiguration />
        </Tabs>
      </SearchPage>
    </section>
  );
};
