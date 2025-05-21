import {
  getLimitedRecipes,
  searchRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRole,
  addToFav,
  removeFromFav,
  getRecipes
} from "./api.js";

// Accordion
const accordions = document.querySelectorAll("[data-accordion]");
const initAccordions = function (ele) {
  const btn = ele.querySelector("[data-accordion-btn]");
  let isExpanded = false;

  btn.addEventListener("click", function () {
    isExpanded = isExpanded ? false : true;
    this.setAttribute("aria-expanded", isExpanded);
  });
};

for (const accordion of accordions) {
  initAccordions(accordion);
}

// Filter bar toggle
const filterBar = document.querySelector("[data-filter-bar]");
const filterTogglers = document.querySelectorAll("[data-filter-toggler]");
const overlay = document.querySelector("[data-overlay]");

filterTogglers.forEach((toggler) => {
  toggler.addEventListener("click", function () {
    filterBar.classList.toggle("active");
    overlay.classList.toggle("active");
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow =
      bodyOverflow === "hidden" ? "visible" : "hidden";
  });
});

// Filter buttons
const filterSubmit = document.querySelector("[data-filter-submit]");
const filterClear = document.querySelector("[data-filter-clear]");
const filterSearch = filterBar.querySelector("input[type='search']");

filterSubmit.addEventListener("click", async function () {
  const filterCheckBoxes = filterBar.querySelectorAll("input:checked");
  const queries = [];

  let query = "";

  if (filterSearch.value) {
    query = filterSearch.value;
  }

  try {
    const data = await searchRecipe(query);
    const recipes = data.recipes || [];

    recipeList.innerHTML = "";

    if (recipes.length === 0) {
      recipeList.innerHTML = '<p class="no-results">No recipes found.</p>';
    } else {
      recipes.forEach((recipe) => {
        const card = createRecipeCard(recipe);
        recipeList.appendChild(card);
      });
    }

    filterBar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "visible";
  } catch (error) {
    console.error("Failed to search and display recipes:", error);
  }
});

filterSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    filterSubmit.click();
  }
});

filterClear.addEventListener("click", function () {
  const filterCheckBoxes = filterBar.querySelectorAll("input:checked");

  filterCheckBoxes?.forEach((ele) => (ele.checked = false));
  filterSearch.value &&= "";
});

const filterBtn = document.querySelector("[data-filter-btn]");

window.addEventListener("scroll", (e) => {
  filterBtn.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
});

const recipeList = document.querySelector("[data-grid-list]");

function createRecipeCard(recipe, isLoggedIn, isAdmin) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <figure class="card-media img-holder">
      <img
        src="${recipe.image}"
        alt="${recipe.name}"
        width="200"
        height="200"
        loading="lazy"
        class="img-cover"
      />
    </figure>

    <div class="card-body">
      <h3 class="title-small">
        <a href="./detail.html?id=${recipe.id}" class="card-link">${recipe.name}</a>
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

    ${
      isLoggedIn && isAdmin
        ? `
    <div class="admin-actions-container">
      <div class="admin-actions">
        <span class="material-symbols-outlined">edit</span>
      </div>
      <div class="admin-actions">
        <span class="material-symbols-outlined">delete</span>
      </div>
    </div>` 
        : ""
    }
  `;

  if (isLoggedIn && isAdmin) {
    const adminActions = card.querySelectorAll(".admin-actions");

    const editBtn = adminActions[0]?.querySelector(".material-symbols-outlined");
    const deleteBtn = adminActions[1]?.querySelector(".material-symbols-outlined");

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        openEditDialog(recipe);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        openDeleteConfirm(recipe.id, card);
      });
    }
  }

  return card;
}

// Fav button
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

async function loadRecipes() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await getLimitedRecipes(50,accessToken);
    // const response = await getRecipes();
    console.log(response.recipes)
    const recipes = response.recipes;

    const isLoggedIn = !!accessToken;

    let isAdmin = false;
    if (isLoggedIn) {
      try {
        const roleData = await getRole(accessToken);
        isAdmin = roleData.role === 'admin';
      } catch (error) {
        console.error("Failed to fetch role:", error);
      }
    }

    recipeList.innerHTML = "";

    for (const recipe of recipes) {
      const card = createRecipeCard(recipe, isLoggedIn, isAdmin);
      recipeList.appendChild(card);
    }

    setupBookmarkButtons();
  } catch (error) {
    console.error("Error loading recipes:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  loadRecipes();

  const addRecipeBtn = document.getElementById("Add-recipe");
    const accessToken = localStorage.getItem("accessToken");
    const isLoggedIn = !!accessToken;

    let isAdmin = false;
    if (isLoggedIn) {
      try {
        const roleData = await getRole(accessToken);
        isAdmin = roleData.role === 'admin';
      } catch (error) {
        console.error("Failed to fetch role:", error);
      }
    }

  if (!isLoggedIn || !isAdmin) {
    addRecipeBtn.style.display = "none";
  }
});

// Get Result depend on Tag or Query
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tag = urlParams.get("tag");
  const query = urlParams.get("q");

  if (tag || query) {
    const searchTerm = tag || query;
    try {
      const data = await searchRecipe(searchTerm);
      const recipes = data.recipes || [];

      recipeList.innerHTML = "";

      if (recipes.length === 0) {
        recipeList.innerHTML = `<p class="no-results">No recipes found for "${searchTerm}".</p>`;
      } else {
        recipes.forEach((recipe) => {
          const card = createRecipeCard(recipe);
          recipeList.appendChild(card);
        });
      }
      setupBookmarkButtons();
    } catch (error) {
      console.error("Error loading searched/tagged recipes:", error);
    }
  } else {
    loadRecipes();
  }
});

// Add/update/delete recipe for admin
const addRecipeForm = document.querySelector(".Add-recipe-form");
const dialog = document.getElementById("recipeDialog");

addRecipeForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const prepTime = parseInt(document.getElementById("prepTime").value);
  const cookTime = parseInt(document.getElementById("cookTime").value);
  const calories = parseInt(document.getElementById("calories").value);
  const servings = parseInt(document.getElementById("servings").value);
  const cuisine = document.getElementById("cuisine").value;

  const mealType = document.getElementById("tags").value
    .split(",")
    .map((tag) => tag.trim());

  const ingredients = document.getElementById("ingredients").value
    .split(",")
    .map((ing) => ing.trim());

  const instructions = document.getElementById("instructions").value
    .split("\n")
    .map((step) => step.trim());

  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];
  const imageURL = imageFile
    ? URL.createObjectURL(imageFile)
    : "https://via.placeholder.com/200";

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || 1; // fallback if not found
  const accessToken = localStorage.getItem("accessToken");
  const newRecipe = {
    name,
    prepTimeMinutes: prepTime,
    cookTimeMinutes: cookTime,
    caloriesPerServing: calories,
    servings,
    cuisine,
    mealType,
    ingredients,
    instructions,
    image: imageURL,
    user: 5,
    tag_ids: [18], 
    rating: 4.5, 
  };

  try {
    console.log(newRecipe)
    const added = await addRecipe(newRecipe, accessToken);
    const card = createRecipeCard(added);
    recipeList.prepend(card);

    dialog.close();
    addRecipeForm.reset();
  } catch (error) {
    console.error("Failed to add recipe:", error);
  }
});

let currentEditingId = null;
let cardToDelete = null;

document.getElementById("edit-recipe-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = currentEditingId;
  const name = document.getElementById("edit-name").value;
  const prepTimeMinutes = parseInt(document.getElementById("edit-prep-time").value);
  const cookTimeMinutes = parseInt(document.getElementById("edit-cook-time").value);
  const servings = parseInt(document.getElementById("edit-servings").value);
  const cuisine = document.getElementById("edit-cuisine").value;
  const caloriesPerServing = parseInt(document.getElementById("edit-calories").value);
  const ingredients = document.getElementById("edit-ingredients").value
    .split(",")
    .map((item) => item.trim());
  const instructions = document.getElementById("edit-instructions").value
    .split("\n")
    .map((step) => step.trim());
  const mealType = document.getElementById("edit-mealType").value
    .split(",")
    .map((type) => type.trim());

  const imageInput = document.getElementById("edit-image");
  const imageFile = imageInput.files[0];
  const imageURL = imageFile ? URL.createObjectURL(imageFile) : null;
  const accessToken = localStorage.getItem("accessToken");
  const updatedRecipe = {
    name,
    prepTimeMinutes,
    cookTimeMinutes,
    servings,
    cuisine,
    caloriesPerServing,
    ingredients,
    instructions,
    mealType,
  };

  if (imageURL) updatedRecipe.image = imageURL;

  try {
    const updated = await updateRecipe(id, updatedRecipe,accessToken);
    await loadRecipes();
    document.getElementById("editRecipeDialog").close();
  } catch (err) {
    console.error("Error updating recipe:", err);
  }
});

function openEditDialog(recipe) {
  currentEditingId = recipe.id;

  document.getElementById("edit-id").value = recipe.id;
  document.getElementById("edit-name").value = recipe.name;
  document.getElementById("edit-prep-time").value = recipe.prepTimeMinutes || 0;
  document.getElementById("edit-cook-time").value = recipe.cookTimeMinutes || 0;
  document.getElementById("edit-servings").value = recipe.servings || 1;
  document.getElementById("edit-cuisine").value = recipe.cuisine || '';
  document.getElementById("edit-calories").value = recipe.caloriesPerServing || 0;
  document.getElementById("edit-mealType").value = recipe.mealType?.join(", ") || '';
  document.getElementById("edit-ingredients").value = recipe.ingredients?.join(", ") || '';
  document.getElementById("edit-instructions").value = recipe.instructions?.join("\n") || '';

  document.getElementById("editRecipeDialog").showModal();
}

function openDeleteConfirm(id, cardElement) {
  cardToDelete = { id, cardElement };
  document.getElementById("deleteConfirmDialog").showModal();
}

document
  .getElementById("delete-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    if (cardToDelete) {
      try {
        await deleteRecipe(cardToDelete.id);
        cardToDelete.cardElement.remove();
        cardToDelete = null;
      } catch (err) {
        console.error("Error deleting recipe:", err);
      }
    }

    document.getElementById("deleteConfirmDialog").close();
  });
