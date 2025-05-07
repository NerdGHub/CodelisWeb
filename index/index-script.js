// index-script.js
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
      // Prepare data to send to the server
      const userData = {
        forename: forename,
        surname: surname,
        email: email,
        mobile: mobile,
        dob: dob,
        password: password, // Send plain password - server will hash it
      };

      // Send data to server using fetch API
      fetch("../api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || "Registration failed");
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          // Show success message
          document.getElementById("success-message").style.display = "block";
          form.reset();
          strengthMeter.className = "strength-meter";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Registration failed: " + error.message);
        });
    }
  });
});
