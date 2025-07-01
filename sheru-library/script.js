// Firebase CDN Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAA3IdGJks9HVJgP3p-VhiEicakH4IDKgE",
  authDomain: "sheru-library.firebaseapp.com",
  projectId: "sheru-library",
  storageBucket: "sheru-library.firebasestorage.app",
  messagingSenderId: "630081281885",
  appId: "1:630081281885:web:6fae71e4ae27e4a39612b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Book List (Sample)
const books = [
  { title: "Eloquent JavaScript", image: "https://via.placeholder.com/150", file: "#" },
  { title: "You Don't Know JS", image: "https://via.placeholder.com/150", file: "#" },
  { title: "Clean Code", image: "https://via.placeholder.com/150", file: "#" },
  { title: "Sheru's Guide to Reading", image: "https://via.placeholder.com/150", file: "#" }
];

// Global functions
window.searchBooks = function(term) {
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(term.toLowerCase())
  );
  renderBooks(filtered);
};

// Check auth state on load
onAuthStateChanged(auth, (user) => {
  if (user) {
    showHome();
  } else {
    showLogin();
  }
});

// Show login form
function showLogin() {
  document.getElementById('app').innerHTML = `
    <form class="auth-form" id="loginForm">
      <h2>Login</h2>
      <input type="email" placeholder="Email" required id="loginEmail" />
      <input type="password" placeholder="Password" required id="loginPassword" />
      <button type="submit">Login</button>
      <p style="text-align:center; margin-top:10px;">
        Don't have an account? <a href="#" id="gotoSignUp">Sign Up</a>
      </p>
    </form>
  `;

  document.getElementById("loginForm").addEventListener("submit", login);
  document.getElementById("gotoSignUp").addEventListener("click", (e) => {
    e.preventDefault();
    showSignUp();
  });
}

// Show sign-up form
function showSignUp() {
  document.getElementById('app').innerHTML = `
    <form class="auth-form" id="signupForm">
      <h2>Sign Up</h2>
      <input type="text" placeholder="Name" required id="signupName" />
      <input type="email" placeholder="Email" required id="signupEmail" />
      <input type="password" placeholder="Password" required id="signupPassword" />
      <input type="password" placeholder="Confirm Password" required id="signupConfirm" />
      <button type="submit">Sign Up</button>
      <p style="text-align:center; margin-top:10px;">
        Already have an account? <a href="#" id="gotoLogin">Login</a>
      </p>
    </form>
  `;

  document.getElementById("signupForm").addEventListener("submit", signup);
  document.getElementById("gotoLogin").addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });
}

// Signup handler
function signup(event) {
  event.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Signup successful!");
      showHome();
    })
    .catch((err) => alert(err.message));
}

// Login handler
function login(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      showHome();
    })
    .catch((err) => alert(err.message));
}

// Logout handler
function logout() {
  signOut(auth).then(() => {
    showLogin();
  });
}

// Show Home page
function showHome() {
  document.getElementById('app').innerHTML = `
    <header>Sheru Library</header>
    <nav>
      <a href="#">Home</a>
      <a href="#">Categories</a>
      <a href="#">My Library</a>
      <a href="#" id="logoutBtn">Logout</a>
    </nav>
    <div class="search-bar">
      <input type="text" placeholder="Search eBooks..." oninput="searchBooks(this.value)" />
      <button type="button">Search</button>
    </div>
    <div class="grid" id="bookGrid"></div>
  `;

  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });

  renderBooks(books);
}

// Render books
function renderBooks(bookList) {
  const grid = document.getElementById("bookGrid");
  if (grid) {
    grid.innerHTML = bookList.map(book => `
      <div class="book">
        <img src="${book.image}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <button onclick="window.location.href='${book.file}'">Download</button>
      </div>
    `).join('');
  }
}
