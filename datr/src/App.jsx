import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminDashboardLogin } from "./Auth/AdminDashboardLogin";
import { CreateAccount } from "./Auth/CreateAccount";
import { Home } from "./Home/Home";
import { CPDLayout } from "./CPD/Layout/CPDLayout";
import { Dashboard } from "./CPD/Pages/Dashboard";
import { AllTickets } from "./CPD/Pages/AllTickets";
import { OpenTickets } from "./CPD/Pages/OpenTickets";
import { ResolvedTickets } from "./CPD/Pages/ResolvedTickets";
import { UnresolvedTickets } from "./CPD/Pages/UnresolvedTickets";
import { UnassignedTickets } from "./CPD/Pages/UnassigneTickets";
import { EscalatedTickets } from "./CPD/Pages/EscalatedTickets";
import { AllMessages } from "./CPD/Pages/AllMessages";
import { ReportsPage } from "./CPD/Pages/Reports";
import { NewTicket } from "./CPD/Pages/NewTicket";
import { DataAndStatisticsHome } from "./CPD/Pages/DataAndStatisticsHome";
import { DASLayout } from "./DAS/Layout/DASLayout";
import { DASDashboard } from "./DAS/Pages/Dashboard";
import { Delays } from "./DAS/Pages/Delays";
import { CancelledFlights } from "./DAS/Pages/Cancelled";
import { Reports } from "./DAS/Pages/Report";
import { CreateEntry } from "./DAS/Pages/CreateEntry";
import { MessaggeComponent } from "./CPD/Pages/Messagge";
import { CPOView } from "./CPD/Pages/CPOView";
import { TicketPage } from "./CPD/Pages/TicketPage";
import { CpdConfigurationLayout } from "./CPD/Layout/CpdConfigurationLayout";
import { GeneralConfigurations } from "./CPD/Pages/GeneralConfigurations";
import { SlaConfiguration } from "./CPD/Pages/SlaConfiguration";
import { NewSla } from "./CPD/Pages/NewSla";
import { EditSLA } from "./CPD/Pages/EditSla";
import { TicketsConfiguration } from "./CPD/Pages/TicketsConfiguration";
import { UserGroupConfiguration } from "./CPD/Pages/UserGroupConfiguration";
import { ConversationConfiguration } from "./CPD/Pages/ConversationConfiguration";
import { GroupView } from "./CPD/Pages/GroupView";
import ViewType from "./CPD/context/viewTypeContext.tsx";
import { AllUserGroups } from "./CPD/Pages/AllUserGroups.jsx";
import ResetPassword from "./CPD/Pages/ResetPassword.tsx";
import ForgotPassword from "./CPD/Pages/ForgotPassword.jsx";
function App() {
  return (
    <>
      <ViewType.Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminDashboardLogin />} />
            <Route path="/Create-Account" element={<CreateAccount />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Reset-Password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<CPDLayout />}>
              <Route path="/CPD/Dashboard" element={<Dashboard />} />
              <Route path="/CPD/Tickets/All" element={<AllTickets />} />
              <Route path="/CPD/Tickets/Open" element={<OpenTickets />} />
              <Route
                path="/CPD/Tickets/Resolved"
                element={<ResolvedTickets />}
              />
              <Route
                path="/CPD/Tickets/Unresolved"
                element={<UnresolvedTickets />}
              />
              <Route path="/CPD/Ticket/:id" element={<TicketPage />} />
              <Route
                path="/CPD/Tickets/Unassigned"
                element={<UnassignedTickets />}
              />
              <Route
                path="/CPD/Tickets/Escalated"
                element={<EscalatedTickets />}
              />
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
              <Route
                element={<CpdConfigurationLayout />}
                path="/CPD/Configuration"
              >
                <Route
                  element={<GeneralConfigurations />}
                  path="/CPD/Configuration/General"
                />
                <Route
                  element={<SlaConfiguration />}
                  path="/CPD/Configuration/Sla"
                />
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
            <Route element={<DASLayout />}>
              <Route
                path="/Das/:Location/Dashboard"
                element={<DASDashboard />}
              />
              <Route path="/Das/:Location/Delays" element={<Delays />} />
              <Route
                path="/Das/:Location/Cancelled"
                element={<CancelledFlights />}
              />
              <Route path="/Das/:Location/Report/:id" element={<Reports />} />
              <Route path="/Das/:Location/New" element={<CreateEntry />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ViewType.Provider>
    </>
  );
}

export default App;
