import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link} from 'react-router-dom';
import Search from '../../component/search/Search';
import useFetchCollection from '../../customHooks/useFetchCollection';
import { selectIsLoggedIn, selectUserID  } from "../../redux/authSlice";
import styles from "./AdminPage.module.scss";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import Loader from "../../component/loader/Loader";
import Notiflix from "notiflix";
import { FILTER_BY_SEARCH, selectChcData, selectFiltertedChc, SORT_CHC, STORE_CHC } from '../../redux/chcAddSlice';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Card from '../../component/card/Card';
import Pagination from '../../component/pagination/Pagination';
import * as XLSX from 'xlsx';


const AdminPage = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userID=useSelector(selectUserID)
    const { data, isLoading } = useFetchCollection("user_ticket_data");
       const [sort, setSort] = useState("all");
    const [search, setSearch] = useState("");
     const chcData = useSelector(selectChcData);
     const [downloadUrl, setDownloadUrl] = useState('');
   const filteredChc = useSelector(selectFiltertedChc);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [chcPerPage] = useState(5);
    // Get Current Products
    const indexOfLastChc = currentPage * chcPerPage;
    const indexOfFirstChc = indexOfLastChc - chcPerPage;
     const currentChc = filteredChc.slice(
      indexOfFirstChc,
      indexOfLastChc
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
        STORE_CHC({
            chc:data
      })
     
    );
    setDownloadUrl(url) 
  }, [dispatch, data]);
  
  
  useEffect(() => {
    dispatch(SORT_CHC({ data, sort }));
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
        deleteChc(id, imageURL);
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

  const deleteChc = async (id) => {
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
        <p>There are <b>{filteredChc.length}</b> Total Tickets</p>
            <div className="--flex-between">
        <Search value={search} onChange={(e) => setSearch(e.target.value)}/>

      
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


        {filteredChc.length === 0 ? (
          <p>No Ticket found.</p>
        ) :
        (
            <>  {currentChc.map((chc, index) => {
        const timestamp = chc.createdAt;
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const formattedDate = date.toLocaleString();
                
                return (

                    <Card key={chc.id} cardClass={styles.card}>
                        <div className={styles.flexbetween}>
                            <div>
                       <b>Customer Name:</b> {chc.customername}<br/>
                       <b>Email:</b>  {chc.email}<br/>
                       <b>Phone Number:</b> {chc.Phonenumber}<br/>
                       </div>
                       <div className={styles.btnarea}>         
                        Priority: {chc.priority}<br/>
                        <span className={userID==="mcrYtiHdAZeUTx3rrm0eIzVVrYi2"?"":styles.dnone}>
                       <Link to={`/admin-page/${chc.id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                   
                     
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(chc.id)}
                       
                      />
                      </span>
                     
                       </div>

                        </div>
                        <br/>
                        <div className='--flex-between'>
                        <div><b>Date Created</b>: {formattedDate}<br/></div>
                        <div> <Link to={`/chc-details/${chc.id}`}>
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
          chcPerPage={chcPerPage}
          totalChc={filteredChc.length}
        />

<div>
      {downloadUrl && (
        <button type="button" className="--btn --btn-primary">
    <a href={downloadUrl} download="chc-data.xlsx" style={{"color":"#fff"}}>
          
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

export default AdminPage