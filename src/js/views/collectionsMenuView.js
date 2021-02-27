// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import MenuView from './MenuView.js';
import { getDomain } from '../helpers.js';

// Menu class -- render method is never called on instanes of this class
class CollectionsMenuView extends MenuView {
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
  handleOpen(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const collection = e.target.closest('.collection--item');
      if (!collection) return;

      console.log('inside handle open -- you clicked on collection:');
      console.log(collection.dataset.id);

      handler(collection.dataset.id);
    });
  }

  // _generateMarkupCollection(collection) {
  //   const name = collection.name;
  //   const markup = `
  //       <li class="collection--item list--preview-item" data-name="${name}">
  //         <p class="collection-name list--preview-item__text inline-element">${name}</p><span class="collection-size" title=""> ${collection?.size}</span>
  //         <button class="btn--delete btn--delete-collection inline-element">&times;</button>
  //       </li>
  //       `;

  //   return markup;
  // }
  // //todo -- put outerhtml below into popup.html --
  // // todo git commit -> then pull from diff branch.. you moded msin
  // _generateMarkup() {
  //   return this._data
  //     .map(collection => this._generateMarkupCollection(collection))
  //     .join('');
  //   // return `
  //   // <ul class="collections--display list--preview">
  //   //     ${this._data
  //   //       .map(collection => this._generateMarkupCollection(collection))
  //   //       .join('')}
  //   // </ul>`;
  // }
}

export default new CollectionsMenuView();
