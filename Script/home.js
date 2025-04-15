

const searchField = document.querySelector("[data-search-field]")
const searchBtn = document.querySelector("[data-search-btn]")

searchBtn.addEventListener('click', () => {
    if(searchField.value) {
        window.location = `/Pages/recipies.html?q=${searchField.value}`
    }
})

// Press enter feature
searchField.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
})

// Tap navigation
const tabBtns = document.querySelectorAll("[data-tab-btn]")
const tabPanels = document.querySelectorAll("[data-tab-panel]")

if (tabBtns.length > 0 && tabPanels.length > 0) {
    let [lastActiveTabPanel] = tabPanels;
    let [lastActiveTabBtn] = tabBtns;

    window.addEventOnElements = (elements, eventType, callback) => {
        for (const element of elements) {
            element.addEventListener(eventType, callback);
        }
    };

    addEventOnElements(tabBtns, 'click', function () {
        lastActiveTabPanel.setAttribute("hidden", "");
        lastActiveTabBtn.setAttribute("aria-selected", false);
        lastActiveTabBtn.setAttribute("tabindex", -1);

        const currTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
        currTabPanel.removeAttribute("hidden");
        this.setAttribute("aria-selected", true);
        this.setAttribute("tabindex", 0);

        lastActiveTabPanel = currTabPanel;
        lastActiveTabBtn = this;
    });
}

