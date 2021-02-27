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
    await model.updateState();
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

    //TODO 1.1 check if collection name exists (otherwise it will override state)

    // 2. Save the current set of tabs to chrome.storage.sync
    const saved = await model.saveCollection(name);
    console.log(`saved name: ${saved}`);

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
  } catch (err) {
    console.error(`💥 controlDeleteCollection:  ${err.message}`);
  }
};

document
  .querySelector('.manage__link')
  .addEventListener('click', model.checkStorage());

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
