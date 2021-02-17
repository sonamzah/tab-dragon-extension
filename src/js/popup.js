/**
 * POPUP.js IS the 'CONTROLLER'
 */
import * as model from './model.js';
import navigationView from './views/navigationView.js';
import saverView from './views/saverView.js';
import confirmSaveView from './views/confirmSaveView.js';
import displayCollectionsView from './views/displayCollectionsView.js';

import { isString } from './helpers.js';

//TODO:: add and remove hide from appropriate
const controlNav = function (direction) {
  //   if (!isString(direction)) return;
  console.log(direction);
  if (direction === 'left') {
    // current UI === saverView
    if (model.state.currentUI.saverView) return;
    // current UI === cinfirmSaveView
    if (model.state.currentUI.confirmSaveView) {
      alert('cancel save?');
      saverView.render({});
      model.updateCurrentUI('saverView'); //update state
    }
    // current UI === displayCollectionsView
    if (model.state.currentUI.displayCollectionsView) {
      saverView.render({});
      model.updateCurrentUI('saverView'); //update state
    }
  }
  if (direction === 'right') {
    // current UI === saverView
    if (model.state.currentUI.saverView) {
      displayCollectionsView.render(model.state.collectionNames);
      model.updateCurrentUI('displayCollectionsView'); //update state
    }
    // current UI === cinfirmSaveView
    if (model.state.currentUI.confirmSaveView) {
      alert('cancel save?');
      displayCollectionsView.render(model.state.collectionNames);
      model.updateCurrentUI('displayCollectionsView'); //update state
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
    confirmSaveView.render(model.state.selectedTabs.tabsArr);
  } catch (err) {
    console.log(err);
  }
};

//TODO: remove this
let savename;

const controlConfirmSave = async function () {
  try {
    // 1. Get the name of tab collection & pass it to model
    const name = confirmSaveView.getSaveName();
    if (!name) return alert('Please enter a name!');

    // 1.1 check if collection name exists (otherwise it will override state)

    // 2. Save the current set of tabs to chrome.storage.sync
    const saved = await model.saveCollection(name);
    console.log(`saved name: ${saved}`);

    //TODO: remove this too
    savename = saved;

    // 3. hide confirmSaveView + trigger display saved tabset/collection
    confirmSaveView.hide();
    displayCollectionsView.render(model.state.collectionNames).show();

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

  //TODO: this is just to
  document.querySelector('.manage__link').addEventListener('click', checkOpen);
};

//no longer needed
const checkOpen = async function () {
  try {
    //returns object of array of objects { [ {}, {}, {}, ... ] }
    const results = await model.openCollection(savename);
    console.log('object to open:');
    return console.log(results);
  } catch (err) {
    console.error(`💥👾💥 checkOpen: ${err.message}`);
  }
};

init();
