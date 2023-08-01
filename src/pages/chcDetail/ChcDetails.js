import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchDocument from "../../customHooks/useFetchDocument";
import useFetchCollection from "../../customHooks/useFetchCollection";
import spinnerImg from "../../assets/spinner.jpg";
import Card from "../../component/card/Card";
import styles from "./ChcDetails.module.scss";
import AddComment from "../../component/addComment/AddComment";

const ChcDetails = () => {
    const { id } = useParams();
  const [chcData, setChcData] = useState(null);
 
   const { document } = useFetchDocument("user_ticket_data", id);
  const { data } = useFetchCollection("comment");
  const filteredComment = data.filter((comment) => comment.chcID === id);
  
 
 
  useEffect(() => {
    setChcData(document);
   
     
  }, [document]);
  
   
    
   

 

  return (
    <section>
      <div className={`container`}>
      <h2>Ticket Details</h2>
        <div>
          <Link to="/chc-list">&larr; Back To Ticket Page</Link>
        </div>
        {chcData === null ? (
          <img src={spinnerImg} alt="Loading" style={{ width: "50px" }} />
          
        ) : (
           
            <>
                          <Card cardClass={styles.card}>
                        <div className={styles.flexbetween}>
                            <div>
                       <b>Customer Name:</b> {chcData.customername}<br/>
                       <b>Email:</b>  {chcData.email}<br/>
                       <b>Phone Number:</b> {chcData.phonenumber}<br/>
                         <b>Date Created</b>: {chcData.createdAt.toDate().toLocaleString()}<br/>
                       </div>
                       <div className={styles.btnarea}>

                        
                        Priority: {chcData.priority}<br/>
                        
                     
                       </div>

                        </div>
                        <br/>
                        <div className='--flex-between'>
                        <div><b>Description:</b> {chcData.desc}<br/></div>
                        
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
                    <AddComment id={chcData.id}/>
            </>
            
        )
        }
        
        </div>
        </section>
  )
}

export default ChcDetails