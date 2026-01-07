import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== USER LOGIN ===== */
window.loginUser = async () => {
  const email = userEmail.value;
  const password = userPassword.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "home.html";
  } catch (err) {
    alert(err.message);
  }
};

/* ===== ADMIN LOGIN ===== */
window.loginAdmin = async () => {
  const email = adminEmail.value;
  const password = adminPassword.value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const adminDoc = await getDoc(doc(db, "admins", cred.user.uid));
    if (!adminDoc.exists()) {
      alert("Access denied ❌ Not an admin");
      return;
    }

    window.location.href = "admin/admin-dashboard.html";

  } catch (err) {
    alert(err.message);
  }
};
