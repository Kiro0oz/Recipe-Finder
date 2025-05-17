const $HTML = document.documentElement;
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const getDarkMode = sessionStorage.getItem("theme");

if (getDarkMode) {
  $HTML.dataset.theme = sessionStorage.getItem("theme");
} else {
  $HTML.dataset.theme = isDark ? "dark" : "light";
}

let isPressed = false;

const changeTheme = function () {
  isPressed = !isPressed;
  this.setAttribute("aria-pressed", isPressed);
  const newTheme = $HTML.dataset.theme === "light" ? "dark" : "light";
  $HTML.setAttribute("data-theme", newTheme);
  sessionStorage.setItem("theme", newTheme);
};

window.addEventListener("load", () => {
  const $themeBtn = document.querySelector("[data-theme-btn]");

  $themeBtn.addEventListener("click", changeTheme);
});

// Remove the profile if not authenticated & display logout button
document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const profileButton = document.getElementById("profile-icon");
  const signInLink = document.getElementById("SignIn");
  const logoutLink = document.getElementById("logout");

  if (profileButton) {
    profileButton.style.display = isLoggedIn ? "block" : "none";
  }

  if (!isLoggedIn && window.location.pathname.includes("userProfile.html")) {
    window.location.href = "../Pages/Authentication/login.html";
  }

  if (signInLink) signInLink.style.display = isLoggedIn ? "none" : "";
  if (logoutLink) logoutLink.style.display = isLoggedIn ? "" : "none";

  if (logoutLink) {
    logoutLink.addEventListener("click", function () {
      localStorage.removeItem("accessToken");
      window.location.href = "../Pages/Authentication/login.html";
    });
  }
});
