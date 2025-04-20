document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const firstName = document.getElementById("first-name").value.trim();
      const lastName = document.getElementById("last-name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const isAdmin = document.getElementById("is-admin").checked;
  
      // Validations
      if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
        showToast("All fields are required!", "error");
        return;
      }
  
      if (!validateEmail(email)) {
        showToast("Invalid email format!", "error");
        return;
      }
  
      if (password.length < 6) {
        showToast("Password must be at least 6 characters.", "error");
        return;
      }
  
      if (password !== confirmPassword) {
        showToast("Passwords do not match!", "error");
        return;
      }
  
      const user = {
        firstName,
        lastName,
        phone,
        email,
        password,
        isAdmin,
      };
  
      localStorage.setItem("user", JSON.stringify(user));
  
      showToast("Registered successfully!", "success");
      window.location.href = "../Pages/Authentication/login.html";
  
      form.reset();
    });
  
    function validateEmail(email) {
      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return re.test(String(email).toLowerCase());
    }
  
    function showToast(message, type) {
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.innerText = message;
      document.body.appendChild(toast);
  
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  });


  // Login 
  document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
  
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const emailInput = document.getElementById("login-email").value;
        const passwordInput = document.getElementById("login-password").value;
  
        const storedUser = JSON.parse(localStorage.getItem("user"));
  
        if (!storedUser) {
          alert("No user found. Please register first.");
          return;
        }
  
        if (emailInput === storedUser.email && passwordInput === storedUser.password) {
          alert("Login successful!");
          localStorage.setItem("isLoggedIn", "true");
          window.location.href = "../recipies.html";
        } else {
          alert("Incorrect email or password.");
        }
      });
    
  });
  