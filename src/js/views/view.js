import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  _parentElement;
  _markActive;

  constructor(parentSelector) {
    this._parentElement = document.querySelector(parentSelector);
  }

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

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

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
