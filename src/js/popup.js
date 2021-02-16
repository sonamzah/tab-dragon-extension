/**
 * POPUP.js IS the 'CONTROLLER'
 */
import * as model from './model.js';
import saverView from './views/saverView.js';
import confirmSaveView from './views/confirmSaveView.js';
import displayCollectionsView from './views/displayCollectionsView.js';

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

let savename;

const controlConfirmSave = async function () {
  try {
    // 1. Get the name of tab collection & pass it to model
    const name = confirmSaveView.getSaveName();
    if (!name) return alert('Please enter a name!');

    // 2. Save the current set of tabs to chrome.storage.sync
    const saved = await model.saveCollection(name);
    console.log(`saved name: ${saved}`);

    savename = saved;

    // 3. hide confirmSaveView + trigger display saved tabset/collection
    confirmSaveView.hide();
    displayCollectionsView.render(model.state.selectedTabs.tabsArr).show();
    // 4. render success message in display menu

    //   todo: pick a phrase tab-set or tab collection and stick with it
  } catch (err) {
    console.log(`💥👾💥 ${err.message}`);
  }
};

const init = function () {
  //   saverView.message();
  saverView.handleSaveWindow(controlSaveByWindow);
  //   saverView.handleSaveSelectTabs(handler);
  //   saverView.handleSaveByUrl(controlSaveWindow);

  // register save button
  // using event delegation -- button doesnt exist at initialization
  confirmSaveView.handleConfirmSave(controlConfirmSave);

  //this is just to test
  document.querySelector('.manage__link').addEventListener('click', checkGet);
};

const checkGet = async function () {
  try {
    //returns object of array of objects { [ {}, {}, {}, ... ] }
    const results = await model.getCollection(savename);
    console.log('results:');
    return console.log(results);
  } catch (err) {
    console.error(`💥👾💥 checkGet: ${err.message}`);
  }
};

init();
