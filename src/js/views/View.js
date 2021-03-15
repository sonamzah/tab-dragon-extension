// import "core-js/stable";
// import {} from "fractional";

export default class View {
  //   _titleElement = document.querySelector('.title');
  _nav = document.querySelector('.nav');
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

    if (!render) return markup;

    //change title menu -- (MAYBE CHANGE THIS TO PART OF EACH MENU)
    // this._titleElement.textContent = this?._menuTitle;

    // Clear old content
    this._clear();
    // Add markup that was just made
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    return this;
  }

  update(data) {
    // Process data
    // Create new virtual DOM environment
    // Iterate through the two and check if there are any differences
    // insert only different

    this._data = data;
    const newMarkup = this._generateMarkup();

    // Create new virtual DOM for comparison
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' // Only want to replace text content not whole container elements
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed attributes
      if (!newEl.isEqualNode(curEl)) {
        console.log(newEl, newEl.attributes);
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
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
