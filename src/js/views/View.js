// import "core-js/stable";
// import {} from "fractional";

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return console.log('error rendering');
    //   return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    // console.log(markup);

    if (!render) return markup;

    // Clear old content
    this._clear();
    // Add markup that was just made
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
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
