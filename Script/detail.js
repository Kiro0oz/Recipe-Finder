import { getSingleRecipe } from "./api.js";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function populateRecipeDetail(recipe) {
  const container = document.querySelector("[data-detail-container]");

  container.querySelector(".detail-banner img").src = recipe.image;
  container.querySelector(".detail-banner img").alt = recipe.name;

  container.querySelector(".display-small").textContent = recipe.name;

  container.querySelector(".detail-author .author-name").textContent = recipe.user;

  container
    .querySelectorAll(".stats-item")[0]
    .querySelector(".display-medium").textContent = recipe.ingredients.length;
  container
    .querySelectorAll(".stats-item")[1]
    .querySelector(".display-medium").textContent = recipe.cookTimeMinutes;
  container
    .querySelectorAll(".stats-item")[2]
    .querySelector(".display-medium").textContent = recipe.caloriesPerServing;

  const tagList = container.querySelector(".tag-list");
  tagList.innerHTML = "";

  [
    ...recipe.tags.map((tag) => tag.name),
    ...recipe.mealType,
  ].forEach((tag) => {
    const tagEl = document.createElement("a");
    tagEl.className = "filter-chip label-large has-state";
    tagEl.href = "/Pages/recipies.html";
    tagEl.textContent = tag;
    tagList.appendChild(tagEl);
  });
  // Servings
  container.querySelector(
    ".ingr-title .label-medium"
  ).textContent = `for ${recipe.servings} Servings`;

  // Ingredients
  const ingrList = container.querySelector(".ingr-list");
  ingrList.innerHTML = "";

  const uniqueIngredients = [...new Set(recipe.ingredients)];

  uniqueIngredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.className = "ingr-item";
    li.textContent = ingredient;
    ingrList.appendChild(li);
  });

  if (recipe.instructions && recipe.instructions.length > 0) {
    const instructionsHTML = recipe.instructions
      .map((step) => `<li class="ingr-item">${step}</li>`)
      .join("");
    const stepsSection = document.createElement("section");
    stepsSection.innerHTML = `
        <h2 class="title-medium ingr-title" style="margin-top: 3rem">Instructions</h2>
        <ul class="body-large ingr-list">${instructionsHTML}</ul>
      `;
    container.querySelector(".detail-content").appendChild(stepsSection);
  }
}

async function loadRecipeDetail() {
  const recipeId = getQueryParam("id");
  if (!recipeId) return;

  const recipe = await getSingleRecipe(recipeId);
  console.log(recipe);
  if (recipe) {
    populateRecipeDetail(recipe);
  }
}

document.addEventListener("DOMContentLoaded", loadRecipeDetail);
