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
    btn.addEventListener('click', () => {
      let saved = JSON.parse(localStorage.getItem('savedRecipes')) || [];
      saved = saved.filter(r => r.id !== recipe.id);
      localStorage.setItem('savedRecipes', JSON.stringify(saved));
      card.parentElement.remove(); 
      Swal.fire({
        icon: 'info',
        title: 'Recipe Removed',
        text: `The recipe has been removed from your favorites.`,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000)
    });
  
    return card;
  }
  


document.addEventListener('DOMContentLoaded', () => {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const recipeList = document.querySelector('[data-slider-wrapper]');
    recipeList.innerHTML = ''; 
  
    if (savedRecipes.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'no-results';
        emptyMessage.innerHTML = `
          <img src="../assets/Recipe book-pana.png" alt="Add more recipe" class="add-more-img">
          <a href="../Pages/recipies.html" class="go-save-link">Go back to recipes and add some favorites!</a>
        `;
        recipeList.parentElement.appendChild(emptyMessage);
        return;
      }
  
    savedRecipes.forEach(recipe => {
      const card = createSavedRecipeCard(recipe);
      const listItem = document.createElement('li');
      listItem.className = 'slider-item';
      listItem.appendChild(card);
      recipeList.appendChild(listItem);
    });
  });
  