// script.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  const passwordInput = document.getElementById("password");
  const strengthMeter = document.getElementById("strength-meter");

  // Password strength checker
  passwordInput.addEventListener("input", function () {
    const password = this.value;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthMeter.className = "strength-meter";
    if (strength < 3) {
      strengthMeter.classList.add("weak");
    } else if (strength < 5) {
      strengthMeter.classList.add("medium");
    } else {
      strengthMeter.classList.add("strong");
    }
  });

  // Form validation
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset errors
    document
      .querySelectorAll(".error")
      .forEach((el) => (el.style.display = "none"));

    let isValid = true;

    // Validate forename
    const forename = document.getElementById("forename").value.trim();
    if (!forename) {
      document.getElementById("forename-error").style.display = "block";
      isValid = false;
    }

    // Validate surname
    const surname = document.getElementById("surname").value.trim();
    if (!surname) {
      document.getElementById("surname-error").style.display = "block";
      isValid = false;
    }

    // Validate email
    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById("email-error").style.display = "block";
      isValid = false;
    }

    // Validate mobile
    const mobile = document.getElementById("mobile").value.trim();
    const mobileRegex = /^\+?[0-9]{10,15}$/;
    if (!mobile || !mobileRegex.test(mobile)) {
      document.getElementById("mobile-error").style.display = "block";
      isValid = false;
    }

    // Validate DOB
    const dob = document.getElementById("dob").value;
    if (!dob) {
      document.getElementById("dob-error").style.display = "block";
      isValid = false;
    }

    // Validate password
    const password = passwordInput.value;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      document.getElementById("password-error").style.display = "block";
      isValid = false;
    }

    // Validate confirm password
    const confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) {
      document.getElementById("confirm-password-error").style.display = "block";
      isValid = false;
    }

    if (isValid) {
      // Here we would normally send the data to the server
      // For this example, we'll simulate the password hashing process
      // In a real application, this should be done server-side!
      hashPassword(password).then((hashedPassword) => {
        const userData = {
          forename: forename,
          surname: surname,
          email: email,
          mobile: mobile,
          dob: dob,
          password: hashedPassword, // Send hashed password to server
        };

        // Simulate sending data to server
        console.log("User data ready for database:", userData);

        // Show success message
        document.getElementById("success-message").style.display = "block";
        form.reset();
        strengthMeter.className = "strength-meter";
      });
    }
  });

  // Password hashing function (using Web Crypto API)
  // In a real application, this should be done server-side!
  async function hashPassword(password) {
    // Convert password string to buffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Hash the password using SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashedPassword;
  }
});
