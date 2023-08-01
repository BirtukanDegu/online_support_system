import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { selectUserID, selectUserName } from "../../redux/authSlice";
//import { selectProducts } from "../../redux/slice/productSlice";
import Card from "../card/Card";
import styles from "./AddComment.module.scss";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";

import spinnerImg from "../../assets/spinner.jpg";
import useFetchDocument from "../../customHooks/useFetchDocument";

const AddComment = ({id}) => {
  
  const [comment, setComment] = useState("");
  
  
  const { document } = useFetchDocument("user_ticket_data", id);

  //const products = useSelector(selectProducts);
  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);
  const [chcData, setChcData] = useState(null);
  

  useEffect(() => {
    setChcData(document);
  }, [document]);
  

  const submitReview = (e) => {
    e.preventDefault();

    const today = new Date();
    
    const date = today.toDateString();
    const reviewConfig = {
      userID,
      userName,
      chcID: id,
       comment,
     commentDate: date,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      addDoc(collection(db, "comment"), reviewConfig);
      toast.success("Comment Added successfully");
   
      setComment("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      <div className={styles.review}>
     
        {chcData === null ? (
          <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
        ) : (
          <>
            {/* <p>
              <b>Product name:</b> {chcData.companyname}
            </p> */}
            
          </>
        )}

        <Card cardClass={styles.card}>
        
          <form onSubmit={(e) => submitReview(e)}>
            
            <label>Leave Comment</label>
            <textarea
              value={comment}
              required
              onChange={(e) => setComment(e.target.value)}
              cols="30"
              rows="10"
            ></textarea>
            <button type="submit" className="--btn --btn-primary">
              Comment
            </button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default AddComment;