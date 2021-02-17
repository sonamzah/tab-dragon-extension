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
  displayCollectionsView.hide(); // Doesnt change if already hidden
  saverView.render({}).show();
  model.updateCurrentUI('saverView'); // Update state.currentUI
};
const goToConfirmView = function () {
  confirmSaveView.render(model.state.selectedTabs.tabsArr);
  model.updateCurrentUI('confirmSaveView'); // Update state.currentUI
};
//Handles saverView.hide() and confirmSaveView.hide()
const goToDisplayView = function () {
  saverView.hide();
  displayCollectionsView.render(model.state.collectionNames).show();
  model.updateCurrentUI('displayCollectionsView'); // Update state.currentUI
};

//*************************************** */
//TODO:: add and remove hide from appropriate
//todo:: set model.currentUI.confirmSaveView to true when its rendered
//todo:: fill the dot to darker
//todo:: figure out how to style the animated slide in
//**************************************** */

const controlNav = function (direction) {
  //   if (!isString(direction)) return;
  console.log(direction);
  if (direction === 'left') {
    // current UI === saverView
    if (model.state.currentUI.saverView) return;
    // current UI === confirmSaveView
    if (model.state.currentUI.confirmSaveView) {
      alert('cancel save?');
      goToSaverView();
    }
    // current UI === displayCollectionsView
    if (model.state.currentUI.displayCollectionsView) {
      goToSaverView();
    }
  }
  if (direction === 'right') {
    // current UI === saverView
    if (model.state.currentUI.saverView) {
      goToDisplayView();
    }
    // current UI === confirmSaveView
    if (model.state.currentUI.confirmSaveView) {
      alert('cancel save?');
      goToDisplayView();
    }
    // current UI === displayCollectionsView
    if (model.state.currentUI.displayCollectionsView) return;
  }

  // current UI === saverView
  //    direction === 'left'
  //    direction === 'right'
  // current UI === cinfirmSaveView
  //    direction === 'left'
  //    direction === 'right'
  // current UI === displayCollectionsView
  //    direction === 'left'
  //    direction === 'right'
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
