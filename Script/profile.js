document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user) {
      alert("No user data found. Please log in.");
      window.location.href = "../Pages/Authentication/login.html";
      return;
    }
  
    const username = `${user.firstName}${user.lastName}`;
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");
    const accountTypeField = document.getElementById("account-type");
    const profileName = document.querySelector(".profile-header h1");

 
    if (usernameField) usernameField.value = username;
    if (emailField) emailField.value = user.email;
    if (accountTypeField) accountTypeField.value = user.isAdmin ? "Admin" : "User";
    if (profileName) profileName.textContent = `${user.firstName} ${user.lastName}`;
  });
  