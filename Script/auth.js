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
        firstName,
        lastName,
        phone,
        email,
        password,
        isAdmin,
      };
  
      localStorage.setItem("user", JSON.stringify(user));
  
      Swal.fire({
        icon: 'success',
        title: 'Registered successfully!',
      }).then(() => {
        window.location.href = "./login.html";
      });
  
      form.reset();
    });
  
    function validateEmail(email) {
      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return re.test(String(email).toLowerCase());
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
          Swal.fire({
            icon: 'warning',
            title: 'No user found',
            text: 'Please register first.',
          });
          return;
        }
  
        if (emailInput === storedUser.email && passwordInput === storedUser.password) {
          Swal.fire({
            icon: 'success',
            title: 'Login successful!',
          }).then(() => {
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "../recipies.html";
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'Incorrect email or password.',
          });
        }
      });
    
  });
  