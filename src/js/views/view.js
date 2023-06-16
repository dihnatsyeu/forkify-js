import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  _parentElement;

  constructor(parentSelector) {
    this._parentElement = document.querySelector(parentSelector);
  }

  /**
   * Refreshes only changed DOM elements without reloading the whole element's DOM
   * @param {Object | Object[]} data the new data for the element to generate new DOM from
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curElement = curElements[i];
      if (!newEl.isEqualNode(curElement)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curElement.setAttribute(attr.name, attr.value)
        );
        if (newEl.firstChild?.nodeValue.trim() !== "") {
          curElement.textContent = newEl.textContent;
        }
      }
    });
  }
  /**
   * Renders a loading spinner while loading the data from API
   */
  renderSpinner() {
    const markup = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
              `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Render an view element to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} render If false, create a markup string instead of rendering to the DOM
   * @returns {undefined | string} returns string if render=false
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Simply clear the inner html of the element
   */
  _clear() {
    this._parentElement.innerHTML = "";
  }

  /**
   * Renders error message html into the html element
   * @param {String} message error message, defaults to the @this._errorMessage
   */
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Renders any message(usually success message) to the element's DOM
   * @param {String} message to render on the screen. Defaults to @this._successMessage
   */
  renderMessage(message = this._successMessage) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
