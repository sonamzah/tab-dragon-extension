//**************************** */
//**************************** */
saveActionMenuView.render({});
model.updateCurrentUI('saveActionMenuView'); //update state

collectionsMenuView.hide();
saveActionMenuView.render({}).show();
model.updateCurrentUI('saveActionMenuView'); //update state
//**************************** */
//**************************** */

//**************************** */
//**************************** */

//✅✅✅✅✅✅✅✅✅✅✅
saveActionMenuView.hide();
collectionsMenuView.render(model.state.collectionNames).show();
model.updateCurrentUI('collectionsMenu'); //update state
////////////////////////////////
//✅✅✅✅✅✅✅✅✅✅✅
confirmSaveMenuView.hide();
collectionsMenuView.render(model.state.collectionNames).show();
model.updateCurrentUI('collectionsMenu'); //update state
////////////////////////////////
//✅✅✅✅✅✅✅✅✅✅✅
confirmSaveMenuView.hide();
collectionsMenuView.render(model.state.collectionNames).show();
model.updateCurrentUI('collectionsMenu');
//**************************** */
//**************************** */

//**************************** */
//**************************** */
confirmSaveMenuView.render(model.state.selectedTabs.tabs);
// 3. Update state.currentUI
model.updateCurrentUI('confirmMenu');
//**************************** */
//**************************** */

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

//cases
// 1. on saveActionMenuView
// 2. on confirmSaveMenuView
// 3. on collectionsMenuView

const goToSaveActionMenu = function () {
  collectionsMenuView.hide(); //Doesnt change if already hidden
  saveActionMenuView.render({}).show();
  model.updateCurrentUI('saveActionMenuView'); //update state
};

//cases
// 1. on saveActionMenuView
// 2. on confirmSaveMenuView
// 3. on collectionsMenuView

//Handles saveActionMenuView.hide() and confirmSaveMenuView.hide()
const goToCollectionsMenu = function () {
  saveActionMenuView.hide();
  collectionsMenuView.render(model.state.collectionNames).show();
  model.updateCurrentUI('collectionsMenu'); //update state
};

const controlNav = function (direction) {
  //   if (!isString(direction)) return;
  console.log(direction);
  if (model.state.currentUI.confirmMenu) alert('cancel save?');

  if (direction === 'left') goToSaveActionMenu();
  if (direction === 'right') goToCollectionsMenu();
};

// const controlNav = function (direction) {
//   //   if (!isString(direction)) return;
//   console.log(direction);
//   if (direction === 'left') {
//     // current UI === saveActionMenuView
//     if (model.state.currentUI.saveActionMenuView) return;
//     // current UI === confirmMenu
//     if (model.state.currentUI.confirmMenu) {
//       alert('cancel save?');
//       goToSaveActionMenu();
//     }
//     // current UI === collectionsMenu
//     if (model.state.currentUI.collectionsMenu) {
//       goToSaveActionMenu();
//     }
//   }
//   if (direction === 'right') {
//     // current UI === saveActionMenuView
//     if (model.state.currentUI.saveActionMenuView) {
//       goToCollectionsMenu();
//     }
//     // current UI === confirmMenu
//     if (model.state.currentUI.confirmMenu) {
//       alert('cancel save?');
//       goToCollectionsMenu();
//     }
//     // current UI === collectionsMenu
//     if (model.state.currentUI.collectionsMenu) return;
//   }

//   // current UI === saveActionMenuView
//   //    direction === 'left'
//   //    direction === 'right'
//   // current UI === cinfirmSaveView
//   //    direction === 'left'
//   //    direction === 'right'
//   // current UI === collectionsMenu
//   //    direction === 'left'
//   //    direction === 'right'
// };

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

//Note -- display collections
const markup = `
        <li class="${
          options ? 'tab--item' : 'collection--item'
        }  list--preview-item" data-id="${options ? url : name}">

          <span title="${options ? url : ''}"><p class="${
  options ? 'tab--url' : 'collection-name'
} list--preview-item__text inline-element">${
  options ? getDomain(url) : name
}</p><span class="collection-size" title=""> 
          ${collection?.size}</span></span>
          
          <button class="btn--delete btn--delete-${
            options ? 'tab' : 'collection'
          }  inline-element">&times;</button>
        </li>
        `;

//Note -- confirm save
const markup = `
        <li class="tab--item list--preview-item" data-id="${name}">
          <span title="${url}"><a class="tab--url list--preview-item__text inline-element" href="${url}">${getDomain(
  url
)}</a></span>
          <button class="btn--delete btn--delete-tab inline-element">&times;</button>
        </li>
        `;

//collection
`<p class="collection-name list--preview-item__text inline-element">${name}</p> <span class="collection-size" title=""> ${collection?.size}</span>`;

//tab
`<span title="${url}"><a class="tab--url list--preview-item__text inline-element" href="${url}">${getDomain(
  url
)}</a></span>`;
