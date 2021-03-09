/**
 * POPUP.js IS the 'CONTROLLER'
 */
import * as model from './model.js';
import navigationView from './views/navigationView.js';
import saveActionMenuView from './views/saveActionMenuView.js';
import confirmSaveMenuView from './views/confirmSaveMenuView.js';
import collectionsMenuView from './views/collectionsMenuView.js';

import listTabView from './views/listTabView.js';
import listCollectionView from './views/listCollectionView.js';

import { isString } from './helpers.js';

//Handles collectionsMenuView.hide() and reset confirmSaveMenuView to saveActionMenuView
const goToSaveActionMenu = function () {
  // TODO :: change all current UI names to menu
  if (model.state.currentUI.saveActionMenu) return;
  if (model.state.currentUI.collectionsMenu) {
    navigationView.toggleDarkenDot();
    collectionsMenuView.hide();
  }
  // No toggle darken needed if currentUI === confirm view
  confirmSaveMenuView.hide();

  saveActionMenuView.show();
  model.updateCurrentUI('saveActionMenu'); // Update state.currentUI
};
const goToConfirmMenu = function () {
  if (model.state.currentUI.confirmMenu) return;
  // 1. Hide save action menu
  saveActionMenuView.hide(); //confirm view only accessable from saveView

  // 2. Show the confirm save menu
  confirmSaveMenuView.show();
  model.updateCurrentUI('confirmMenu'); // Update state.currentUI
};
//Handles saveActionMenuView.hide() and confirmSaveMenuView.hide()
const goToCollectionsMenu = function () {
  if (model.state.currentUI.collectionsMenu) return;

  //   console.dir(collectionsMenuView);
  navigationView.toggleDarkenDot(); // Change dark nav dot
  saveActionMenuView.hide();
  confirmSaveMenuView.hide();
  //todo:: add update method
  //   collectionsMenuView.render(model.state.collectionNames).show();
  collectionsMenuView.show();
  model.updateCurrentUI('collectionsMenu'); // Update state.currentUI
};

//*************************************** */p [''''''''''''']
//todo:: figure out how to style the animated slide in
//**************************************** */
const controlNav = function (direction) {
  //   if (!isString(direction)) return;
  console.log(direction);
  if (model.state.currentUI.confirmMenu) alert('cancel save?');

  if (direction === 'left') goToSaveActionMenu();
  if (direction === 'right') goToCollectionsMenu();
};

const controlOpenPopup = async function () {
  try {
    await model.initializeState();
    listCollectionView.render(model.state.collectionNames); // Render collection list in collection menu
  } catch (err) {
    console.log(`💥👾💥 Control Open Popup: ${err.message}`);
  }
};

const controlSaveByWindow = async function () {
  try {
    // 1. Put tabs' urls in model.state
    // (Async call to chrome.tabs by model)
    await model.allTabsFromWindow();

    // 2. Render tab list -- posibly move this into the goToConfirm funct later when adding more saveBy features
    listTabView.render(model.state.selectedTabs.tabsArr);

    // 3. Show confirmation to save menu
    goToConfirmMenu();
  } catch (err) {
    console.log(err);
  }
};

const controlConfirmSave = async function () {
  try {
    // 1. Get the name of tab collection & pass it to model
    const name = confirmSaveMenuView.getSaveName();
    if (!name) return alert('Please enter a name!');

    //Note :: may want to refactor -- move gaurd clause checks into model.saveCollection(?)
    /**
    the reason for not is so that you can render appropriate messages from controller (popup.js) 
    alternative option is to make these calls in model.saveCollection() but then make these checks throw an error with the specified 
    failure message to render... then check the return val of model.saveCollection() here and if success -> continue... 
    if it fails -> pull the message and render it to screen!
    */

    //----------GAURD CLAUSES--------------
    // 1.1 check if collection name exists (otherwise it will override state)
    if (model.collectionExists(name))
      return alert(
        'There is already a collection with this name. Please choose a new name. (collection name overwrite feature will be added later!)'
      );

    //Note :: may want to refactor -- move this check into model.saveCollection(?)
    // 1.2 Check size in bytes of collection to save (including the name as key -- {name: [tabDat1,...tabDatN]}
    if (model.checkBytesPerItem(name))
      return alert('This collection is too damn big. delete some tabs!');

    // 1.3 Check if storage is too full to add collection
    if (await model.checkStorageSpace(name))
      // NOTE :: it would be cool if you could say how many... though you dont know how big data will be --- (pad it?)
      return alert(
        `Storage is at its mad max. Try deleting some tabs from this collection...You may need to delete some previously saved collections.`
      );
    //----------GAURD CLAUSES END--------------

    // 2. Save the current set of tabs to chrome.storage.sync
    await model.saveCollection(name); // pushes to model.state.collectionNames

    //TODO :: *BUG* if you dont move gaurd clauses into model.saveCollection - you need to add clear input after 1.3 gaurd check
    // 2.1 Clear name input form field
    confirmSaveMenuView.clearInput();

    // todo +++ THIS doesnt register because function returns early @ 1.3 when storage is maxed... so need to handle it differently
    // todo --- shouldnt it get activated at the end of a save if its within the MAX range? YES -- but the (common) edge case that the
    // todo ---- collection you are trying to add is what is maxing out storage...
    // TODO ____ SOLUTION: either 1. add the diable @ 1.3 if-block ... or 2. use state.Max storage or... 3.
    // 2.2 if there is NO storage space, disable buttons
    if (await model.checkStorageSpace()) {
      saveActionMenuView.disableSaveButtons();
    }

    // 3. update list collections view with new model.state.collectionNames
    listCollectionView.render(model.state.collectionNames);

    // 4. hide confirmSaveMenuView + render display saved tabset/collection
    goToCollectionsMenu();

    // 5. render success message in display menu
  } catch (err) {
    console.log(`💥👾💥 ${err.message}`);
  }
};

const controlOpenCollection = async function (name) {
  try {
    const tabsOpened = await model.openCollection(name);
    console.log('tabs opened from controlOpenCollection');
    console.log(tabsOpened);
  } catch (err) {
    console.error(`💥 Control Open Collection:  ${err.message}`);
  }
};

// Delete list items
const controlDeleteTab = function (dataId) {
  // Delete the tab from state using url as id
  model.deleteTab(dataId);
  // Re-render the listTabView
  listTabView.render(model.state.selectedTabs.tabsArr);
};

const controlDeleteCollection = async function (dataId) {
  try {
    // Delete collection from state and storage using name as id
    await model.deleteCollection(dataId);
    // Re-render the listCollectionView
    listCollectionView.render(model.state.collectionNames);

    // If there IS storage space, enable buttons
    if (!(await model.checkStorageSpace()))
      saveActionMenuView.enableSaveButtons(); // effectively does nothing if they are already enabled.
  } catch (err) {
    console.error(`💥 controlDeleteCollection:  ${err.message}`);
  }
};

document
  .querySelector('.manage__link')
  .addEventListener('click', model.checkStorage);

const init = function () {
  navigationView.handleClickDot(controlNav);
  navigationView.handleArrowKey(controlNav);

  saveActionMenuView.handleOpenPopup(controlOpenPopup);
  saveActionMenuView.handleSaveWindow(controlSaveByWindow);
  //   saveActionMenuView.handleSaveSelectTabs(handler);
  //   saveActionMenuView.handleSaveByUrl(controlSaveWindow);

  collectionsMenuView.handleOpen(controlOpenCollection);

  // register save button
  // using event delegation -- button doesnt exist at initialization
  confirmSaveMenuView.handleConfirmSave(controlConfirmSave);

  listTabView.handleDeleteTab(controlDeleteTab);
  listCollectionView.handleDeleteTab(controlDeleteCollection);
};

init();
