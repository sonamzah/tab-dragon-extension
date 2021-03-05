// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import MenuView from './MenuView.js';
import { getDomain, truncToNumChars } from '../helpers.js';
import { PREV_TITLE_LEN } from '../config.js';

// Menu class -- render method is never called on instanes of this class
class ConfirmSaveMenuView extends MenuView {
  _parentElement = document.querySelector('.collections-confirm-menu');

  getSaveName() {
    const name = this._parentElement.querySelector('.name--confirm-save').value;
    // this._clearInput();

    return name;
  }

  clearInput() {
    this._parentElement.querySelector('.name--confirm-save').value = '';
  }

  // Submit listener for name input form
  handleConfirmSave(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // Not technically necessary since its the only form
      const form = e.target.closest('.form--confirm-save');
      if (!form) return;

      handler();
      //   this._clear();
    });
  }

  // handleDeleteTab(handler) {}

  // // ${truncToNumChars( getDomain(url), PREV_TITLE_LEN)
  // _generateMarkupTab(url) {
  //   const markup = `
  //       <li class="tab--item list--preview-item">
  //         <span title="${url}"><a class="tab--url list--preview-item__text inline-element" href="${url}">${getDomain(
  //     url
  //   )}</a></span>
  //         <button class="btn--delete btn--delete-tab inline-element">&times;</button>
  //       </li>
  //       `;
  //   // `<li class="list--preview-item">
  //   //       <a class="list--preview-item__text inline-element" href="${url}" title="${url}">${getDomain(
  //   //   url
  //   // )}</a>
  //   //       <button class="btn--confirm-delete inline-element">&times;</button>
  //   //     </li>
  //   //     `;

  //   return markup;
  // }

  // _generateMarkup() {
  //   return this._data.map(tab => this._generateMarkupTab(tab.url)).join('');
  //   // return `
  //   // <ul class="tabs--confirm-save list--preview">
  //   //     ${this._data.map(tab => this._generateMarkupTab(tab.url)).join('')}
  //   // </ul>
  //   // <form class="form--confirm-save">
  //   //     <input
  //   //     type="text"
  //   //     class="name--confirm-save"
  //   //     name=""s
  //   //     id=""
  //   //     placeholder="Name your tab collection"
  //   //     />
  //   //     <button class="btn--confirm-save">
  //   //         <p class="">Save Collection</p>
  //   //     </button>
  //   // </form>`;
  // }
}

export default new ConfirmSaveMenuView();
