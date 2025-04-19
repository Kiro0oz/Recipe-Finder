import { getLimitedRecipes, searchRecipe  } from './api.js'; 



// Accordion

const accordions = document.querySelectorAll("[data-accordion]")
const initAccordions = function(ele) {
  const btn = ele.querySelector("[data-accordion-btn]")
  let isExpanded = false;

  btn.addEventListener('click', function () {
    isExpanded = isExpanded ? false :  true;
    this.setAttribute("aria-expanded", isExpanded)
  })
}

for (const accordion of accordions) {
  initAccordions(accordion)
}

// Filter bar toggle
const filterBar = document.querySelector("[data-filter-bar]")
const filterTogglers = document.querySelectorAll("[data-filter-toggler]")
const overlay = document.querySelector("[data-overlay]")


filterTogglers.forEach(toggler => {
  toggler.addEventListener('click', function () {
    filterBar.classList.toggle("active");
    overlay.classList.toggle("active");
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = bodyOverflow === 'hidden' ? 'visible' : 'hidden';
  });
});


// Filter buttons 
const filterSubmit = document.querySelector("[data-filter-submit]")
const filterClear = document.querySelector("[data-filter-clear]")
const filterSearch = filterBar.querySelector("input[type='search']")

// filterSubmit.addEventListener('click', function() {
//   const filterCheckBoxes = filterBar.querySelectorAll("input:checked")

//   const queries = [];

//   if(filterSearch.value) {
//     queries.push(["q", filterSearch.value])
//   }

//   if(filterCheckBoxes.length) {
//     for (const checkbox of filterCheckBoxes) {
//       const key = checkbox.parentElement.parentElement.dataset.filter;
//       queries.push([key, checkbox.value])
//     }
//   }
// })

filterSubmit.addEventListener('click', async function () {
  const filterCheckBoxes = filterBar.querySelectorAll("input:checked");
  const queries = [];

  let query = "";

  // Build query string
  if (filterSearch.value) {
    query = filterSearch.value;
  }

  // You can extend this logic to handle checkbox filters later
  // For now, we only support search by query string (q)
  
  try {
    const data = await searchRecipe(query);
    const recipes = data.recipes || [];

    recipeList.innerHTML = ''; // clear previous results

    if (recipes.length === 0) {
      recipeList.innerHTML = '<p class="no-results">No recipes found.</p>';
    } else {
      recipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipeList.appendChild(card);
      });
    }

    // Close filter bar after searching
    filterBar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "visible";

  } catch (error) {
    console.error("Failed to search and display recipes:", error);
  }
});

filterSearch.addEventListener("keydown", e => {
  if(e.key === 'Enter') {
    filterSubmit.click();
  }
})

filterClear.addEventListener('click', function() {
  const filterCheckBoxes = filterBar.querySelectorAll("input:checked")

  filterCheckBoxes?.forEach(ele => ele.checked = false);
  filterSearch.value &&= ""
})


const filterBtn = document.querySelector("[data-filter-btn]")

window.addEventListener("scroll", e => {
  filterBtn.classList[window.scrollY >= 120 ? 'add' : 'remove']('active')
})


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


// Get Result depend on Tag
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tag = urlParams.get('tag');
  if (tag) {
    try {
      const data = await searchRecipe(tag);
      const recipes = data.recipes || [];

      recipeList.innerHTML = ''; 

      if (recipes.length === 0) {
        recipeList.innerHTML = `<p class="no-results">No recipes found for "${tag}".</p>`;
      } else {
        recipes.forEach(recipe => {
          const card = createRecipeCard(recipe);
          recipeList.appendChild(card);
        });
      }
    } catch (error) {
      console.error('Error loading tag-based recipes:', error);
    }
  } else {
    loadRecipes(); 
  }
});

