import View from './View.js';

class NavigationView extends View {
  _parentElement = document.querySelector('.nav');
  // _menuTitle = '';
  _navLeft = document.querySelector('.nav__left');
  _navRight = document.querySelector('.nav__right');

  displayTitleSave() {
    this._navLeft.textContent = 'Save';
  }
  displayTitleCofirm() {
    this._navLeft.textContent = 'Cancel';
  }
  toggleNavActive() {
    this._navLeft.classList.toggle('nav-active');
    this._navRight.classList.toggle('nav-active');
  }
  handleClickDot(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.nav__item');
      if (!btn) return;
      const { slide } = btn.dataset;
      //   toggle dot fill
      handler(slide);
    });
  }
  handleArrowKey(handler) {
    window.addEventListener('keydown', function (e) {
      // console.log(e);
      const key = e.key;
      if (key === 'ArrowLeft') handler('left');
      if (key === 'ArrowRight') handler('right');
    });
  }
  _generateMarkup() {}
}
export default new NavigationView();
