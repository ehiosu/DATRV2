import React from "react";
import { Route, Routes } from "react-router-dom";
import { CPDLayout } from "./src/CPD/Layout/CPDLayout";
import { Dashboard } from "./src/CPD/Pages/Dashboard";
import { AllTickets } from "./src/CPD/Pages/AllTickets";
import { OpenTickets } from "./src/CPD/Pages/OpenTickets";
import { ResolvedTickets } from "./src/CPD/Pages/ResolvedTickets";
import { UnresolvedTickets } from "./src/CPD/Pages/UnresolvedTickets";
import { TicketPage } from "./src/CPD/Pages/TicketPage";
import { UnassignedTickets } from "./src/CPD/Pages/UnassigneTickets";
import { EscalatedTickets } from "./src/CPD/Pages/EscalatedTickets";
import { AllMessages } from "./src/CPD/Pages/AllMessages";
import { MessaggeComponent } from "./src/CPD/Pages/Messagge";
import { CPOView } from "./src/CPD/Pages/CPOView";
import { ReportsPage } from "./src/CPD/Pages/Reports";
import { GroupView } from "./src/CPD/Pages/GroupView";
import { AllUserGroups } from "./src/CPD/Pages/AllUserGroups";
import { CpdConfigurationLayout } from "./src/CPD/Layout/CpdConfigurationLayout";
import { GeneralConfigurations } from "./src/CPD/Pages/GeneralConfigurations";
import { SlaConfiguration } from "./src/CPD/Pages/SlaConfiguration";
import { NewSla } from "./src/CPD/Pages/NewSla";
import { TicketsConfiguration } from "./src/CPD/Pages/TicketsConfiguration";
import { UserGroupConfiguration } from "./src/CPD/Pages/UserGroupConfiguration";
import { ConversationConfiguration } from "./src/CPD/Pages/ConversationConfiguration";
import { EditSLA } from "./src/CPD/Pages/EditSla";
import { NewTicket } from "./src/CPD/Pages/NewTicket";
import { DataAndStatisticsHome } from "./src/CPD/Pages/DataAndStatisticsHome";
import { AxiosClient } from "./src/api/useAxiosClient";

export const CpdRoutes = () => {
  return (
    <Routes>
      <Route path="/CPD" element={<CPDLayout />}>
        <Route path="/CPD/Dashboard" element={<Dashboard />} />
        <Route path="/CPD/Tickets/All" element={<AllTickets />} />
        <Route path="/CPD/Tickets/Open" element={<OpenTickets />} />
        <Route path="/CPD/Tickets/Resolved" element={<ResolvedTickets />} />
        <Route path="/CPD/Tickets/Unresolved" element={<UnresolvedTickets />} />
        <Route path="/CPD/Ticket/:id" element={<TicketPage />} />
        <Route path="/CPD/Tickets/Unassigned" element={<UnassignedTickets />} />
        <Route path="/CPD/Tickets/Escalated" element={<EscalatedTickets />} />
        <Route path="/CPD/Messages" element={<AllMessages />} />
        <Route
          path="/CPD/Messages/:section/:id"
          element={<MessaggeComponent />}
        />
        <Route path="/CPD/Tickets/CPO/:agent" element={<CPOView />} />

        <Route path="/CPD/Reports" element={<ReportsPage />} />
        {/* <Route path="/CPD/Configuration" element={<Configuration />} /> */}
        <Route path="/CPD/user_groups/" element={<GroupView />} />

        <Route path="/CPD/Reports" element={<ReportsPage />} />
        {/* <Route path="/CPD/Configuration" element={<Configuration />} /> */}
        <Route path="/CPD/all_groups" element={<AllUserGroups />} />
        <Route element={<CpdConfigurationLayout />} path="/CPD/Configuration">
          <Route
            element={<GeneralConfigurations />}
            path="/CPD/Configuration/General"
          />
          <Route element={<SlaConfiguration />} path="/CPD/Configuration/Sla" />
          <Route element={<NewSla />} path="/CPD/Configuration/Sla/New" />
          <Route
            element={<TicketsConfiguration />}
            path="/CPD/Configuration/Tickets"
          />
          <Route
            element={<UserGroupConfiguration />}
            path="/CPD/Configuration/Groups"
          />
          <Route
            element={<ConversationConfiguration />}
            path="/CPD/Configuration/Conversations"
          />
          <Route
            element={<EditSLA />}
            path="/CPD/Configuration/Sla/Edit/:section"
          />
        </Route>
        <Route path="/CPD/New-Ticket" element={<NewTicket />} />
        <Route path="/CPD/DAS" element={<DataAndStatisticsHome />} />
      </Route>
    </Routes>
  );
};
