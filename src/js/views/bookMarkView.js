import View from "./view.js";
import previewView from "./previewView.js";

class BookMarksView extends View {
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it!";
  _successMessage = "";

  constructor() {
    super(".bookmarks__list");
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}
export default new BookMarksView();
