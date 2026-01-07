/* ===============================
   FIREBASE AUTH STATE CHECK
================================ */
firebase.auth().onAuthStateChanged(user => {
  if (!user && !location.pathname.includes("login") && !location.pathname.includes("register")) {
    window.location.href = "login.html";
  }
});

/* ===============================
   USER REGISTER
================================ */
function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;

      return firebase.firestore().collection("users").doc(uid).set({
        name: name,
        email: email,
        role: "USER",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("Registration successful");
      window.location.href = "login.html";
    })
    .catch(error => alert(error.message));
}

/* ===============================
   USER LOGIN
================================ */
function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;

      firebase.firestore().collection("users").doc(uid).get()
        .then(doc => {
          if (doc.exists && doc.data().role === "USER") {
            window.location.href = "home.html";
          } else {
            alert("Not a user account");
            firebase.auth().signOut();
          }
        });
    })
    .catch(error => alert(error.message));
}

/* ===============================
   REPORT COMPLAINT
================================ */
function submitComplaint() {
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;
  const user = firebase.auth().currentUser;

  if (!user) return alert("Login required");

  firebase.firestore().collection("complaints").add({
    userId: user.uid,
    location: location,
    description: description,
    status: "Pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Complaint submitted");
    document.getElementById("location").value = "";
    document.getElementById("description").value = "";
  });
}

/* ===============================
   LOAD USER COMPLAINTS
================================ */
export function loadMyComplaints() {
  const user = firebase.auth().currentUser;
  const table = document.getElementById("myComplaints");

  if (!user || !table) return;

  table.innerHTML = "";

  firebase.firestore().collection("complaints")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const c = doc.data();
        table.innerHTML += `
          <tr>
            <td>${c.location}</td>
            <td>${c.description}</td>
            <td>${c.status}</td>
          </tr>
        `;
      });
    });
}

/* ===============================
   LOAD USER NOTIFICATIONS
================================ */
export function loadNotifications() {
  const user = firebase.auth().currentUser;
  const list = document.getElementById("notificationList");

  if (!user || !list) return;

  list.innerHTML = "";

  firebase.firestore().collection("notifications")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const n = doc.data();
        list.innerHTML += `<li>${n.message}</li>`;
      });
    });
}

/* ===============================
   LOGOUT
================================ */
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
}
export function submitComplaint() { }
export function loginUser() { }
export function registerUser() { }
export function logout() { }