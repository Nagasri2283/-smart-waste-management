
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  const firebaseConfig = {
  apiKey: "AIzaSyD27JT9UGKKUsZil-phmwuyGZh89lhFfio",
  authDomain: "smartwaste-f4e6d.firebaseapp.com",
  projectId: "smartwaste-f4e6d",
  storageBucket: "smartwaste-f4e6d.firebasestorage.app",
  messagingSenderId: "604696222078",
  appId: "1:604696222078:web:a58b29ba9a735f1e0b3b2f",
  measurementId: "G-KLP06Z6G18"
};


  export const app = initializeApp(firebaseConfig);

 export const auth = getAuth(app);
export const db = getFirestore(app);
