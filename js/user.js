// user.js
// Firebase v10 (modular)

import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

/* ===============================
   SUBMIT COMPLAINT
================================ */
export async function submitComplaint(location, description, imageName = "No image") {
  const user = auth.currentUser;
  if (!user) {
    alert("Login required");
    return;
  }

  await addDoc(collection(db, "reports"), {
    userId: user.uid,
    location,
    description,
    imageName: image ? imageName : "No image",
    status: "Reported",
    timestamp: new Date()
  });

  alert("✅ Complaint submitted");
}

/* ===============================
   LOAD MY COMPLAINTS (LIVE)
================================ */
export function loadMyComplaints() {
  const tableBody = document.getElementById("myComplaints");
  if (!tableBody) return;

  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "reports"),
    where("userId", "==", user.uid),
    orderBy("timestamp", "desc")
  );

  onSnapshot(q, (snapshot) => {
    tableBody.innerHTML = "";

    if (snapshot.empty) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center;">
            No complaints reported yet
          </td>
        </tr>
      `;
      return;
    }

    snapshot.forEach((doc) => {
      const c = doc.data();

      const row = document.createElement("tr");
      row.innerHTML = `
  <td>${c.location}</td>
  <td>${c.description}</td>

  <td class="status-cell">
    <span class="status ${c.status.toLowerCase().replace(" ", "-")}">
      ${c.status}
    </span>
  </td>

  <td>
    <button onclick="updateStatus('${doc.id}', 'In Progress')">
      In Progress
    </button>
    <button onclick="updateStatus('${doc.id}', 'Cleaned')">
      Cleaned
    </button>
  </td>
`;


      tableBody.appendChild(row);
    });
  });
}


/* ===============================
   LOAD NOTIFICATIONS (LIVE)
================================ */
export function loadNotifications() {
  const list = document.getElementById("notificationList");
  if (!list) return;

  onAuthStateChanged(auth, user => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc") // Requires composite index
    );

    onSnapshot(q, snapshot => {
      list.innerHTML = "";
      snapshot.forEach(doc => {
        const n = doc.data();
        const li = document.createElement("li");
        li.textContent = n.message;
        list.appendChild(li);
      });
    }, error => {
      console.error("Error loading notifications:", error);
      if (error.code === "failed-precondition") {
        alert("Firestore index missing for notifications! Check the console link.");
      }
    });
  });
}
import { doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.updateStatus = async (docId, newStatus) => {
  try {
    await updateDoc(doc(db, "reports", docId), {
      status: newStatus
    });
    alert("Status updated to " + newStatus);
  } catch (error) {
    alert("Error updating status: " + error.message);
  }
};
/* ===============================
   LOGOUT
================================ */
export function logout() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}
