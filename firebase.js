import {initializeApp} from "firebase/App"
import {getStorage} from "firebase/storage"
import {getfirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyDqNN5Z1qccizgvThgM8VIsiKL4xCyvUxM",
  authDomain: "fotosapp-dc4ce.firebaseapp.com",
  projectId: "fotosapp-dc4ce",
  storageBucket: "fotosapp-dc4ce.appspot.com",
  messagingSenderId: "1000336031390",
  appId: "1:1000336031390:web:1d29ea56b2f9179ab5c58f"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const fire = getfirestore(app);