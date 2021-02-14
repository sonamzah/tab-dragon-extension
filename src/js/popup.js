/**
 * POPUP.js IS the 'CONTROLLER'
 */
import * as model from "./model.js";
import confirmSaveView from "./views/confirmSaveView.js";
import saverView from "./views/saverView.js";

const controlSaveWindow = async function () {
  //   const data = allTabsFromWindow();
  try {
    await model.allTabsFromWindow();

    // const markup = await confirmSaveView.generateMarkup(
    //   model.state.selectedTabs.tabsArr
    // );
    // console.log(markup);
    // model.state.selectedTabs.tabsArr;
    confirmSaveView.render(model.state.selectedTabs.tabsArr);

    //   model.allTabsFromWindow();
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  //   saverView.message();
  saverView.handleSaveWindow(controlSaveWindow);
  //   saverView.handleSaveSelectTabs(handler);
  //   saverView.handleSaveByUrl(controlSaveWindow);
};
init();
