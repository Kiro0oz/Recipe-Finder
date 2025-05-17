import { register, login } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const first_name = document.getElementById("first-name").value.trim();
      const last_name = document.getElementById("last-name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const isAdmin = document.getElementById("is-admin").checked;
  
      // Validations
      if (!first_name || !last_name || !phone || !email || !password || !confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'All fields are required!',
        });
        return;
      }
  
      if (!validateEmail(email)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid email format!',
        });
        return;
      }
  
      if (password.length < 6) {
        Swal.fire({
          icon: 'error',
          title: 'Password too short',
          text: 'Password must be at least 6 characters.',
        });
        return;
      }
  
      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Passwords do not match!',
        });
        return;
      }
  
      const user = {
        first_name,
        last_name,
        phone,
        email,
        password,
        role: isAdmin ? 'admin' : 'user',
      };

    try {
      const data = await register(user);

      Swal.fire({
        icon: "success",
        title: "Registered successfully!",
        text: data.message || "",
      }).then(() => {
        window.location.href = "./login.html";
      });

      form.reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error.message || "Please try again later.",
      });
    }
  });
  
    function validateEmail(email) {
      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return re.test(String(email).toLowerCase());
    }
  
  });


// Login 
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please enter both email and password.',
      });
      return;
    }

    try {
      const data = await login({ email, password });
      localStorage.setItem("accessToken", data.access);

      Swal.fire({
        icon: 'success',
        title: 'Login successful!',
      }).then(() => {
        window.location.href = "../recipies.html"; 
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: error.message || 'Invalid email or password.',
      });
    }
  });
});
  