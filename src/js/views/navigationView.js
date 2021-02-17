import View from './View.js';

class NavigationView extends View {
  _parentElement = document.querySelector('.nav');
  _menuTitle = '';

  handleClickDot(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.dots__dot');
      if (!btn) return;
      const { slide } = btn.dataset;
      //   toggle dot fill
      handler(slide);
    });
  }
  handleArrowKey() {}
  _generateMarkup() {}
}
export default new NavigationView();
