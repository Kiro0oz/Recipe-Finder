const DOMAIN = "https://dummyjson.com";
const BACKENDDOMAIN = "http://127.0.0.1:8000";

// Register
export const register = async function (user) {
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
    console.log(data);
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
export const getRole = async function (accessToken) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/auth/role/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    const response = await fetch(`${BACKENDDOMAIN}/api/recipe/`);

    if (!response.ok) {
      throw new Error("Failed to fetch all recipes");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all recipes:", error);
  }
};

// Get single recipes
export const getSingleRecipe = async function (id) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/recipe/${id}/single/`);

    if (!response.ok) {
      throw new Error("Failed to fetch single recipe");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching single recipe:", error);
  }
};

export const addToFav = async function (id, accessToken) {
  try {
    const response = await fetch(
      `${BACKENDDOMAIN}/api/recipe/favorites/${id}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add recipe from favorite");
    }

    const data = await response.json();
    return data;
  } catch {
    console.error("Error fetching Add recipe in Fav:", error);
    throw error;
  }
};

export const removeFromFav = async function (id, accessToken) {
  try {
    const response = await fetch(
      `${BACKENDDOMAIN}/api/recipe/favorites/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove recipe from favorite");
    }

    const data = await response.json();
    return data;
  } catch {
    console.error("Error fetching remove recipe in Fav:", error);
    throw error;
  }
};

export const getAllFav = async function (accessToken) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/recipe/favorites/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all favorites");
    }

    const data = await response.json();
    return data;
  } catch {
    console.error("Error fetching all favorites:", error);
    throw error;
  }
};

// Search recipes
export const searchRecipe = async function (query) {
  try {
    const response = await fetch(
      `${BACKENDDOMAIN}/api/recipe/search/?q=${query}`
    );

    if (!response.ok) {
      throw new Error("Failed to search for recipe");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error to search for recipe:", error);
  }
};

// Get limit recipes
export const getLimitedRecipes = async (limit = 10, accessToken) => {
  try {
    const response = await fetch(
      `${BACKENDDOMAIN}/api/recipe/limit/?limit=${limit}&select=name,image,cookTimeMinutes,cuisine,mealType,is_favorited`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
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
    const response = await fetch(`${BACKENDDOMAIN}/api/recipe/tags/names/`);

    if (!response.ok) {
      throw new Error("Failed to fetch all recipes");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all recipes:", error);
  }
};

// Add Recipe
export const addRecipe = async function (recipeData, accessToken) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/recipe/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error("Failed to add recipe");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};

// update Recipe
export const updateRecipe = async function (id, recipeData,accessToken) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/recipe/${id}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error("Failed to add recipe");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};

// delete Recipe
export const deleteRecipe = async function (id) {
  try {
    const response = await fetch(`${BACKENDDOMAIN}/api/recipe/${id}/delete/`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};
