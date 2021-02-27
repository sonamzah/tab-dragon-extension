// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import ListView from './ListView.js';

import { getDomain, truncToNumChars } from '../helpers.js';
import { PREV_TITLE_LEN } from '../config.js';

// TODO :: Make a parent class CollectionsSaveMenu view?
class ListTabView extends ListView {
  _parentElement = document.querySelector('.tabs--confirm-save');

  //   handleDeleteTab(handler) {}

  // render must be called with model.state.selectedTabs.tabsArr
  _generateMarkup() {
    return this._data.map(tab => this._generateMarkupList(tab, true)).join('');
    // return `
    // <ul class="tabs--confirm-save list--preview">
    //     ${this._data.map(tab => this._generateMarkupTab(tab.url)).join('')}
    // </ul>
    // <form class="form--confirm-save">
    //     <input
    //     type="text"
    //     class="name--confirm-save"
    //     name=""s
    //     id=""
    //     placeholder="Name your tab collection"
    //     />
    //     <button class="btn--confirm-save">
    //         <p class="">Save Collection</p>
    //     </button>
    // </form>`;
  }
}

export default new ListTabView();
