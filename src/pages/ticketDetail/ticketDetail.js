import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchDocument from "../../customHooks/useFetchDocument";
import useFetchCollection from "../../customHooks/useFetchCollection";
import spinnerImg from "../../assets/spinner.jpg";
import Card from "../../component/card/Card";
import styles from "./ticketDetail.module.scss";
import AddComment from "../../component/addComment/AddComment";

const TicketDetails = () => {
    const { id } = useParams();
  const [ticketData, setTicketData] = useState(null);
 
   const { document } = useFetchDocument("user_ticket_data", id);
  const { data } = useFetchCollection("comment");
  const filteredComment = data.filter((comment) => comment.ticketID === id);
  
 
 
  useEffect(() => {
    setTicketData(document);
   
     
  }, [document]);
  
   
    
   

 

  return (
    <section>
      <div className={`container`}>
      <h2>Ticket Details</h2>
        <div>
          <Link to="/ticket-list">&larr; Back To Ticket Page</Link>
        </div>
        {ticketData === null ? (
          <img src={spinnerImg} alt="Loading" style={{ width: "50px" }} />
          
        ) : (
           
            <>
                          <Card cardClass={styles.card}>
                        <div className={styles.flexbetween}>
                            <div>
                       <b>Customer Name:</b> {ticketData.customername}<br/>
                       <b>Email:</b>  {ticketData.email}<br/>
                       <b>Phone Number:</b> {ticketData.Phonenumber}<br/>
                         <b>Date Created</b>: {ticketData.createdAt.toDate().toLocaleString()}<br/>
                       </div>
                       <div className={styles.btnarea}>

                        
                        Priority: {ticketData.priority}<br/>
                        
                     
                       </div>

                        </div>
                        <br/>
                        <div className='--flex-between'>
                        <div><b>Description:</b> {ticketData.desc}<br/></div>
                        
            </div>

            <div>
                <br/>
                <br/>
            <hr/>
                <h4 style={{"padding":"10px", "paddingBottom":"0px"}}> Comment</h4>
                <hr/>
                
                <div>
            {filteredComment.length === 0 ? (
                <>
                <br/>
              <p>There are no Message yet.</p>
              </>
            ) : (
              <>
                {filteredComment.map((item, index) => {
                  
                  return (
                    <div key={index} className={styles.review}>
                      <br/>
                      <p>{item.comment}</p>
                      <span>
                        {item.createdAt.toDate().toLocaleString()}
                      </span>
                      <br />
                      <span>
                        <b>by: {item.userName}</b>
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>

            </div>

            

                    </Card>
                    <AddComment id={ticketData.id}/>
            </>
            
        )
        }
        
        </div>
        </section>
  )
}

export default TicketDetails