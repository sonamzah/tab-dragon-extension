/**
 * POPUP.js IS the 'CONTROLLER'
 */
import saverView from "./views/saverView.js";

const allTabsFromWindow = function () {
  alert("dubai");
  return 23;
  //   return chrome.tabs.query(
  //     { windowId: chrome.windows.WINDOW_ID_CURRENT },
  //     (tabs) => tabs
  //   );
};

const controlSaveWindow = function () {
  const data = allTabsFromWindow();
  console.log(data);
};

const init = function () {
  //   saverView.message();
  saverView.handleSaveWindow(controlSaveWindow);
};
init();
