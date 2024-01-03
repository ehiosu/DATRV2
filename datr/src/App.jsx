import {BrowserRouter,Route,Routes} from  'react-router-dom'
import { AdminDashboardLogin } from './Auth/AdminDashboardLogin'
import {CreateAccount}  from  './Auth/CreateAccount'
import { Home } from './Home/Home'
import { CPDLayout } from './CPD/Layout/CPDLayout'
import { Dashboard } from './CPD/Pages/Dashboard'
import { AllTickets } from './CPD/Pages/AllTickets'
import { OpenTickets } from './CPD/Pages/OpenTickets'
import { ResolvedTickets } from './CPD/Pages/ResolvedTickets'
import { UnresolvedTickets } from './CPD/Pages/UnresolvedTickets'
import { UnassignedTickets } from './CPD/Pages/UnassigneTickets'
import { EscalatedTickets } from './CPD/Pages/EscalatedTickets'
import { AllMessages } from './CPD/Pages/AllMessages'
import { ReportsPage } from './CPD/Pages/Reports'
import { Configuration } from './CPD/Pages/Configuration'
import { NewTicket } from './CPD/Pages/NewTicket'
import { DataAndStatisticsHome } from './CPD/Pages/DataAndStatisticsHome'
import { DASLayout } from './DAS/Layout/DASLayout'
import { DASDashboard } from './DAS/Pages/Dashboard'
import { Delays } from './DAS/Pages/Delays'
import { CancelledFlights } from './DAS/Pages/Cancelled'
import { Reports } from './DAS/Pages/Report'
import { CreateEntry } from './DAS/Pages/CreateEntry'
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AdminDashboardLogin/>} />
          <Route path='/Create-Account' element={<CreateAccount/>}  />
          <Route path='/Home'  element={<Home/>} />
          <Route element={<CPDLayout/>} >
            <Route path='/CPD/Dashboard' element={<Dashboard/> }/>
            <Route path='/CPD/Tickets/All' element={<AllTickets/>}/>
            <Route path='/CPD/Tickets/Open' element={<OpenTickets/>}/>
            <Route path='/CPD/Tickets/Resolved' element={<ResolvedTickets/>}/>
            <Route path='/CPD/Tickets/Unresolved' element={<UnresolvedTickets/>}/>
            <Route path='/CPD/Tickets/Unassigned' element={<UnassignedTickets/>}/>
            <Route path='/CPD/Tickets/Escalated' element={<EscalatedTickets/>}/>
            <Route path='/CPD/Messages' element={<AllMessages/>}/>
            <Route path='/CPD/Reports' element={<ReportsPage/>}/>
            <Route path='/CPD/Configuration' element={<Configuration/>}/>
            <Route path='/CPD/New-Ticket' element={<NewTicket/>}/>
            <Route path='/CPD/DAS' element={<DataAndStatisticsHome/>}/>

            </Route>
          <Route  element={<DASLayout/>}>
            <Route path='/Das/:Location/Dashboard' element={<DASDashboard/>} />
            <Route path='/Das/:Location/Delays' element={<Delays/>} />
            <Route path='/Das/:Location/Cancelled' element={<CancelledFlights/>} />
            <Route path='/Das/:Location/Report/:id' element={<Reports/>} />
            <Route path='/Das/:Location/New' element={<CreateEntry/>} />






          </Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
