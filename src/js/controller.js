import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/searchResultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookMarkView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// function to manage load the selected recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show loading spinner while loading the data
    recipeView.renderSpinner();

    //Update  recipe details and boookmarks page with the updated data
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookMarks);

    // load the selected recipe details
    await model.loadRecipe(id);

    // render recipe view based on the fetched recipe data
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

//function to manage recipe search results
const controlSearchResults = async function () {
  try {
    //Showing loading spinner while loading results
    resultsView.renderSpinner();

    //Reset page select to the default one on new search
    model.refreshSearchState();

    //Load the list of meals by the user defined query or default one
    const query = searchView.getQuery() || DEFAULT_QUERY;
    await model.loadSearchResults(query);

    // render search results view with pagination
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

//function to render search view and pagination for a new page
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

//function to modify ingridients based on the assumed number of people for a meal
const controlServings = function (newServings) {
  if (newServings < 1) {
    return;
  }
  // updates the recipe data and re-render recipe view page
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

// function to manage recipe bookmarking
const controlAddBookmark = function () {
  // adds or delete a recipe from bookmarks based on the current state
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // re-render recipe and bookmarks view after bookmarking
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookMarks);
};

//function to control rendering of bookmarks view
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookMarks);
};

//function to control adding a new user defined recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    //Uploading a recipe and rendering view form with new recipe
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookMarks);

    //Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //Wait for add form to disappear
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};

// adding handlers to user events on UI
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
