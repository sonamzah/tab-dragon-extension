import View from './View.js';

import { getDomain, truncToNumChars } from '../helpers.js';
import { PREV_TITLE_LEN } from '../config.js';

//   child instances of this class will not ever render
//   They are simply menus that will be shown or hidden (see show() and hide() methods in parent class View.js)
export default class ListView extends View {
  handleDeleteTab(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btnClose = e.target.closest('.btn--delete');
      if (!btnClose) return;
      //if delete buttn clicked, stop propagation (so collections cant open)
      e.stopPropagation();

      const dataId = e.target.closest('.list--preview-item').dataset.id;
      //   console.log('dataId extracted from handleDeleteCollection in list view');
      //   console.log(dataId);
      handler(dataId);
    });
  }

  // NOTE ::  when tab is true this method creates markup for a list of tab items
  // -- when false, for a list of collection items
  // supply a single arg of tabData (model.state.selectedTabs.tabsArr[i]) or collection data (model.state.collectionNames[i])
  //   todo put make the arguments an options object?
  _generateMarkupList(itemData, tab = true) {
    const liClass = tab ? 'tab--item' : 'collection--item';
    const dataId = tab ? itemData.url : itemData.name;
    const spanTitle = tab ? itemData.url : '';
    const pClass = tab ? 'tab--url' : 'collection-name';
    // ${truncToNumChars( getDomain(url), PREV_TITLE_LEN) -- truncate the names when your ready to render them
    const pText = tab ? getDomain(itemData.url) : itemData.name;
    const collectionSize = tab
      ? ''
      : `<span class="collection-size" title=""> ${itemData?.size}</span>`;
    const btnClass = tab ? 'tab' : 'collection';

    const markup = `
        <li class="${liClass} list--preview-item" data-id="${dataId}">
          <span title="${spanTitle}">
            <p class="${pClass} list--preview-item__text inline-element">${pText}</p>
            <span class="collection-size">${collectionSize}</span>
          </span>
          <button class="btn--delete btn--delete-${btnClass}">&times;</button>
        </li>
        `;
    return markup;
  }
}
