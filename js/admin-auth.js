import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  setDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== REGISTER ADMIN ===== */
window.registerAdmin = async () => {
  const name = adminName.value;
  const email = adminEmail.value;
  const password = adminPassword.value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "admins", cred.user.uid), {
      name,
      email,
      role: "admin",
      createdAt: new Date()
    });

    alert("Admin registered successfully");
    window.location.href = "admin-login.html";

  } catch (err) {
    alert(err.message);
  }
};

/* ===== LOGIN ADMIN ===== */
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

    window.location.href = "admin-dashboard.html";

  } catch (err) {
    alert(err.message);
  }
};
