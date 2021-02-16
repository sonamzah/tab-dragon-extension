// import "core-js/stable";
// import {} from "fractional";

import View from './View.js';

class SaverView extends View {
  // class SaverView {
  _menuTitle = 'Save Menu';
  _parentElement = document.querySelector('.collections-save-menu');

  handleSaveWindow(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--save-window');
      if (!btn) return;
      handler();
      //   this._clear();
    });
  }
  //   handleSaveSelectTabs(handler) {}
  //   handleSaveByUrl(handler) {}

  _generateMarkUp() {
    return `
        <div class="save-buttons">
          <div class="vert-element">
            <button class="btn--save btn--save-window">
              <p>Entire Window</p>
            </button>
          </div>
          <div class="vert-element">
            <button class="btn--save btn--save-tabs"><p>Select tabs</p></button>
          </div>
          <div class="vert-element">
            <button class="btn--save btn--save-url"><p>Save by URL</p></button>
          </div>
        </div>`;
  }
}

export default new SaverView();
