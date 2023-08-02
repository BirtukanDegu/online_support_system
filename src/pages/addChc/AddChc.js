import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import Card from "../../component/card/Card";
import Loader from "../../component/loader/Loader";
import styles from "./AddChc.module.scss";
import { selectUserID } from "../../redux/authSlice";
import useFetchCollection from "../../customHooks/useFetchCollection";



const initialState = {
  customername: "",
  email: "",
  Phonenumber: "",
  priority:"",
  desc: "",
  // createdby: "",
};

const  AddChc =  () => {
    const userid=useSelector(selectUserID)
  const { id } = useParams();
   //const chcData =  useSelector(selectChcData);
   
   const { data } = useFetchCollection("user_ticket_data");
  
  //const chcData = data;
  const chcEdit = data.find((item) => item.id === id);
  
  
 
    const [chc, setChc] = useState({}); 
  
 useEffect(() => {
   
        const newState =  detectForm(id, { ...initialState }, chcEdit);
                setChc(newState)
        
      
 }, [ chcEdit,id])
 


  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function detectForm(id, f1, f2) {
    if (id === "ADD") {
      return f1;
    }
    return f2;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChc({ ...chc, [name]: value });
    
  };

  

  const addChc = (e) => {
    e.preventDefault();
    // console.log(product);
    setIsLoading(true);

    try {
      const docRef = addDoc(collection(db, "user_ticket_data"), {
        customername: chc.customername,
        email: chc.email,
        Phonenumber: chc.Phonenumber,
        desc: chc.desc,
        priority:chc.priority,
        createdby:userid,
        createdAt: Timestamp.now().toDate(),
      });
      
      setChc({ ...initialState });

      toast.success("Ticket Added successfully.");
      navigate("/chc-list");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const editChc = (e) => {
    e.preventDefault();
    setIsLoading(true);

   
    try {
      setDoc(doc(db, "user_ticket_data", id), {
        customername: chc.customername,
        email: chc.email,
        Phonenumber: chc.Phonenumber,
        desc: chc.desc,
        priority:chc.priority,
        createdby:chc.userid,
        createdAt: chc.createdAt,
        editedAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      toast.success("Ticket Edited Successfully");
      navigate("/chc-list");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  console.log(chc)
  return (
    <section>
        <div className="container">
        <div>
          <Link to="/chc-list">&larr; Back To Ticket Page</Link>
        </div>

      {isLoading && <Loader />}
      {chc?
    (
        <div className={styles.product}>
        <h2>{detectForm(id, "Add Ticket", "Edit Ticket")}</h2>
        <Card cardClass={styles.card}>
          <form onSubmit={detectForm(id, addChc, editChc)}>
            <label>Customer Name:</label>
            <input
              type="text"
              placeholder="Customer Name"
              required
              name="customername"
              value={chc.customername}
              onChange={(e) => handleInputChange(e)}
            />

            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={chc.email}
              onChange={(e) => handleInputChange(e)}
            />

            <label>Phone Number:</label>
            <input
              type="number"
              placeholder="Phone Number"
              required
              name="Phonenumber"
              value={chc.Phonenumber}
              onChange={(e) => handleInputChange(e)}
            />



<label>Priority:</label>
            <select
              required
              name="priority"
              value={chc.priority}
              onChange={(e) => handleInputChange(e)}
            >
              <option value="" disabled>
                -- choose priority --
              </option>
              
                  <option  value="high">
                    High
                   
                  </option>
                  <option  value="normal">
                   Normal
                   
                  </option>
                  <option  value="low">
                  Low
                   
                  </option>
      
         
            </select>
            {chc.priority==="high"?<p>Kindly Note High Priority Ticket Will be Resolved First Come First Serve Basis </p>:null}
           
           

            <label>Problem Description</label>
            <textarea
              name="desc"
              required
              value={chc.desc}
              onChange={(e) => handleInputChange(e)}
              cols="30"
              rows="10"
            ></textarea>

            <button className="--btn --btn-primary">
            {detectForm(id, "Save Ticket", "Edit Ticket")}
            </button>
          </form>
        </Card>
      </div>
    ): <p>loading...</p>
    }
      
    </div>
    </section>
  );
};

export default AddChc;