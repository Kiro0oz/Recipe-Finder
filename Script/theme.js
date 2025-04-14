const $HTML = document.documentElement;
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const getDarkMode = sessionStorage.getItem("theme")

if(getDarkMode) {
    $HTML.dataset.theme = sessionStorage.getItem("theme")
} else {
    $HTML.dataset.theme = isDark ? "dark" : "light";
} 

let isPressed = false;

const changeTheme = function() {
    isPressed = !isPressed;
    this.setAttribute("aria-pressed", isPressed);
    const newTheme = ($HTML.dataset.theme === "light") ? "dark" : "light";
    $HTML.setAttribute("data-theme", newTheme);
    sessionStorage.setItem("theme", newTheme);
}

window.addEventListener("load", () => {
    const $themeBtn = document.querySelector("[data-theme-btn]");

    $themeBtn.addEventListener("click", changeTheme)
})