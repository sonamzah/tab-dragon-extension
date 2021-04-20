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

// TODO :: BUG -- when favicon url fails to load an error will be thrown? need to somehow return if img does not loag (try-catch?)
