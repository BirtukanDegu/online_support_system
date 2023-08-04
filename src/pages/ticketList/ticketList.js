import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link} from 'react-router-dom';
import Search from '../../component/search/Search';
import useFetchCollection from '../../customHooks/useFetchCollection';
import { selectIsLoggedIn, selectUserID  } from "../../redux/authSlice";
import styles from "./ticketList.module.scss";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import Loader from "../../component/loader/Loader";
import Notiflix from "notiflix";
import { FILTER_BY_SEARCH, selectTicketData, selectFiltertedTicket, SORT_TICKET, STORE_TICKET } from '../../redux/ticketAddSlice';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Card from '../../component/card/Card';
import Pagination from '../../component/pagination/Pagination';
import * as XLSX from 'xlsx';


const TicketList = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userid = useSelector(selectUserID);
    const { data, isLoading } = useFetchCollection("user_ticket_data");
    const [sort, setSort] = useState("all");
    const [search, setSearch] = useState("");
    const ticketData = useSelector(selectTicketData);
    const [downloadUrl, setDownloadUrl] = useState('');
    const filteredTicket = useSelector(selectFiltertedTicket);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketPerPage] = useState(5);
    // Get Current tickets
    const indexOfLastTicket = currentPage * ticketPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketPerPage;
     const currentTicket = filteredTicket.slice(
      indexOfFirstTicket,
      indexOfLastTicket
    );  
  
    const firebaseData =data;
    const worksheet = XLSX.utils.json_to_sheet(firebaseData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ticket Data');
    const wb = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wb], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    //setDownloadUrl(url);
    //console.log(downloadUrl);


  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(
        STORE_TICKET({
            ticket:data
      })
     
    );
    setDownloadUrl(url) 
  }, [dispatch, data]);
  
  
  useEffect(() => {
    dispatch(SORT_TICKET({ data, sort }));
  }, [dispatch, data, sort]); 

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ data, search }));
  }, [dispatch, data, search]);

  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      "Delete Ticket!!!",
      "You are about to delete this Ticket",
      "Delete",
      "Cancel",
      function okCb() {
        deleteTicket(id, imageURL);
      },
      function cancelCb() {
        console.log("Delete Canceled");
      },
      {
        width: "320px",
        borderRadius: "3px",
        titleColor: "orangered",
        okButtonBackground: "orangered",
        cssAnimationStyle: "zoom",
      }
    );
  };

  const deleteTicket = async (id) => {
    try {
      await deleteDoc(doc(db, "user_ticket_data", id));

      
      toast.success("Ticket deleted successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  };

 
   
  if(isLoggedIn)
  {
    return(
        <>
        {isLoading && <Loader />}
        <section>
        <div className="container">
        <h2>Ticket List</h2>
        <p>There are <b>{filteredTicket.length}</b> Total Tickets</p>
            <div className="--flex-between">
        <Search value={search} onChange={(e) => setSearch(e.target.value)}/>

        <div style={{"paddingLeft":"20px"}}>
        <div className={styles.sort}>
          <label>Priority:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          </div>
          </div>
          
        <Link  to="/add-ticket/ADD">
        <button type="button" className="--btn --btn-primary">
            Add Ticket
        </button>
        </Link >
        </div>




        {filteredTicket.length === 0 ? (
          <p>No Ticket found.</p>
        ) :
        (
            <>  {currentTicket.map((ticket, index) => {
        const timestamp = ticket.createdAt;
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const formattedDate = date.toLocaleString();
                
                return (

                    <Card key={ticket.id} cardClass={styles.card}>
                        <div className={styles.flexbetween}>
                            <div>
                       <b>Customer Name:</b> {ticket.customername}<br/>
                       <b>Email:</b>  {ticket.email}<br/>
                       <b>Phone Number:</b> {ticket.Phonenumber}<br/>
                       </div>
                       <div className={styles.btnarea}>         
                        Priority: {ticket.priority}<br/> <br/> <br/> 
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <span>
                       <Link to={`/add-ticket/${ticket.id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp; &nbsp; &nbsp;
                             
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(ticket.id)}
                       
                      />
                      </span>
                     
                       </div>

                        </div>
                        <br/>
                        <div className='--flex-between'>
                        <div><b>Date Created</b>: {formattedDate}<br/></div>
                        <div>
                          <Link to={`/ticket-details/${ticket.id}`}>
                            <button type="button" className="--btn --btn-primary">
                             View Detials
                            </button>
                         </Link>
                        </div>
                        </div>

                    </Card>
                 
                    )
       })
       }
<div className='--flex-between'>
<Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          ticketPerPage={ticketPerPage}
          totalTicket={filteredTicket.length}
        />

<div>
      {downloadUrl && (
        <button type="button" className="--btn --btn-primary">
    <a href={downloadUrl} download="ticket-data.xlsx" style={{"color":"#fff"}}>
          
           Download Ticket XLS</a>
        </button>
        
      )}
    </div>
    </div>

        
    
       </> 
              )}
      
        </div>
        </section>
        </>
    )
  }

  else
  {
    return ( 
        <section>
        <div className={`container ${styles.table}`}>
    <>
            <p>Kindly Login</p>
            <br />
            <div>
              <Link to="/">&larr; Back To Home</Link>
            </div>
          </>
          </div>
          </section>
          
    )
  }
    
    
  
}

export default TicketList