// This entire block is the content of your script.js file

document.addEventListener('DOMContentLoaded', () => { // Good practice to wrap in DOMContentLoaded

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
    // We parse it at the beginning, but mostly interact with it within event handlers
    let users = JSON.parse(localStorage.getItem("users")) || {};

    // Handle Registration
    if (registerForm) {
        // Get input elements once, assuming they don't change
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");
        const confirmInput = document.getElementById("confirmPassword");

        // Additional check if input elements exist for safety
        if (!emailInput || !passwordInput || !confirmInput) {
            console.error("Registration form fields are missing from the HTML.");
        } else {
            registerForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const email = emailInput.value.trim(); // Trim whitespace
                const password = passwordInput.value;   // Passwords usually aren't trimmed by default
                const confirm = confirmInput.value;

                if (!email || !password || !confirm) {
                    alert("Please fill in all registration fields.");
                    return;
                }

                if (password !== confirm) {
                    alert("Passwords do not match!");
                    return;
                }

                // Re-fetch 'users' from localStorage in case another tab modified it,
                // or rely on the 'users' variable if single-page context is assumed for this simple demo.
                // For simplicity here, we'll use the 'users' variable loaded at the start of the script.
                // More robust multi-tab/window would re-read from localStorage before write.
                if (users[email]) {
                    alert("Email already registered.");
                    return;
                }

                // If all checks pass, registration is "successful" in this simulation
                users[email] = password; // In a real app, hash the password before storing
                localStorage.setItem("users", JSON.stringify(users));

                // ***** KEY ADDITION FOR REGISTRATION *****
                localStorage.setItem('loggedInUserEmail', email);
                localStorage.setItem('isUserLoggedIn', 'true'); // General login flag
                // ****************************************

                alert("Account created successfully! You are now logged in.");
                console.log("User registered and loggedInUserEmail/isUserLoggedIn set:", email); // For debugging

                window.location.href = "home.html"; // Redirect after successful registration
            });
        }
    } else {
        console.warn("Registration form not found. Registration submission will not work.");
    }

    // Handle Login
    if (loginForm) {
        // Get input elements once
        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");

        if (!emailInput || !passwordInput) {
            console.error("Login form fields are missing from the HTML.");
        } else {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const email = emailInput.value.trim();
                const password = passwordInput.value;

                if (!email || !password) {
                    alert("Please enter both email and password to log in.");
                    return;
                }

                // Re-fetch 'users' for login check to ensure up-to-date
                const currentUsers = JSON.parse(localStorage.getItem("users")) || {};

                if (currentUsers[email] && currentUsers[email] === password) { // In real app, compare hashed passwords
                    // Login is "successful" in this simulation

                    // ***** KEY ADDITION FOR LOGIN *****
                    localStorage.setItem('loggedInUserEmail', email);
                    localStorage.setItem('isUserLoggedIn', 'true'); // General login flag
                    // **********************************

                    alert("Login successful!");
                    console.log("User logged in and loggedInUserEmail/isUserLoggedIn set:", email); // For debugging
                    window.location.href = "home.html"; // Redirect after successful login
                } else {
                    alert("Invalid Email or Password.");
                }
            });
        }
    } else {
        console.warn("Login form not found. Login submission will not work.");
    }

}); // End of DOMContentLoaded
