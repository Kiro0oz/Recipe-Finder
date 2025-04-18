import { getLimitedRecipes } from './api.js'; 

const recipeList = document.querySelector('[data-grid-list]');

function createRecipeCard(recipe) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const card = document.createElement('div');
  card.className = 'card';

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

        <button class="icon-btn has-state removed" aria-label="Add to saved recipes">
          <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
          <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
        </button>
      </div>
    </div>

    ${isLoggedIn && isAdmin ? `
    <div class="admin-actions-container">
      <div class="admin-actions">
        <span class="material-symbols-outlined">edit</span>
      </div>
      <div class="admin-actions">
        <span class="material-symbols-outlined">delete</span>
      </div>
    </div>` : ''}
  `;

  return card;
}

async function loadRecipes() {
  try {
    const response = await getLimitedRecipes(50);
    const recipes = response.recipes;

    recipeList.innerHTML = '';

    recipes.forEach(recipe => {
      const card = createRecipeCard(recipe);
      recipeList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading recipes:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => { 
    loadRecipes(); 

    const addRecipeBtn = document.getElementById('Add-recipe');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
    if (!isLoggedIn || !isAdmin) {
      addRecipeBtn.style.display = 'none';
    }

} );
