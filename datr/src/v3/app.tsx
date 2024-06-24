import React, { ReactNode } from 'react'
import { BrowserRouter,Navigate,Route,Routes } from 'react-router-dom'
import {Landing} from "@/Landing"
import {AdminDashboardLogin} from "@/Auth/AdminDashboardLogin.jsx"
import { Dashboard } from './CPD/Pages/Dashboard'
import { CPDLayout } from './CPD/Components/CPDLayout'
import NotFound from "@/CPD/Pages/NotFound.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/api/useAuth'
import { home_pages } from './data'
import { DasLayout } from './DAS/Components/Daslayout'
import {Dashboard as DASDashboard} from "@/v3/DAS/Dashboard"
import { Delays } from './DAS/Delays'
import { CancelledFlights } from './DAS/CancelledFlights'
import { OnTimeFlights } from './DAS/OnTimeFlights'
import { CreateEntry } from '@/DAS/Pages/CreateEntry'
import { GeneralReports } from './DAS/GeneralReports'
import { Tickets } from './CPD/Pages/Tickets'
import ResetPassword from '@/CPD/Pages/ResetPassword'
import ForgotPassword from "@/CPD/Pages/ForgotPassword.jsx";
import { AccountSettings } from '@/CPD/Pages/AccountSettings'
import { Verify } from '@/CPD/Pages/Verify'
import { SlaEdit } from '@/CPD/Pages/SlaEdit'
import { TicketPage } from "@/CPD/Pages/TicketPage.jsx";

import { FligthDisruption } from './CPD/Pages/FligthDisruption'
import { FDR } from '@/CPD/Pages/FDR'
import { NewTicket } from "@/CPD/Pages/NewTicket.jsx";
import { DelayReports } from './DAS/DelayReports'
import { CancelledReports } from './DAS/CancelledReports'
import { OnTimeReports } from './DAS/OnTimeReports'
import { CpdConfigurationLayout } from "@/CPD/Layout/CpdConfigurationLayout.jsx";
import { GeneralConfigurations } from "@/CPD/Pages/GeneralConfigurations";
import { AccountRequests } from '@/CPD/Pages/AccountRequests'
import { SlaConfiguration } from "@/CPD/Pages/SlaConfiguration";
// import { NewSla } from "@/CPD/Pages/NewSla.tsx";
// import { EditSLA } from "@/CPD/Pages/EditSla.tsx";
import { TicketsConfiguration } from "@/CPD/Pages/TicketsConfiguration.jsx";
import { UserGroupConfiguration } from "@/CPD/Pages/UserGroupConfiguration";

import { GroupView } from "@/CPD/Pages/GroupView";
import { CPOView } from "@/CPD/Pages/CPOView";
import { Rating } from './Rating'
import { AllMessages } from './Pages/Allmessages.tsx'
import { CreateBaseAccount } from './Auth/Signup.tsx'
import { TerminalConfiguration } from './CPD/Pages/TerminalConfiguration.tsx'
import { RouteConfiguration } from './CPD/Pages/RouteConfiguration.tsx'
import { Login } from './Auth/Login.tsx'
import { AirlineConfiguration } from './CPD/Pages/AirlineConfiguration.tsx'
const queryClient = new QueryClient();
export const app = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='*' element={<NotFound/>}/>
        <Route path='/Rating' element={<Rating/>}/>
        <Route path='/Create-Account' element={<CreateBaseAccount/>}/>
        <Route path='/Auth' element={<Login/>}/>
   
              <Route path="/Reset-Password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/Account-Settings" element={<AccountSettings />} />
              <Route path="/Verify" element={<Verify />} />
       <Route element={<CPDLayout/>}>
       <Route path='*' element={<NotFound/>}/>

       <Route path='/CPD/Dashboard' element={<ProtectedRoute roles={["DGO","SHIFT_SUPERVISOR","TERMINAL_SUPERVISOR","ADMIN"]}>
        <Dashboard/>
       </ProtectedRoute>}/>
       <Route path='/CPD/Tickets' element={<ProtectedRoute roles={["CPO","SHIFT_SUPERVISOR","TERMINAL_SUPERVISOR","ADMIN","AIRLINE","DGO"]}>
        <Tickets/>
       </ProtectedRoute>}/>
       <Route path='/CPD/Configuration/Sla/edit' element={<ProtectedRoute roles={["ADMIN","FOU","TERMINAL_SUPERVISOR"]}>
        <SlaEdit/>
       </ProtectedRoute>}/>
       <Route path='/CPD/Ticket/:id' element={<ProtectedRoute roles={["CPO","SHIFT_SUPERVISOR","TERMINAL_SUPERVISOR","ADMIN","AIRLINE","DGO"]}>
        <TicketPage/>
       </ProtectedRoute>}/>
     
       <Route path='/CPD/FDR' element={<ProtectedRoute roles={["ADMIN","AIRLINE",]}>
        <FligthDisruption/>
       </ProtectedRoute>}/>
       <Route path='/CPD/FDR/New' element={<ProtectedRoute roles={["ADMIN","AIRLINE",]}>
        <FDR/>
       </ProtectedRoute>}/>
       <Route path='/CPD/New-Ticket' element={<ProtectedRoute roles={["ADMIN","CPO","SHIFT_HEAD","TERMINAL_HEAD"]}>
        <NewTicket/>
       </ProtectedRoute>}/>
       <Route path="/CPD/Ticket/:id" element={<ProtectedRoute roles={["*"]}>
                    <TicketPage />
                   </ProtectedRoute>} />
          <Route path="/CPD/Messages" element={<ProtectedRoute roles={["*"]}>
            <AllMessages />
          </ProtectedRoute>} />

       <Route
                  element={<ProtectedRoute roles={["ADMIN"]}>
                    <CpdConfigurationLayout />
                  </ProtectedRoute>}
                  path="/CPD/Configuration"
                >
                  <Route
                    path="/CPD/Configuration/Accounts"
                    element={<ProtectedRoute roles={["ADMIN"]}>
                    <AccountRequests />
                  </ProtectedRoute>}
                  />
                    {/* <Route
                    element={<GeneralConfigurations />}
                    path="/CPD/Configuration/General"
                  />  */}
                   <Route
                    element={<ProtectedRoute roles={["ADMIN"]}>
                      <SlaConfiguration />
                    </ProtectedRoute>}
                    path="/CPD/Configuration/Sla"
                  />
                   
                  <Route
                    element={<ProtectedRoute roles={["ADMIN"]}>
                      <TicketsConfiguration />
                    </ProtectedRoute>}
                    path="/CPD/Configuration/Tickets"
                  />
                  <Route
                    element={<ProtectedRoute roles={["ADMIN"]}>
                      <UserGroupConfiguration />
                    </ProtectedRoute>}
                    path="/CPD/Configuration/Groups"
                  />
                    <Route path="/CPD/Configuration/user_groups/" element={<ProtectedRoute roles={["ADMIN"]}>
                      <GroupView />
                    </ProtectedRoute>} />
                    <Route path="/CPD/Configuration/User/:agent" element={<ProtectedRoute roles={["ADMIN"]}>
                      <CPOView/>
                    </ProtectedRoute>} />
                    <Route path="/CPD/Configuration/Terminals" element={<ProtectedRoute roles={["ADMIN"]}>
                      <TerminalConfiguration/>
                    </ProtectedRoute>} />
                    <Route path="/CPD/Configuration/Routes" element={<ProtectedRoute roles={["ADMIN"]}>
                      <RouteConfiguration/>
                    </ProtectedRoute>} />
                    <Route path="/CPD/Configuration/Airlines" element={<ProtectedRoute roles={["ADMIN"]}>
                      <AirlineConfiguration/>
                    </ProtectedRoute>} />
                  {/*
                  <Route
                    element={<NewSla />}
                    path="/CPD/Configuration/Sla/New"
                  />
                  
                  
                  <Route
                    element={<ConversationConfiguration />}
                    path="/CPD/Configuration/Conversations"
                  />
                   */}
                  <Route
                    element={<ProtectedRoute roles={["ADMIN"]}>
                      <SlaEdit />
                    </ProtectedRoute>}
                    path="/CPD/Configuration/Sla/Edit/:section"
                  /> 
                </Route>
       </Route>



       <Route element={<DasLayout/>}>
       <Route path='*' element={<NotFound/>}/>

       <Route path='/DAS/Dashboard' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <DASDashboard/>
       </ProtectedRoute>}/>
       <Route path='/DAS/Delays' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <Delays/>
       </ProtectedRoute>}/>
       <Route path='/DAS/Delays/Reports/:id' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <DelayReports/>
       </ProtectedRoute>}/>
       <Route path='/DAS/Cancelled/Reports/:id' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <CancelledReports/>
       </ProtectedRoute>}/>
       <Route path='/DAS/Cancelled' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <CancelledFlights/>
       </ProtectedRoute>}/>
       <Route path='/DAS/OnTime' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <OnTimeFlights/>
       </ProtectedRoute>}/>
       <Route path='/DAS/OnTime/Reports/:id' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <OnTimeReports/>
       </ProtectedRoute>}/>
       <Route path='/DAS/New' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <CreateEntry/>
       </ProtectedRoute>}/>
       <Route path='/DAS/Reports' element={<ProtectedRoute roles={["DGO","ADMIN","DATA_STATISTIC"]}>
        <GeneralReports/>
       </ProtectedRoute>}/>
       </Route>
    
      
    </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  )
}
type ProtectedRouteProps = {
  roles: string[];
  children:ReactNode 
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const { user } = useAuth();
  const user_role = user.roles[user.roles.length - 1];

  if (!roles.includes(user_role) && roles[0] !== "*") {
    return <Navigate to={home_pages[user_role as keyof typeof home_pages]} />; 
  }

  return <>
  {children}</>;
};