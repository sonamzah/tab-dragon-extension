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
    navigationView.toggleNavActive();
    collectionsMenuView.hide();
  }
  // No toggle darken needed if currentUI === confirm view
  if (model.state.currentUI.confirmMenu) {
    confirmSaveMenuView.clearInput();
    // Change left nav text content - 'Save'
    navigationView.displayTitleSave();
    confirmSaveMenuView.hide();
  }

  saveActionMenuView.show();
  model.updateCurrentUI('saveActionMenu'); // Update state.currentUI
};
const goToConfirmMenu = function () {
  if (model.state.currentUI.confirmMenu) return;

  saveActionMenuView.hide(); //confirm view only accessable from saveView

  // Change left nav text content - 'Confirm'
  navigationView.displayTitleCofirm();

  confirmSaveMenuView.show();
  model.updateCurrentUI('confirmMenu'); // Update state.currentUI

  confirmSaveMenuView.focusInput(); // WORKS NOW!
};
//Handles saveActionMenuView.hide() and confirmSaveMenuView.hide()
const goToCollectionsMenu = function () {
  if (model.state.currentUI.collectionsMenu) return;
  if (model.state.currentUI.confirmMenu) {
    confirmSaveMenuView.clearInput();
    // Change left nav text content - 'Save'
    navigationView.displayTitleSave();
    confirmSaveMenuView.hide();
  }

  navigationView.toggleNavActive(); // Change dark nav dot

  saveActionMenuView.hide(); // Doesnt affect if its already hidden, no if-check needed

  collectionsMenuView.show();
  model.updateCurrentUI('collectionsMenu'); // Update state.currentUI
};

//**************************************** */
//todo:: figure out how to style the animated slide in
//**************************************** */
const controlNav = function (direction) {
  if (model.state.currentUI.confirmMenu) {
    const userRes = confirm('Cancel saving this collection?');
    if (!userRes) return;
  }

  if (direction === 'left') goToSaveActionMenu();
  if (direction === 'right') goToCollectionsMenu();
};

//TODO! put in init?
const controlOpenPopup = async function () {
  try {
    // 1. Initialize state - set model.state.collectionNames FROM storage.sync
    await model.initializeState();
    console.log('openPop -- collectionNames: ', model.state.collectionNames);
    // 1.1 render those initialized names
    listCollectionView.render(model.state.collectionNames); // Render collection list in collection menu

    // 2 if there is NO storage space, disable buttons
    if (await model.checkStorageSpace()) {
      saveActionMenuView.disableSaveButtons();
    }
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
    listTabView.render(model.state.selectedTabs.tabs);

    // 3.1 Change left nav text content - 'Confirm'
    // navigationView.displayTitleCofirm();

    // 3 Show confirmation to save menu
    goToConfirmMenu();
  } catch (err) {
    console.log(err);
  }
};

const controlConfirmSave = async function (confirmed = false) {
  try {
    // 1. Get the name of tab collection & pass it to model
    const name = confirmSaveMenuView.getSaveName();
    if (!name) return alert('Please enter a name!');

    //NOTE ::  store and check resolved val of this call -- move on or render message??
    // 2. Save the current set of tabs to chrome.storage.sync
    await model.saveCollection(name, confirmed); // pushes to model.state.collectionNames

    // 2.1 Clear name input form field
    confirmSaveMenuView.clearInput();

    // 2.2 if there is NO storage space, disable buttons
    // (Alternative to this function check, One could use the storageSpace object
    // in model.state and write an explicit check this might be more clear to read and understand)
    if (await model.checkStorageSpace()) {
      saveActionMenuView.disableSaveButtons();
    }

    // 3. update list collections view with new model.state.collectionNames
    listCollectionView.render(model.state.collectionNames);

    // 4. hide confirmSaveMenuView + display saved tabset/collection
    goToCollectionsMenu();

    // 5. render success message in display menu
    // if(confirmed) alertmessage.render('*name* was overwritten')
  } catch (err) {
    // TODO :: add a render message method to view! -- modal with message.
    if (err.name === 'NameExists') {
      //   const userRes = confirmMessage.render(err.message);
      const userRes = confirm(err.message);
      if (!userRes) return;
      controlConfirmSave(true);

      return;
    } // else
    // alertMessage.render(err.message);
    alert(`🐲 ${err.message}`);
  }
};

const controlOpenCollection = async function (name, incognito) {
  try {
    const tabsOpened = await model.openCollection(name, incognito);
    console.log('tabs opened from controlOpenCollection');
    console.log(tabsOpened);
  } catch (err) {
    console.error(`💥 Control Open Collection:  ${err.message}`);
  }
};

// Confirm deletion of item
const confirmDelMessage = function (item) {
  //Todo: change this to rendering custom confrim message
  //const userRes =  confirmMessage.render(message)
  return confirm(`Delete this ${item}?`);
};

//TODO! add error message when all tabs are deleted from confirm save tabs --
//TODO!  or prevent deleting when only on tab remains
// Delete list items
const controlDeleteTab = function (dataId) {
  // Render confirm-deletion-message -- exit deletion if canceled
  //TODO -- instead of confirming -> make an undo button or a deletion history(?) --
  //TODO -- store the deleted in an array until popup is closed then that dat will not persist!
  //   const userRes = confirmDelMessage('tab');
  //   if (!userRes) return;

  // Delete the tab from state using url as id
  model.deleteTab(dataId);
  // Re-render the listTabView
  listTabView.render(model.state.selectedTabs.tabs);
};

const controlDeleteCollection = async function (dataId) {
  try {
    // Render confirm-deletion-message -- exit deletion if canceled
    const userRes = confirmDelMessage('collection');
    if (!userRes) return;
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

// document
//   .querySelector('.manage__link')
//   .addEventListener('click', model.checkStorage);

const init = function () {
  navigationView.handleClickDot(controlNav);
  navigationView.handleArrowKey(controlNav);

  saveActionMenuView.handleOpenPopup(controlOpenPopup);
  saveActionMenuView.handleSaveWindow(controlSaveByWindow);
  //   saveActionMenuView.handleSaveSelectTabs(handler);
  //   saveActionMenuView.handleSaveByUrl(controlSaveWindow);

  collectionsMenuView.handleOpen(controlOpenCollection);

  // register save button -- uses event delegation
  confirmSaveMenuView.handleConfirmSave(controlConfirmSave);

  listTabView.handleDeleteTab(controlDeleteTab);
  listCollectionView.handleDeleteTab(controlDeleteCollection);
};

init();
