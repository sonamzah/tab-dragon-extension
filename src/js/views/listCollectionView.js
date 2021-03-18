// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import ListView from './ListView.js';

// TODO :: Make a parent class CollectionsSaveMenu view?
class ListCollectionView extends ListView {
  _parentElement = document.querySelector('.collections--display');

  // render must be called with model.state.collectionNames
  _generateMarkup() {
    return this._data
      .map(collection => this._generateMarkupList(collection, false))
      .join('');
  }
}

export default new ListCollectionView();
