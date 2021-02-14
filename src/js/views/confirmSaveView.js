// import "core-js/stable";
// import {} from "fractional";

// import { mark } from "regenerator-runtime";
import View from './View.js';

class confirmSaveView extends View {
  _parentElement = document.querySelector('.collections-save-menu');
  _data;

  //   handleSaveWindow(handler) {
  //     this._parentElement.addEventListener("click", function (e) {
  //       if (!e.target.classList.contains("btn--save-window")) return;
  //       handler();
  //       //   this._clear();
  //     });
  //   }

  _generateMarkupTab(url) {
    // console.log("this._data");
    // console.log(this._data);
    // // const markup = this._data.forEach((tab) => {
    // //   return `
    // //     <li class="tab--item">
    // //       <p class="tab--url inline-element">${tab.url} </p>
    // //       <button class="btn--confirm-delete inline-element">&times;</button>
    // //     </li>
    // //     `;
    // // });
    // this._data.forEach((tab) => {
    //   console.log(tab.url);
    // });

    const markup = `
        <li class="tab--item">
          <p class="tab--url inline-element">${url}</p>
          <button class="btn--confirm-delete inline-element">&times;</button>
        </li>
        `;
    console.log(markup);

    return markup;
  }
  _generateMarkup() {
    return `
    <ul class="tabs--confirm-save">
        ${this._data.map(tab => this._generateMarkupTab(tab.url)).join('')}
    </ul>
        `;
  }
}

export default new confirmSaveView();
