import { useEffect, useRef, useState } from "react";
import { SearchPage } from "../../Reusable/SearchPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ReportOverview } from "../Components/ReportOverview";
import { ReportTickets } from "../Components/ReportTickets";
import { ResolutionTime } from "../Components/ResolutionTime";
import { Conversations } from "../Components/Conversations";
import useWindowSize from "../Sidebar/Hooks/useWindowSize";

export const ReportsPage = () => {
  const tabRefs = useRef([]);
  const { screenSize } = useWindowSize();
  const [tabTransform, setTabTransofrm] = useState({
    left: -15,
    width: "70px",
  });
  const handleReposition = (index = 0) => {
    const element = tabRefs.current[index];
    const left = element.offsetLeft - (screenSize == "small" ? 8 : 15);
    const width = element.clientWidth;
    setTabTransofrm((transform) => ({ left, width }));
  };
  useEffect(() => {
    handleReposition();
  }, []);
  return (
    <section className="w-full ">
      <SearchPage heading={"Reports"}>
        <Tabs defaultValue="overview">
          <TabsList className="md:space-x-4 space-x-2 md:px-0     relative h-10 w-full outline">
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(0)}
              value="overview"
              className="inline  p-1 text-[0.8275rem]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(1)}
              value="tickets"
              className="inline p-1 text-[0.8275rem]"
            >
              Tickets
            </TabsTrigger>
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(2)}
              value="rTime"
              className="inline p-1 text-[0.8275rem]"
            >
              Resolution Time
            </TabsTrigger>
            <TabsTrigger
              ref={(el) => tabRefs.current.push(el)}
              onClick={() => handleReposition(3)}
              value="conversations"
              className="inline p-1 text-[0.8275rem]"
            >
              Conversations
            </TabsTrigger>

            <span
              className="h-1 bg-blue-300/70 w-40 absolute bottom-2 transition-all"
              style={{ width: tabTransform.width, left: tabTransform.left }}
            ></span>
          </TabsList>
          <TabsContent value="overview">
            <ReportOverview />
          </TabsContent>
          <TabsContent value="tickets">
            <ReportTickets />
          </TabsContent>

          <TabsContent value="rTime">
            <ResolutionTime />
          </TabsContent>
          <TabsContent value="conversations">
            <Conversations />
          </TabsContent>
        </Tabs>
      </SearchPage>
    </section>
  );
};
