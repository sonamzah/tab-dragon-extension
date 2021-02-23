/**
 * POPUP.js IS the 'CONTROLLER'
 */
import * as model from './model.js';
import navigationView from './views/navigationView.js';
import saverView from './views/saverView.js';
import confirmSaveView from './views/confirmSaveView.js';
import displayCollectionsView from './views/displayCollectionsView.js';

import { isString } from './helpers.js';

//Handles displayCollectionsView.hide() and reset confirmSaveView to saverView
const goToSaverView = function () {
  if (model.state.currentUI.saverView) return;
  if (model.state.currentUI.displayCollectionsView) {
    navigationView.toggleDarkenDot();
    displayCollectionsView.hide();
  }
  // No toggle darken needed if currentUI === confirm view
  confirmSaveView.hide();

  saverView.show();
  model.updateCurrentUI('saverView'); // Update state.currentUI
};
const goToConfirmView = function () {
  if (model.state.currentUI.confirmSaveView) return;
  //
  saverView.hide(); //confirm view only accessable from saveView
  confirmSaveView.render(model.state.selectedTabs.tabsArr).show();
  model.updateCurrentUI('confirmSaveView'); // Update state.currentUI
};
//Handles saverView.hide() and confirmSaveView.hide()
const goToDisplayView = function () {
  if (model.state.currentUI.displayCollectionsView) return;

  navigationView.toggleDarkenDot(); // Change dark nav dot
  saverView.hide();
  confirmSaveView.hide();
  //todo:: add update method
  displayCollectionsView.render(model.state.collectionNames).show();
  model.updateCurrentUI('displayCollectionsView'); // Update state.currentUI
};

//*************************************** */
//todo:: figure out how to style the animated slide in
//**************************************** */
const controlNav = function (direction) {
  //   if (!isString(direction)) return;
  console.log(direction);
  if (model.state.currentUI.confirmSaveView) alert('cancel save?');

  if (direction === 'left') goToSaverView();
  if (direction === 'right') goToDisplayView();
};

const controlOpenPopup = async function () {
  try {
    model.updateState();
  } catch (err) {
    console.log(`💥👾💥 Control Open Popup: ${err.message}`);
  }
};

const controlSaveByWindow = async function () {
  try {
    // 1. Put tabs' urls in model.state
    // (Async call to chrome.tabs by model)
    await model.allTabsFromWindow();

    // 2. Render confirmation to save tab-set page
    goToConfirmView();
  } catch (err) {
    console.log(err);
  }
};

const controlConfirmSave = async function () {
  try {
    // 1. Get the name of tab collection & pass it to model
    const name = confirmSaveView.getSaveName();
    if (!name) return alert('Please enter a name!');

    //TODO 1.1 check if collection name exists (otherwise it will override state)

    // 2. Save the current set of tabs to chrome.storage.sync
    const saved = await model.saveCollection(name);
    console.log(`saved name: ${saved}`);

    // 3. hide confirmSaveView + render display saved tabset/collection
    goToDisplayView();

    // 4. render success message in display menu

    //   todo: pick a phrase tab-set or tab collection and stick with it
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

const init = function () {
  navigationView.handleClickDot(controlNav);
  navigationView.handleArrowKey(controlNav);

  saverView.handleOpenPopup(controlOpenPopup);
  saverView.handleSaveWindow(controlSaveByWindow);
  //   saverView.handleSaveSelectTabs(handler);
  //   saverView.handleSaveByUrl(controlSaveWindow);

  displayCollectionsView.handleOpen(controlOpenCollection);

  // register save button
  // using event delegation -- button doesnt exist at initialization
  confirmSaveView.handleConfirmSave(controlConfirmSave);
};

init();
