// import { set } from 'core-js/fn/dict';
import {
  setStorage,
  getStorage,
  clearSyncStorage,
  removeStorage,
} from './storage.js';
import { isEmpty, calcBytes } from './helpers.js';
import { STORAGE_PADDING_BYTES } from './config.js';
// import { stat } from 'fs/promises';

export const state = {
  selectedTabs: {
    //Todo rename booleans to more informative names
    // byWindow: false,
    // byTab: false,
    // byUrl: false,
    tabsArr: [],
  },
  collectionNames: [
    // {
    //   name: 'pocket-rocker',
    //   tags: [],
    //   size: null,
    // },
    // {
    //   name: 'rekcor-tekcop',
    //   tags: [],
    //   size: null,
    // },
  ],
  storageSpace: {
    bytesUsed: 0,
    numItems: 0,
  },
  currentUI: {
    saveActionMenu: true,
    confirmMenu: false,
    collectionsMenu: false,
  },
};

// Updates the currentUI state property, sets all to false except
// for current UI passed in as a string argument
export const updateCurrentUI = function (current) {
  const currentUI = {
    saveActionMenu: false,
    confirmMenu: false,
    collectionsMenu: false,
  };
  if (!Object.keys(currentUI).includes(current))
    return console.error(
      'updateCurrentUI wrong property name specified -- must be string' //TODO remove this later
    );

  currentUI[current] = true;
  state.currentUI = currentUI;
  return;
};

//*******RESET*STORAGE*******/
//***************************/
// clearSyncStorage();
//***************************/

// const changeTabUrl = function () {
//   chrome.tabs.update({ url: 'https://mail.google.com/mail/u/0/?tab=rm' });
// };

export const initializeState = async function () {
  try {
    console.log('im loading!');
    const { collectionNames } = await getCollectionNames();

    //TODO :: remove console.logs
    // TODO :: TEST TEST TEST THIS
    // TEST this by deleting everything then checking console
    if (!collectionNames || isEmpty(collectionNames))
      return console.log('nothing in storage');

    state.collectionNames = collectionNames;
    console.log(state.collectionNames);

    await updateStateStorageData();
    //this will be abstracted, see below
    // state.storageSpace.bytesUsed = await storageBytes();
    // state.storageSpace.numItems = await storageNumItems();
    // console.log('storageSpace.bytesUsed', state.storageSpace.bytesUsed);
    // console.log('storageSpace.numItems', state.storageSpace.numItems);
  } catch (err) {
    console.error(`💥 initialize state:  ${err.message}`);
    throw err;
  }
};

//change to update state storage or something
export const updateStateStorageData = async function () {
  try {
    state.storageSpace.bytesUsed = await storageBytes();
    state.storageSpace.numItems = await storageNumItems();
    console.log('storageSpace.bytesUsed', state.storageSpace.bytesUsed);
    console.log('storageSpace.numItems', state.storageSpace.numItems);
  } catch (err) {
    console.error(`💥 update state:  ${err.message}`);
    throw err;
  }
};

//Promisified to handle the asynchronous behavior of chrome.tabs.query!
export const allTabsFromWindow = function () {
  return new Promise((resolve, reject) => {
    try {
      //   console.log('inside model.allTabsFromWin promise');
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
  //Will have to add some transfer limit checks for this too once tags are implemented (checkBytesPerItem())
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
    state.collectionNames.push(collectionData); //TODO ---------IIIIIIII

    //NOTE: could do --
    // const collectionNames = await getCollectionNames().push(collectionData);
    // await setStorage({ collectionNames: collectionNames });

    await setStorage({ collectionNames: state.collectionNames });

    const { tabsArr } = state.selectedTabs;
    const value = tabsArr.map(tab => createTabDataObj(tab));

    // setStorage returns the name of the saved tabset/collection
    await setStorage({ [name]: value }); // use computed property name [name]}

    //NOTE: could do --
    // updateState(); // -- but update includes setting state.collectionNames from storage
    await updateStateStorageData();
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

////////////////////////////////////////////////////////////////////////////////////
export const deleteTab = function (delUrl) {
  // state.selectedTabs.tabsArr for each tab => if (tab.url === dataId)
  // 1. Get index of url to delete in the tabsArr
  const delIndex = state.selectedTabs.tabsArr.findIndex(
    tab => tab.url === delUrl
  );
  // 2. Use splice to delete the specified url (parameter: delUrl)
  state.selectedTabs.tabsArr.splice(delIndex, 1);
};

// Todo:: deleteCollection(){}
export const deleteCollection = async function (delName) {
  try {
    // 1. Delete collection from state.collectionNames
    // 1.a Get index of url to delete in the tabsArr
    const delIndex = state.collectionNames.findIndex(
      collection => collection.name === delName
    );
    // 1.b Use splice to delete the specified collectionName (parameter: delName)
    state.collectionNames.splice(delIndex, 1);
    // testing
    console.log('State.collectionNames');
    console.log(state.collectionNames);

    // 2. Set storage.collectionNames = state.collectionNames (which just had collection delName deleted)
    await setStorage({ collectionNames: state.collectionNames });
    //testing
    console.log('storage.collectionNames');
    const collNames = await getCollectionNames();
    console.log(collNames);

    // 3. Delete collection in question from storage.sync
    const check = await removeStorage(delName);

    await updateStateStorageData();
    //test
    console.log('Deleted collection Name');
    console.log(check);

    //test
    console.log('all contents in Storage');
    const storageCheck = await getCollection(null);
    console.log(storageCheck);

    ///////////////////////////////////
    //   Remove delName from storage
  } catch (err) {
    console.error(`💥 Open Collection:  ${err.message}`);
    throw err;
  }
};

//////////////////////////////////////////////////////////////////

export const collectionExists = function (name) {
  return state.collectionNames.some(collection => collection.name === name);
};

const collectionBytes = function (key) {
  // NOTE :: may need to change this when implementing get bytes
  const size = calcBytes({ [key]: state.selectedTabs.tabsArr });
  return size;
};

// Returns true if object to be saved is greater or equal to the maximum
// number of bytes that can be saved to chrome.storage.sync at a time
export const checkBytesPerItem = function (key) {
  //   const keySize = calcBytes(key);
  //   // NOTE :: may need to change this when implementing get bytes
  //   const valSize = calcBytes(state.selectedTabs.tabsArr);
  const size = collectionBytes(key);

  if (size >= chrome.storage.sync.QUOTA_BYTES_PER_ITEM) return true;

  return false;
};

const storageBytes = async function () {
  try {
    const storage = await getCollection(null);
    const storageSize = calcBytes(storage);
    return storageSize;
  } catch (err) {
    console.error(`💥 storageBytes:  ${err.message}`);
    throw err;
  }
};

// Returns true if bytes in storage (+ bytes of collection to be saved) is at maximum capacity
const checkStorageMaxBytes = async function (collectionSize = null) {
  try {
    const storageSize = await storageBytes();

    console.log(
      'chrome.storage.sync.QUOTA_BYTES: ',
      chrome.storage.sync.QUOTA_BYTES
    );
    console.log('storageSize ', storageSize);
    console.log('collectionSize ', collectionSize);
    console.log(
      `checkStorageMaxBytes() -- Storage size: ${storageSize}, Strg Size + CollectionSIze: ${
        storageSize + collectionSize
      }`
    );
    // For storage check SANS collection-to-save --
    // Checking if storage is at its max limit QUOTA_BYTES (step 2.2 in popup.controlConfirmSave())
    if (
      !collectionSize &&
      storageSize > chrome.storage.sync.QUOTA_BYTES - STORAGE_PADDING_BYTES
    )
      return true;

    // For save --
    // Checking if collection-to-be-saved can fit into storage without reaching storage limit QUOTA_BYTES
    if (
      //   storageSize === chrome.storage.sync.QUOTA_BYTES ||
      storageSize + collectionSize >=
      chrome.storage.sync.QUOTA_BYTES
    )
      return true;

    console.log('if-block not met');
    return false;
  } catch (err) {
    console.error(`💥 checkStorageMaxBytes:  ${err.message}`);
    throw err;
  }
};

const storageNumItems = async function () {
  try {
    const storage = await getCollection(null);
    const storageLength = Object.keys(storage).length;
    return storageLength;
  } catch (err) {
    console.error(`💥 storageNumItems:  ${err.message}`);
    throw err;
  }
};
// Returns true if # items in storage is at maximum capacity (chrome.storage.sync.MAX_ITEMS)
const checkStorageMaxItems = async function () {
  try {
    console.log(
      `chrome.storage.sync.MAX_ITEMS: ${chrome.storage.sync.MAX_ITEMS}`
    );
    const storageLength = await storageNumItems();
    console.log(`Storage length: ${storageLength}`);

    if (storageLength === chrome.storage.sync.MAX_ITEMS) return true;

    return false;
  } catch (err) {
    console.error(`💥 checkStorageMaxBytes:  ${err.message}`);
    throw err;
  }
};

//TODO :: DONT FORGET TO ADD the state -- storage bytes and update it when add/remove
//TODO! change name to storageIsMaxed()
export const checkStorageSpace = async function (key = '') {
  try {
    const collectionSize = collectionBytes(key);
    console.log(
      'collection size (inside checkstoragespace func)',
      collectionSize
    );
    const storageItemsCheck = await checkStorageMaxItems();
    // If YES key, check if collection-to-save will fit into storage -- pass in collectionSize
    // If NO key only check if current storage bytes are maxed (QUOTA_BYTES)
    const storageBytesCheck = key
      ? await checkStorageMaxBytes(collectionSize)
      : await checkStorageMaxBytes();

    console.log(storageBytesCheck, storageItemsCheck);

    return storageItemsCheck || storageBytesCheck;
  } catch (err) {
    console.error(`💥 checkStorageSpace:  ${err.message}`);
    throw err;
  }
};
// TODO ::: Use collectionBytes in this funct and pass in optional argument(?)
//*********************************** */
//TODO :::::******** ADD STORAGE BYTES TO STATE AND UPDATE IT EVERY SAVE AND DEL ***********

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
