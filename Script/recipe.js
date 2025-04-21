import { getLimitedRecipes, searchRecipe, addRecipe, updateRecipe, deleteRecipe  } from './api.js'; 

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


filterSubmit.addEventListener('click', async function () {
  const filterCheckBoxes = filterBar.querySelectorAll("input:checked");
  const queries = [];

  let query = "";

  if (filterSearch.value) {
    query = filterSearch.value;
  }

  
  try {
    const data = await searchRecipe(query);
    const recipes = data.recipes || [];

    recipeList.innerHTML = ''; 

    if (recipes.length === 0) {
      recipeList.innerHTML = '<p class="no-results">No recipes found.</p>';
    } else {
      recipes.forEach(recipe => {
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
    const isLoggedIn = localStorage.getItem('isLoggedIn') == 'true';
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.isAdmin === true;
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

  if (isLoggedIn && isAdmin) {
    const adminActions = card.querySelectorAll('.admin-actions');
  
    const editBtn = adminActions[0]?.querySelector('.material-symbols-outlined');
    const deleteBtn = adminActions[1]?.querySelector('.material-symbols-outlined');
  
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        openEditDialog(recipe);
      });
    }
  
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        openDeleteConfirm(recipe.id, card);
      });
    }
  }

  return card;
}

function setupBookmarkButtons() {
  document.querySelectorAll(".icon-btn").forEach(btn => {
    const card = btn.closest(".card");
    if (!card) return; 
  
    const linkElement = card.querySelector(".card-link");
    if (!linkElement) return; 
    const link = linkElement.getAttribute("href");
    const idMatch = link.match(/id=(\d+)/);
    const id = idMatch ? idMatch[1] : null;

    if (!id) return;

    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    const isSaved = saved.some(recipe => recipe.id === id);

    if (isSaved) {
      btn.classList.remove("removed");
      btn.classList.add("saved");
    } else {
      btn.classList.remove("saved");
      btn.classList.add("removed");
    }

    btn.addEventListener("click", () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') == 'true';

      if (!isLoggedIn) {
        alert("Please log in to save recipes.");
        return;
      }
      const name = card.querySelector(".card-link").textContent;
      const image = card.querySelector("img").src;
      const timeText = card.querySelector(".label-medium").textContent;
      const time = parseInt(timeText);
      const recipe = { id, name, image, cookTimeMinutes: time };

      let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

      const existingIndex = savedRecipes.findIndex(r => r.id === id);

      if (existingIndex === -1) {
        savedRecipes.push(recipe);
        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        btn.classList.remove("removed");
        btn.classList.add("saved");
        alert("Recipe saved!");
      } else {
        savedRecipes.splice(existingIndex, 1);
        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        btn.classList.remove("saved");
        btn.classList.add("removed");
        alert("Recipe removed.");
      }
    });
  });
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
    setupBookmarkButtons()
  } catch (error) {
    console.error('Error loading recipes:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => { 
  loadRecipes(); 

    const addRecipeBtn = document.getElementById('Add-recipe');
    const isLoggedIn = localStorage.getItem('isLoggedIn') == 'true';
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.isAdmin === true;
  
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


// Add recipe for admin 
const addRecipeForm = document.querySelector('.Add-recipe-form');
const dialog = document.getElementById('recipeDialog');

addRecipeForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const time = parseInt(document.getElementById('time').value);
  const calories = parseInt(document.getElementById('calories').value);
  const ingredientsText = document.getElementById('ingredients').value;
  const imageInput = document.getElementById('image');
  const imageFile = imageInput.files[0];

  const imageURL = imageFile ? URL.createObjectURL(imageFile) : 'https://via.placeholder.com/200';


  const newRecipe = {
    name,
    cookTimeMinutes: time,
    caloriesPerServing: calories,
    servings: 2,
    cuisine: 'Custom',
    tags: ['Custom'],
    ingredients: ingredientsText.split(',').map(i => i.trim()),
    instructions: ['Add your steps here'], 
    image: imageURL 
  };
  try {
    const added = await addRecipe(newRecipe);

    const card = createRecipeCard(added);
    recipeList.prepend(card); 

    dialog.close();
    addRecipeForm.reset();
  } catch (error) {
    console.error('Failed to add recipe:', error);
  }
});



let currentEditingId = null;
let cardToDelete = null;


function openEditDialog(recipe) {
  currentEditingId = recipe.id;

  document.getElementById('edit-id').value = recipe.id;
  document.getElementById('edit-name').value = recipe.name;
  document.getElementById('edit-time').value = recipe.cookTimeMinutes;
  document.getElementById('editRecipeDialog').showModal();
}


document.getElementById('edit-recipe-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = currentEditingId;
  const name = document.getElementById('edit-name').value;
  const time = parseInt(document.getElementById('edit-time').value);
  const imageInput = document.getElementById('edit-image');
  const imageFile = imageInput.files[0];
  const imageURL = imageFile ? URL.createObjectURL(imageFile) : null;

  const updatedRecipe = {
    name,
    cookTimeMinutes: time,
    caloriesPerServing: calories,
    ingredients,
  };

  if (imageURL) updatedRecipe.image = imageURL;

  try {
    const updated = await updateRecipe(id, updatedRecipe);
    await loadRecipes();
    document.getElementById('editRecipeDialog').close();
  } catch (err) {
    console.error('Error updating recipe:', err);
  }
});



function openDeleteConfirm(id, cardElement) {
  cardToDelete = { id, cardElement };
  document.getElementById('deleteConfirmDialog').showModal();
}

document.getElementById('delete-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (cardToDelete) {
    try {
      await deleteRecipe(cardToDelete.id);
      cardToDelete.cardElement.remove();
      cardToDelete = null;
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  }

  document.getElementById('deleteConfirmDialog').close();
});
