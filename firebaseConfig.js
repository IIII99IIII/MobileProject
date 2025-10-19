import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBeHHtol3QdeB2GH4xn0RHCdNbnlmLBa0Q",
  authDomain: "proyectomovil-bbbf1.firebaseapp.com",
  projectId: "proyectomovil-bbbf1",
  storageBucket: "proyectomovil-bbbf1.firebasestorage.app",
  messagingSenderId: "1000981885725",
  appId: "1:1000981885725:web:e6616bbb1ae41a5cbc67f4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);