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
  handleArrowKey(handler) {
    window.addEventListener('keydown', function (e) {
      console.log(e);
      const key = e.key;
      if (key === 'ArrowLeft') handler('left');
      if (key === 'ArrowRight') handler('right');
    });
  }
  _generateMarkup() {}
}
export default new NavigationView();
