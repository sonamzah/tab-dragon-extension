// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import View from './View.js';
import { getDomain } from '../helpers.js';

// TODO :: Make a parent class CollectionsSaveMenu view?
class displayCollectionsView extends View {
  _menuTitle = 'My Collections';
  _parentElement = document.querySelector('.collections-display-menu');

  // Submit listener for name input form
  // handleConfirmSave(handler) {
  //   this._parentElement.addEventListener('submit', function (e) {
  //     e.preventDefault();
  //     // Not technically necessary since its the only form
  //     const form = e.target.closest('.form--confirm-save');
  //     if (!form) return;

  //     handler();
  //     //   this._clear();
  //   });
  // }

  handleDeleteCollection(handler) {}

  _generateMarkupCollection(url) {
    const markup = `
        <li class="collection--item list--preview-item">
          <span title="${url}"><a class="collection-name list--preview-item__text inline-element" href="${url}">${getDomain(
      url
    )}</a></span>
          <button class="btn--delete btn--delete-collection inline-element">&times;</button>
        </li>
        `;

    return markup;
  }
  _generateMarkup() {
    return `
    <ul class="collections--display list--preview">
        ${this._data
          .map(tab => this._generateMarkupCollection(tab.url))
          .join('')}
    </ul>`;
  }
}

export default new displayCollectionsView();
