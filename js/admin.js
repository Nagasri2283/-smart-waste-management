import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ===== AUTH CHECK ===== */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin-login.html";
  }
});

/* ===== LOAD COMPLAINTS ===== */
async function loadComplaints() {
  const table = document.getElementById("complaintsTable");
  if (!table) return;

  table.innerHTML = "";

  const snapshot = await getDocs(collection(db, "complaints"));
  snapshot.forEach((docSnap) => {
    const c = docSnap.data();

    table.innerHTML += `
      <tr>
        <td>${c.location}</td>
        <td>${c.description}</td>
        <td>${c.status}</td>
        <td>
          <select onchange="updateStatus('${docSnap.id}', this.value)">
            <option ${c.status==="Pending"?"selected":""}>Pending</option>
            <option ${c.status==="In Progress"?"selected":""}>In Progress</option>
            <option ${c.status==="Completed"?"selected":""}>Completed</option>
          </select>
        </td>
      </tr>
    `;
  });
}
loadComplaints();

/* ===== UPDATE STATUS ===== */
window.updateStatus = async (id, status) => {
  await updateDoc(doc(db, "complaints", id), { status });

  await addDoc(collection(db, "notifications"), {
    message: `Complaint updated to ${status}`,
    createdAt: new Date()
  });

  alert("Status updated");
};

/* ===== LOAD NOTIFICATIONS ===== */
async function loadNotifications() {
  const list = document.getElementById("adminNotifications");
  if (!list) return;

  list.innerHTML = "";
  const snapshot = await getDocs(collection(db, "notifications"));
  snapshot.forEach(doc => {
    list.innerHTML += `<li>${doc.data().message}</li>`;
  });
}
loadNotifications();

/* ===== LOGOUT ===== */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
};
