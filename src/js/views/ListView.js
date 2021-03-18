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

  //TODO ___ CLEAN THIS FUNCT UPPPP
  // TODO:: add a way to view all or cycle through favicons of collections!
  //note... pass in array of favicon urls
  _generateFavIconMarkup(favicons) {
    // Case: TAB list item -- NO favIconUrl: ""
    if (favicons.length === 1 && !favicons[0]) {
      //todo:: maybe need to still render empty img?
      // console.log('NO favicon for this tab!');
      return '';
    }
    // Case: COLLECTION list item -- display first 3 favicons(?)
    if (favicons.length > 1) {
      console.log('GETTING FIRST 3 favicons');
      let counter = 0;
      const fav = favicons
        .filter(favicon => {
          if (favicon) counter++;
          return favicon && counter <= 3;
        })
        .map(favicon => {
          // if(favicon)
          return `<img class="favicons" src="${favicon}" alt="">`;
        })
        .join('');
      if (!fav) return '';
      return fav;
    }
    // Case: TAB list item -- YES favIconUrl EXISTS
    // console.log(`TAB FAVICON: <img class="favicons" src="${favicons[0]}" alt="">`);
    return `<img class="favicons" src="${favicons[0]}" alt="">`;
  }

  // NOTE ::  when tab is true this method creates markup for a list of tab items
  // -- when false, for a list of collection items
  // supply a single arg of tabData (model.state.selectedTabs.tabs[i]) or collection data (model.state.collectionNames[i])
  //   todo put make the arguments an options object?
  _generateMarkupList(itemData, tab = true) {
    const liClass = tab ? 'tab--item' : 'collection--item';
    const dataId = tab ? itemData.url : itemData.name;
    const collapse = tab ? '.section--collapse-width' : '';
    const favicons = tab ? [itemData?.favIconUrl] : itemData?.favIconUrls;
    const collectionSize = tab
      ? ''
      : `<span class="collection-size" title=""> ${itemData?.size}</span>`;
    const spanTitle = tab ? itemData.url : '';
    const pClass = tab ? 'tab--url' : 'collection-name';
    // ${truncToNumChars( getDomain(url), PREV_TITLE_LEN) -- truncate the names when your ready to render them
    const pText = tab
      ? truncToNumChars(getDomain(itemData.url), PREV_TITLE_LEN)
      : truncToNumChars(itemData.name, PREV_TITLE_LEN);

    const btnClass = tab ? 'tab' : 'collection';

    const markup = `
        <li class="${liClass} list--preview-item" data-id="${dataId}">
          <div class="container--info">
            <span class="collection-size ${collapse}">${collectionSize}</span>
            <span class="container--favicons">
              ${this._generateFavIconMarkup(favicons)}
            </span>
          </div>
          <div class="container--name" title="${spanTitle}">
            <p class="${pClass} list--preview-item__text inline-element">${pText}</p>
          </div>
          <button class="btn--delete btn--delete-${btnClass}">&times;</button>
        </li>
        `;
    return markup;
  }
}
