const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginBtn.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  loginBtn.classList.add("active");
  registerBtn.classList.remove("active");
});

registerBtn.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  registerBtn.classList.add("active");
  loginBtn.classList.remove("active");
});

// Simulate storage using localStorage
let users = JSON.parse(localStorage.getItem("users")) || {};

// Handle Registration
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  if (users[email]) {
    alert("Email already registered.");
    return;
  }

  users[email] = password;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully!");

  // Switch to login form
  loginBtn.click();
});

// Handle Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (users[email] && users[email] === password) {
    window.location.href = "home.html"; // Redirect to welcome page
  } else {
    alert("Invalid Gmail or Password.");
  }
});
