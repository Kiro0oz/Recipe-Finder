const DOMAIN = 'https://dummyjson.com'

// Get All recipes
export const getRecipes = async function () {
    try {
      const response = await fetch(`${DOMAIN}/recipes`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch all recipes");
      }
      const data = await response.json();
      return data
    } catch (error) {
      console.error("Error fetching all recipes:", error);
    }
  }

// Get single recipes
export const getSingleRecipe = async function (id) {
    try {
      const response = await fetch(`${DOMAIN}/recipes/${id}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch single recipe");
      }
      const data = await response.json();
      return data
    } catch (error) {
      console.error("Error fetching single recipe:", error);
    }
  }

// Search recipes
export const searchRecipe = async function (query) {
    try {
      const response = await fetch(`${DOMAIN}/recipes/search?q=${query}`)
      
      if (!response.ok) {
        throw new Error("Failed to search for recipe");
      }
      const data = await response.json();
      return data
    } catch (error) {
      console.error("Error to search for recipe:", error);
    }
  }


// Get limit recipes
 export const getLimitedRecipes = async (limit = 10) => {
    try {
      const response = await fetch(`https://dummyjson.com/recipes?limit=${limit}&select=name,image,cookTimeMinutes,cuisine,mealType`);
      if (!response.ok) {
        throw new Error("Failed to fetch limited recipes");
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };


// Get all recipes tags
export const getRecipesTags = async function () {
  try {
    const response = await fetch(`${DOMAIN}/recipes/tags`)
    
    if (!response.ok) {
      throw new Error("Failed to fetch all recipes");
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching all recipes:", error);
  }
}