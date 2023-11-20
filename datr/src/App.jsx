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



            </Route>
          


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
