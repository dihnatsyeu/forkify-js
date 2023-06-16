import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE, START_SEARCH_PAGE } from "./config.js";

import { getJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    page: START_SEARCH_PAGE,
    query: "",
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookMarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    if (state.bookMarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    throw error;
  }
};

export const refreshSearchState = function () {
  state.search.page = START_SEARCH_PAGE;
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  console.log(page);
  state.search.page = page;
  console.log(state.search.page);
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingridient) => {
    ingridient.quantity =
      (ingridient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  const index = state.bookMarks.findIndex((el) => el.id === id);
  state.bookMarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};
