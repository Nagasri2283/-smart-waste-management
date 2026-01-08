import { auth, db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ===============================
   AUTH CHECK
================================ */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin-login.html";
    return;
  }
  loadComplaints();
  loadNotifications();
});

/* ===============================
   LOAD COMPLAINTS (ADMIN)
================================ */
function loadComplaints() {
  const table = document.getElementById("complaintsTable");
  if (!table) return;

  const totalEl = document.getElementById("totalComplaints");
  const pendingEl = document.getElementById("pendingCount");
  const completedEl = document.getElementById("completedCount");

  onSnapshot(collection(db, "reports"), (snapshot) => {
    table.innerHTML = "";

    let total = 0;
    let pending = 0;
    let completed = 0;

    snapshot.forEach((docSnap) => {
      const c = docSnap.data();
      total++;

      if (c.status === "Reported" || c.status === "In Progress") {
        pending++;
      }

      if (c.status === "Cleaned") {
        completed++;
      }

      table.innerHTML += `
        <tr>
          <td>${c.location}</td>
          <td>${c.description}</td>
          <td>${c.status}</td>
          <td>
            <select onchange="updateStatus('${docSnap.id}', this.value, '${c.userId}')">
              <option value="Reported" ${c.status === "Reported" ? "selected" : ""}>Reported</option>
              <option value="In Progress" ${c.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option value="Cleaned" ${c.status === "Cleaned" ? "selected" : ""}>Cleaned</option>
            </select>
          </td>
        </tr>
      `;
    });

    // 🔢 UPDATE DASHBOARD CARDS
    totalEl.textContent = total;
    pendingEl.textContent = pending;
    completedEl.textContent = completed;
  });
}


/* ===============================
   UPDATE STATUS + NOTIFY USER
================================ */
window.updateStatus = async (id, status, userId) => {
  try {
    await updateDoc(doc(db, "reports", id), { status });

    await addDoc(collection(db, "notifications"), {
      userId,
      message: `Your complaint status updated to "${status}"`,
      timestamp: new Date()
    });

  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
};

/* ===============================
   ADMIN NOTIFICATIONS
================================ */
function loadNotifications() {
  const list = document.getElementById("adminNotifications");
  if (!list) return;

  onSnapshot(collection(db, "notifications"), (snapshot) => {
    list.innerHTML = "";
    snapshot.forEach((docSnap) => {
      list.innerHTML += `<li>${docSnap.data().message}</li>`;
    });
  });
}

/* ===============================
   LOGOUT
================================ */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
};
