// import "core-js/stable";
// import {} from "fractional";

export default class View {
  _titleElement = document.querySelector('.title');
  _data;

  hide() {
    this?._parentElement.classList.add('section--hidden');
    // return this;
    return;
  }
  show() {
    this?._parentElement.classList.remove('section--hidden');
    return this;
  }

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return console.log('error rendering');
    //   return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    // console.log(markup);

    if (!render) return markup;

    //change title menu -- (MAYBE CHANGE THIS TO PART OF EACH MENU)
    this._titleElement.textContent = this?._menuTitle;

    // Clear old content
    this._clear();
    // Add markup that was just made
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    return this;
  }

  renderMessage(message) {
    alert(message);
    console.log(this._parentElement.classList);
    // document.write(`<h2>${this._parentElement}</h2>`);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
