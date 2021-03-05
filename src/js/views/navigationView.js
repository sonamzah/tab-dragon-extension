import View from './View.js';

class NavigationView extends View {
  _parentElement = document.querySelector('.nav');
  // _menuTitle = '';
  _dotLeft = document.querySelector('.dot__left');
  _dotRight = document.querySelector('.dot__right');

  //add the dark-dot class to the element passed in (should be dots__dot) iff darken is true
  darkenDot(dotElem, darken = true) {
    darken
      ? dotElem.classList.add('dark-dot')
      : dotElem.classList.remove('dark-dot');
  }
  toggleDarkenDot() {
    // console.log('I was ran');
    this._dotLeft.classList.toggle('dark-dot');
    this._dotRight.classList.toggle('dark-dot');
  }
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
      // console.log(e);
      const key = e.key;
      if (key === 'ArrowLeft') handler('left');
      if (key === 'ArrowRight') handler('right');
    });
  }
  _generateMarkup() {}
}
export default new NavigationView();
