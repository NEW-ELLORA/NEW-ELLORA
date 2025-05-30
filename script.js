// This entire block is the content of your script.js file

// Get references to DOM elements
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Check if elements exist before adding event listeners (good practice)
if (loginBtn && registerBtn && loginForm && registerForm) {
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
} else {
    console.warn("One or more form toggle elements were not found. Toggling might not work.");
}


// Simulate user storage using localStorage
// Note: This is a very basic and insecure way to store user data.
// For a real application, use a proper backend and database.
let users = JSON.parse(localStorage.getItem("users")) || {};

// Handle Registration
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");
        const confirmInput = document.getElementById("confirmPassword");

        // Additional check if input elements exist
        if (!emailInput || !passwordInput || !confirmInput) {
            alert("Registration form fields are missing. Please check the HTML.");
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        if (!email || !password || !confirm) {
            alert("Please fill in all registration fields.");
            return;
        }

        if (password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        if (users[email]) {
            alert("Email already registered.");
            return;
        }

        // If all checks pass, registration is "successful" in this simulation
        users[email] = password;
        localStorage.setItem("users", JSON.stringify(users));

        // ***** KEY ADDITION FOR REGISTRATION *****
        localStorage.setItem('loggedInUserEmail', email);
        localStorage.setItem('isUserLoggedIn', 'true'); // Optional general login flag
        // ****************************************

        alert("Account created successfully!");
        console.log("User registered and loggedInUserEmail set:", email); // For debugging

        // Optionally switch to login form or redirect
        // loginBtn.click(); // If you want to switch to login
        window.location.href = "home.html"; // Or redirect directly
    });
} else {
    console.warn("Registration form not found. Registration submission will not work.");
}


// Handle Login
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");

        // Additional check if input elements exist
        if (!emailInput || !passwordInput) {
            alert("Login form fields are missing. Please check the HTML.");
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter both email and password to log in.");
            return;
        }

        if (users[email] && users[email] === password) {
            // Login is "successful" in this simulation

            // ***** KEY ADDITION FOR LOGIN *****
            localStorage.setItem('loggedInUserEmail', email);
            localStorage.setItem('isUserLoggedIn', 'true'); // Optional general login flag
            // **********************************

            alert("Login successful!"); // Added success alert
            console.log("User logged in and loggedInUserEmail set:", email); // For debugging
            window.location.href = "home.html"; // Redirect to welcome page
        } else {
            alert("Invalid Email or Password.");
        }
    });
} else {
    console.warn("Login form not found. Login submission will not work.");
}
