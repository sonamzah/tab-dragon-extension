// import "core-js/stable";
// import {} from "fractional";

import MenuView from './MenuView.js';

class SaveActionMenuView extends MenuView {
  // class SaveActionMenuView {
  // _menuTitle = 'Save Menu';
  buttons = Array.from(document.querySelectorAll('.btn--save'));
  _parentElement = document.querySelector('.collections-save-menu');

  // toggleTitle() {
  //   this._parentElement
  //     .querySelector('.primary-title')
  //     .classList.toggle('section--hidden');
  //   this._parentElement
  //     .querySelector('.secondary-title')
  //     .classList.toggle('section--hidden');
  // }

  enableSaveButtons() {
    //todo:: comment out all the state-storage bs you did earlier!
    this._parentElement
      .querySelector('.primary-title')
      .classList.remove('section--hidden');
    this._parentElement
      .querySelector('.secondary-title')
      .classList.add('section--hidden');

    this.buttons.forEach(btn => btn.classList.remove('btn--disabled'));
  }

  disableSaveButtons() {
    this._parentElement
      .querySelector('.primary-title')
      .classList.add('section--hidden');
    this._parentElement
      .querySelector('.secondary-title')
      .classList.remove('section--hidden');

    this.buttons.forEach(btn => btn.classList.add('btn--disabled'));
  }

  handleOpenPopup(handler) {
    window.addEventListener('load', handler);
  }

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

  _generateMarkup() {
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

export default new SaveActionMenuView();
