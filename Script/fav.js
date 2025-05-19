import { getAllFav, removeFromFav } from "./api.js";

function createSavedRecipeCard(recipe) {
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
        <a href="detail.html?id=${recipe.id}" class="card-link">${recipe.name}</a>
      </h3>
      <div class="meta-wrapper">
        <div class="meta-item">
          <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
          <span class="label-medium">${recipe.cookTimeMinutes} minutes</span>
        </div>

        <button class="icon-btn has-state saved" aria-label="Remove from saved recipes">
          <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
          <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
        </button>
      </div>
    </div>
  `;

  const btn = card.querySelector('.icon-btn');
  btn.addEventListener('click', async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'Please log in to remove recipes from favorites.',
      });
      return;
    }

    try {
      await removeFromFav(recipe.id, accessToken);
      // Remove card from DOM
      card.closest('li').remove();
      Swal.fire({
        icon: 'info',
        title: 'Recipe Removed',
        text: `The recipe has been removed from your favorites.`,
      });

      
      const remainingCards = document.querySelectorAll('[data-slider-wrapper] .slider-item');
      if (remainingCards.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'no-results';
        emptyMessage.innerHTML = `
          <img src="../assets/Recipe book-pana.png" alt="Add more recipe" class="add-more-img">
          <a href="../Pages/recipies.html" class="go-save-link">Go back to recipes and add some favorites!</a>
        `;
        document.querySelector('[data-slider-wrapper]').parentElement.appendChild(emptyMessage);
      }

    } catch (error) {
      console.error("Failed to remove favorite:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove the recipe from favorites. Please try again.',
      });
    }
  });

  return card;
}
  


document.addEventListener('DOMContentLoaded', async () => {
  const recipeList = document.querySelector('[data-slider-wrapper]');
  recipeList.innerHTML = '';

  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await getAllFav(accessToken);
    const favorites = response.favorites;

    if (!favorites || favorites.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'no-results';
      emptyMessage.innerHTML = `
        <img src="../assets/Recipe book-pana.png" alt="Add more recipe" class="add-more-img">
        <a href="../Pages/recipies.html" class="go-save-link">Go back to recipes and add some favorites!</a>
      `;
      recipeList.parentElement.appendChild(emptyMessage);
      return;
    }

    favorites.forEach(recipe => {
      const card = createSavedRecipeCard(recipe);
      const listItem = document.createElement('li');
      listItem.className = 'slider-item';
      listItem.appendChild(card);
      recipeList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading favorites:", error);
    recipeList.innerHTML = `<p class="error-msg">Failed to load your favorite recipes. Please try again later.</p>`;
  }
});
  