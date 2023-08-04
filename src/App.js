import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./component/header/Header";
import AddTicket from "./pages/addTicket/AddTicket";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Reset from "./pages/auth/Reset";
import TicketDetails from "./pages/ticketDetail/ticketDetail";
import TicketList from "./pages/ticketList/ticketList";
import Home from "./pages/home/Home";
import NotFound from "./pages/notFound/NotFound";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import AdminPage from "./pages/adminPage/AdminPage";

// Pages


function App() {
 
  return (
   
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Header />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path ="/reset" element={<Reset />} />
       
          
            <Route path="/ticket-list" element={<TicketList />} />
            <Route path="/admin-page" element={<AdminPage />} />
            <Route path="/add-ticket/:id" element={<AddTicket />} />
            <Route path="/ticket-details/:id" element={<TicketDetails />} />
            <Route path="*" element={<NotFound />} />
          
         
          
         


          
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
