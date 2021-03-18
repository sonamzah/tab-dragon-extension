// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import MenuView from './MenuView.js';

// Menu class -- render method is never called on instanes of this class
class ConfirmSaveMenuView extends MenuView {
  _parentElement = document.querySelector('.collections-confirm-menu');

  focusInput() {
    this._parentElement.querySelector('.name--confirm-save').focus();
    this._parentElement.querySelector('.name--confirm-save').select();
  }
  getSaveName() {
    const name = this._parentElement.querySelector('.name--confirm-save').value;
    return name;
  }

  clearInput() {
    this._parentElement.querySelector('.name--confirm-save').value = '';
  }

  // Submit listener for name input form
  handleConfirmSave(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // Not technically necessary since its the only form
      const form = e.target.closest('.form--confirm-save');
      if (!form) return;

      handler();
      //   this._clear();
    });
  }
}

export default new ConfirmSaveMenuView();
