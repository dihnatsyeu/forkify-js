import View from './view.js';

class SearchView extends View {
  _field_selector = '.search__field';

  constructor() {
    super('.search');
  }

  getQuery() {
    const result = this._parentElement.querySelector(
      this._field_selector
    ).value;
    this._clearInput();
    return result;
  }

  _clearInput() {
    this._parentElement.querySelector(this._field_selector).value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
