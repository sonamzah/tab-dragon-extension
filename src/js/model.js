import { setStorage, getStorage, clearSyncStorage } from './storage.js';

export const state = {
  selectedTabs: {
    //Todo rename booleans to more informative names
    // byWindow: false,
    // byTab: false,
    // byUrl: false,
    tabsArr: [],
  },
  savedTabs: [],
};

//*******RESET*STORAGE*******/
//***************************/
clearSyncStorage();
//***************************/

const changeTabUrl = function () {
  chrome.tabs.update({ url: 'https://mail.google.com/mail/u/0/?tab=rm' });
};

//Promisified to handle the asynchronous behavior of chrome.tabs.query!
export const allTabsFromWindow = function () {
  return new Promise((resolve, reject) => {
    try {
      console.log('inside model.allTabsFromWin promise');
      //todo: reset these before setting this somehwere
      //   state.selectedTabs.byWindow = true;

      chrome.tabs.query(
        { windowId: chrome.windows.WINDOW_ID_CURRENT },
        tabs => {
          state.selectedTabs.tabsArr = tabs;
          resolve(console.log('promise fulfilled bitch!'));
          // console.log("state after tabs.query");
          //   console.log(state);
        }
      );
    } catch (err) {
      console.log(err.message);
      reject(err);
    }
  });
};

///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// Prunes the properties of the original tab object
// so less data needs to be saved to chrome.storage.sync
const createTabObject = function (tabData) {
  return {
    favIconUrl: tabData.favIconUrl,
    height: tabData.height,
    width: tabData.width,
    id: tabData.id,
    index: tabData.index,
    pinned: tabData.pinned,
    title: tabData.title,
    url: tabData.url,
    windowId: tabData.windowId,
  };
};

export const saveCollection = async function (name) {
  try {
    state.savedTabs.push(name); //necessary for re-opening

    const { tabsArr } = state.selectedTabs;

    const value = tabsArr.map(tab => createTabObject(tab));
    console.log(value);

    // setStorage returns the name of the saved tabset/collection
    return await setStorage({ [name]: value }); // use computed property name [name]}
  } catch (err) {
    console.error(`💥 save collection: ${err.message}`);
    throw err;
  }
};

// NOTE :: This only returns one named collection at at time.
//returns object of array of (tab) objects { [ {}, {}, {}, ... ] }
export const getCollection = async function (name) {
  try {
    return getStorage(name);
  } catch (err) {
    console.error(`💥 get collection:  ${err.message}`);
    throw err;
  }
};

///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//***** set these when reopening the tabs:
//*** OPTION: OPEN IN TABGROUPS?
// active: false;
// audible: false;
// autoDiscardable: true;
// discarded: false;
// incognito: false;
// highlighted: false; //active tab does this happen automatically

//*** DONT CARE ABOUTS
// groupId: -1; //(UNLESS OPENING IN GROUP!)
// mutedInfo: muted: false;
// status: 'complete';

// favIconUrl: 'https://www.sitepoint.com/favicon-32x32.png?v=e11847cefe0aa15a5bc8386ead113f61';
// height: 831;
// width: 1680;
// id: 599;
// index: 0;

// pinned: false;

// title: 'How to Create a Chrome Extension in 10 Minutes Flat - SitePoint';
// url: 'https://www.sitepoint.com/create-chrome-extension-10-minutes-flat/';
// windowId: 598;
