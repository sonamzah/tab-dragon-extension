import View from './View.js';

//   child instances of this class will not ever render
//   They are simply menus that will be shown or hidden (see show() and hide() methods in parent class View.js)

export default class MenuView extends View {
  // Overwriting render method in View class
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return console.log('error rendering');
    //   return this.renderError();
    this._data = data;
    return this;
  }
}
