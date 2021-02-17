/**
 * POPUP.js IS the 'CONTROLLER'
 */
import * as model from './model.js';
import saverView from './views/saverView.js';
import confirmSaveView from './views/confirmSaveView.js';
import displayCollectionsView from './views/displayCollectionsView.js';

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
  //   saverView.message();
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
