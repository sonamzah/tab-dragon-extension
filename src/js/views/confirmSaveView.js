// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import View from './View.js';
import { getDomain } from '../helpers.js';

class confirmSaveView extends View {
  _parentElement = document.querySelector('.collections-save-menu');
  _data;

  handleConfirmSave(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (!e.target.classList.contains('btn--save-window')) return;
      handler();
      //   this._clear();
    });
  }
  handleDeleteTab(handler) {}

  _generateMarkupTab(url) {
    // console.log("this._data");
    // console.log(this._data);
    // // const markup = this._data.forEach((tab) => {
    // //   return `
    // //     <li class="tab--item">
    // //       <p class="tab--url inline-element">${tab.url} </p>
    // //       <button class="btn--confirm-delete inline-element">&times;</button>
    // //     </li>
    // //     `;
    // // });
    // this._data.forEach((tab) => {
    //   console.log(tab.url);
    // });

    const markup = `
        <li class="tab--item">
          <span title="${url}"><a class="tab--url inline-element" href="${url}">${getDomain(
      url
    )}</a></span>
          <button class="btn--confirm-delete-tab inline-element">&times;</button>
        </li>
        `;
    // `<li class="tab--item">
    //       <a class="tab--url inline-element" href="${url}" title="${url}">${getDomain(
    //   url
    // )}</a>
    //       <button class="btn--confirm-delete inline-element">&times;</button>
    //     </li>
    //     `;

    return markup;
  }
  _generateMarkup() {
    return `
    <ul class="tabs--confirm-save">
        ${this._data.map(tab => this._generateMarkupTab(tab.url)).join('')}
    </ul>
    <div class="form--confirm-save">
        <p>confirm</p>
    </div>`;
  }
}

export default new confirmSaveView();
