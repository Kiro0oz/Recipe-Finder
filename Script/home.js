import { getLimitedRecipes, getRecipesTags } from "./api.js"

const searchField = document.querySelector("[data-search-field]")
const searchBtn = document.querySelector("[data-search-btn]")

searchBtn.addEventListener('click', () => {
    if(searchField.value) {
        window.location = `/Recipe-Finder/Pages/recipies.html?q=${searchField.value}`
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

//! ================== For Tap APIs ================== //

const mealTypePanels = {
    breakfast: document.querySelector('#panel-1 '),
    lunch: document.querySelector('#panel-2 '),
    dinner: document.querySelector('#panel-3 '),
    snack: document.querySelector('#panel-4 '),
    teatime: document.querySelector('#panel-5 '),
  };

  function createGridCard(recipe) {
    return `
      <div class="card">
        <figure class="card-media img-holder">
          <img src="${recipe.image}" alt="${recipe.name}" width="200" height="200" loading="lazy" class="img-cover" />
        </figure>
        <div class="card-body">
          <h3 class="title-small">
            <a href="Pages/detail.html?id=${recipe.id}" class="card-link">${recipe.name}</a>
          </h3>
          <div class="meta-wrapper">
            <div class="meta-item">
              <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
              <span class="label-medium">${recipe.cookTimeMinutes} minutes</span>
            </div>
            <button class="icon-btn has-state removed" aria-label="Add to saved recipes">
              <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
              <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  function displayMealTypeRecipes(recipes) {
    const mealTypes = Object.keys(mealTypePanels);
    
    mealTypes.forEach(meal => {
      const panel = mealTypePanels[meal.toLowerCase()];
      if (!panel) return;
  
      let gridList = panel.querySelector(".grid-list");
      if (!gridList) return;
  
      const mealRecipes = recipes.filter(r =>
        r.mealType?.some(m => m.toLowerCase() === meal)
      ).slice(0, 5);

      gridList.innerHTML = "";
      mealRecipes.forEach(recipe => {
        gridList.innerHTML += createGridCard(recipe);
      });
    });
  }


//! ================== For Recipes APIs ================== //

const sliderWrappers = document.querySelectorAll('[data-slider-wrapper]');

function createRecipeCard(recipe) {
  return `
    <li class="slider-item">
      <div class="card">
        <figure class="card-media img-holder">
          <img src="${recipe.image}" alt="${recipe.name}" width="200" height="200" loading="lazy" class="img-cover" />
        </figure>
        <div class="card-body">
          <h3 class="title-small">
            <a href="Pages/detail.html?id=${recipe.id}" class="card-link">${recipe.name}</a>
          </h3>
          <div class="meta-wrapper">
            <div class="meta-item">
              <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
              <span class="label-medium">${recipe.cookTimeMinutes} minutes</span>
            </div>
            <button class="icon-btn has-state ${recipe.is_favorited ? "saved" : "removed"}" aria-label="Add to saved recipes">
              <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
              <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  `;
}

async function setupBookmarkButtons() {
  document.querySelectorAll(".icon-btn").forEach((btn) => {
    const card = btn.closest(".card");
    if (!card) return;

    const linkElement = card.querySelector(".card-link");
    if (!linkElement) return;
    const link = linkElement.getAttribute("href");
    const idMatch = link.match(/id=(\d+)/);
    const id = idMatch ? idMatch[1] : null;

    if (!id) return;

    // Handle click to add/remove from favorites using backend
    btn.addEventListener("click", async () => {
      const accessToken = localStorage.getItem("accessToken"); 

      if (!accessToken) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please log in to save recipes.",
        });
        return;
      }

      const name = card.querySelector(".card-link").textContent;
      const image = card.querySelector("img").src;
      const timeText = card.querySelector(".label-medium").textContent;
      const time = parseInt(timeText);

      const isCurrentlySaved = btn.classList.contains("saved");

      try {
        if (!isCurrentlySaved) {
          await addToFav(id, accessToken);
          btn.classList.remove("removed");
          btn.classList.add("saved");
          Swal.fire({
            icon: "success",
            title: "Recipe Saved",
            text: `"${name}" has been added to your favorites.`,
          });
        } else {
          await removeFromFav(id, accessToken);
          btn.classList.remove("saved");
          btn.classList.add("removed");
          Swal.fire({
            icon: "info",
            title: "Recipe Removed",
            text: `"${name}" has been removed from your favorites.`,
          });
        }
      } catch (error) {
        console.error("Error managing favorite:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong. Please try again.",
        });
      }
    });
  });
}

const categoryCuisinesMap = {
    asian: ["asian", "pakistani", "japanese", "korean", "indian"],
    italian: ["italian"]
  };

  async function displayRecipes() {
    const accessToken = localStorage.getItem("accessToken");
    const response = await getLimitedRecipes(50,accessToken);
    const recipes = response.recipes;
  
    sliderWrappers.forEach(wrapper => {
      const category = wrapper.getAttribute('data-category').toLowerCase();
      const allowedCuisines = categoryCuisinesMap[category] || [];
  
      const filteredRecipes = recipes.filter(recipe =>
        allowedCuisines.includes(recipe.cuisine.toLowerCase())
      );
  
      wrapper.innerHTML = '';
  
      const cardsHTML = filteredRecipes.map(createRecipeCard).join("");
      wrapper.innerHTML += cardsHTML;
  
      wrapper.innerHTML += `
        <li class="slider-item" data-slider-item>
          <a href="Pages/recipies.html?category=${category}" class="load-more-card has-state">
            <span class="label-large">More</span>
          </a>
        </li>
      `;
    });

    displayMealTypeRecipes(recipes);
    setupBookmarkButtons()
}

displayRecipes();


//! ================== Render recipe tags dynamically ================== //

const tagListContainer = document.querySelector(".tag-list");

function createTagBadge(tag) {
  return `
    <a href="/Recipe-Finder/Pages/recipies.html?tag=${encodeURIComponent(tag)}" class="badge-btn body-medium has-state">
      ${tag}
    </a>
  `;
}

getRecipesTags().then(tags => {
  if (tagListContainer) {
    tagListContainer.innerHTML = "";

    tags.forEach(tag => {
      tagListContainer.innerHTML += createTagBadge(tag);
    });
  }
}).catch(error => {
  console.error("Failed to load recipe tags:", error);
});


