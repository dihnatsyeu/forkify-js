import View from "./view.js";
import previewView from "./previewView.js";

class ResultView extends View {
  _errorMessage = "No recipies found for your query! Please try again";
  _successMessage = "";
  constructor() {
    super(".results");
  }

  _generateMarkup() {
    return this._data.map((data) => previewView.render(data, false)).join("");
  }
}

export default new ResultView();
