import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


export const firebaseConfig = {
    apiKey: "AIzaSyCGwRCgzBuPlTYOonPFWz6-cj9Gu0qcKkU",
    authDomain: "online-support-system-7737b.firebaseapp.com",
    projectId: "online-support-system-7737b",
    storageBucket: "online-support-system-7737b.appspot.com",
    messagingSenderId: "734365376430",
    appId: "1:734365376430:web:00a718c5399cd869f1f23f",
    databaseURL: "https://online-support-system-7737b.firebaseio.com",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;