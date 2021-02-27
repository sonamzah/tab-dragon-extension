// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import ListView from './ListView.js';
import { PREV_TITLE_LEN } from '../config.js';

// TODO :: Make a parent class CollectionsSaveMenu view?
class ListCollectionView extends ListView {
  _parentElement = document.querySelector('.collections--display');

  //   handleDeleteTab(handler) {}

  // render must be called with model.state.collectionNames
  _generateMarkup() {
    return this._data
      .map(collection => this._generateMarkupList(collection, false))
      .join('');
    // return `
    // <ul class="collections--display list--preview">
    //     ${this._data
    //       .map(collection => this._generateMarkupCollection(collection))
    //       .join('')}
    // </ul>`;
  }
}

export default new ListCollectionView();
