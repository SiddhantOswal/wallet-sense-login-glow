import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyAa7LVyKuGTLWEpJRIx79RN27LIf5yopiA",
authDomain: "nucleus-7b459.firebaseapp.com",
projectId: "nucleus-7b459",
storageBucket: "nucleus-7b459.firebasestorage.app",
messagingSenderId: "534262109063",
appId: "1:534262109063:web:9ec6b2f59c9eeeb83ab922",
measurementId: "G-MCQBGP7VGE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);