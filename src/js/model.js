// import { set } from 'core-js/fn/dict';
import { setStorage, getStorage, clearSyncStorage } from './storage.js';
import { isEmpty } from './helpers.js';

export const state = {
  selectedTabs: {
    //Todo rename booleans to more informative names
    // byWindow: false,
    // byTab: false,
    // byUrl: false,
    tabsArr: [],
  },
  collectionNames: [
    {
      name: 'pocket-rocker',
      tags: [],
      size: null,
    },
    {
      name: 'rekcor-tekcop',
      tags: [],
      size: null,
    },
  ],
};

//*******RESET*STORAGE*******/
//***************************/
// clearSyncStorage();
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
const createTabDataObj = function (tabData) {
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
const createCollectionDataObj = function (name, tags = []) {
  if (!name)
    return console.log('CreateCollectionDAtaObj -- Collection has no name wtf');
  return {
    name,
    tags,
    size: state.selectedTabs.tabsArr.length,
  };
};

export const saveCollection = async function (name) {
  try {
    // State.collection names should be updated from chrome.storage on load
    // so when saving in this function, the entire list of saved collection names is correctly updated

    //1. save the name of the collection saved for access to display on load browser action
    const collectionData = createCollectionDataObj(name);
    state.collectionNames.push(collectionData);
    await setStorage({ collectionNames: state.collectionNames });

    const { tabsArr } = state.selectedTabs;
    const value = tabsArr.map(tab => createTabDataObj(tab));

    // setStorage returns the name of the saved tabset/collection
    return await setStorage({ [name]: value }); // use computed property name [name]}
  } catch (err) {
    console.error(`💥 save collection: ${err.message}`);
    throw err;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////

// NOTE :: This only returns one collection (by name) at at time.
// Returns object of array of (tab) objects { [ {}, {}, {}, ... ] }
export const getCollection = async function (name) {
  try {
    return getStorage(name);
  } catch (err) {
    console.error(`💥 get collection:  ${err.message}`);
    throw err;
  }
};

export const getCollectionNames = async function () {
  try {
    return getStorage('collectionNames');
  } catch (err) {
    console.error(`💥 get collection names:  ${err.message}`);
    throw err;
  }
};

// Returns array of urls from a collection's tab data
export const getUrls = function (tabsData) {
  return tabsData.map(tab => tab.url);
};

//Name is the key for data in storage
export const openCollection = async function (name) {
  try {
    // 1. Use name to get collections tab data from storage.sync
    const { [name]: tabsData } = await getCollection(name);
    // 2. Extract urls from the stored tab data
    const urlArray = getUrls(tabsData);
    // 3. Create 'options' object with urlArray and other data stored @ save event
    //TODO :: save and load more options about the window object!
    // 4. Open window
    //todo Promisify?
    chrome.windows.create({ url: urlArray }, chromeWin => {
      console.log('Opening worked!');
      console.log(chromeWin);
    });
    return tabsData;
  } catch (err) {
    console.error(`💥 Open Collection:  ${err.message}`);
    throw err;
  }
};

export const updateState = async function () {
  try {
    console.log('im loading!');
    const { collectionNames } = await getCollectionNames();
    //TODO :: remove console.logs
    if (!collectionNames || isEmpty(collectionNames))
      return console.log('nothing in storage');

    state.collectionNames = collectionNames;
    console.log(state.collectionNames);
  } catch (err) {
    console.error(`💥 update state:  ${err.message}`);
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

///////////////////////////////////

// needed from first tab for window creation

// height: 831;
// width: 1680;
