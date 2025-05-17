const DOMAIN = 'https://dummyjson.com'
const BACKENDDOMAIN = 'http://127.0.0.1:8000'


// Register
export const register = async function(user) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    console.log(data)
    return data;

  } catch (error) {
    console.error("Error during registration:", error);
    throw error; 
  }
};

// Login
export const login = async function (credentials) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Get Role of user
export const getRole = async function(accessToken) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/auth/role/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user role");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error during fetching role:", error);
    throw error;
  }
};

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


// Add Recipe
export const addRecipe = async function (recipeData) {
  try {
    const response = await fetch(`${DOMAIN}/recipes/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error('Failed to add recipe');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding recipe:', error);
  }
};

// update Recipe
export const updateRecipe = async function (id, recipeData) {
  try {
    const response = await fetch(`${DOMAIN}/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error('Failed to add recipe');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding recipe:', error);
  }
};

// delete Recipe
export const deleteRecipe = async function (id) {
  try {
    const response = await fetch(`${DOMAIN}/recipes/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding recipe:', error);
  }
};