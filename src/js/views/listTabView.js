// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import ListView from './ListView.js';

import { getDomain, truncToNumChars } from '../helpers.js';
import { PREV_TITLE_LEN } from '../config.js';

// TODO :: Make a parent class CollectionsSaveMenu view?
class ListTabView extends ListView {
  _parentElement = document.querySelector('.tabs--confirm-save');

  // render must be called with model.state.selectedTabs.tabs
  _generateMarkup() {
    return this._data.map(tab => this._generateMarkupList(tab, true)).join('');
  }
}

export default new ListTabView();
