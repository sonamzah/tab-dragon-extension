import MenuView from './MenuView.js';

class SaveActionMenuView extends MenuView {
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
    this._nav.classList.remove('nav-warning');

    const title = this._parentElement.querySelector('.title--container');
    title.classList.add('section--hidden');
    title.classList.remove('title-container-warning');

    this.buttons.forEach(btn => btn.classList.remove('btn--disabled'));
  }

  disableSaveButtons() {
    this._nav.classList.add('nav-warning');

    const title = this._parentElement.querySelector('.title--container');
    title.classList.add('title-container-warning');
    title.classList.remove('section--hidden');

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
