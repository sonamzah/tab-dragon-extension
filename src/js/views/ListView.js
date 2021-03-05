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

  // ${truncToNumChars( getDomain(url), PREV_TITLE_LEN)

  // NOTE ::  when tab is true this method creates markup for a list of tab items
  // -- when false, for a list of collection items
  // supply a single arg of tabData (model.state.selectedTabs.tabsArr[i]) or collection data (model.state.collectionNames[i])
  _generateMarkupList(itemData, tab = true) {
    const liClass = tab ? 'tab--item' : 'collection--item';
    const dataId = tab ? itemData.url : itemData.name;
    const spanTitle = tab ? itemData.url : '';
    const pClass = tab ? 'tab--url' : 'collection-name';
    const pText = tab ? getDomain(itemData.url) : itemData.name;
    const collectionSize = tab
      ? ''
      : `<span class="collection-size" title=""> ${itemData?.size}</span>`;
    const btnClass = tab ? 'tab' : 'collection';

    const markup = `
        <li class="${liClass} list--preview-item" data-id="${dataId}">
          <span title="${spanTitle}"><p class="${pClass} list--preview-item__text inline-element">${pText}</p>${collectionSize}</span>
          <button class="btn--delete btn--delete-${btnClass} inline-element">&times;</button>
        </li>
        `;
    return markup;

    // const markup = `
    //     <li class="tab--item list--preview-item">
    //       <span title="${url}"><a class="tab--url list--preview-item__text inline-element" href="${url}">${getDomain(
    //   url
    // )}</a></span>
    //       <button class="btn--delete btn--delete-tab inline-element">&times;</button>
    //     </li>
    //     `;
    // `<li class="list--preview-item">
    //       <a class="list--preview-item__text inline-element" href="${url}" title="${url}">${getDomain(
    //   url
    // )}</a>
    //       <button class="btn--confirm-delete inline-element">&times;</button>
    //     </li>
    //     `;
  }
}
