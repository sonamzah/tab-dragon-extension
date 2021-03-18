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
    tabs: [],
    // tags: [],
  },
  collectionNames: [
    // {
    //   name: 'pocket-rocker',
    //   tags: [], // Not for save to storage
    //   size: null, // Not for save to storage
    //   favIconUrls: [], // Not for save to storage
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
  deleted: {
    tabs: {},
    collections: {},
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

const getFavIconUrls = function (collection) {
  return collection.map(tab => tab.favIconUrl);
};
// TODO! ****** MAKE each collection OBJ be an 1. ARRAY of tab objs 2. ARRAY of Tags
// TODO! ***** collections = { name1:
// TODO!                           { Tabs: [tabObj1, tabObj2],
// TODO!                              Tags: [_,_,_]
// TODO!                                    }}
// TODO! ******** THEN NEED TO REFERENCE COLLECTIONS APPROPRIATELY IN ALL PLACES (SAVE, OPEN, DELETE)
// TODO!        ANY place referencing or setting the *tabObjectS* array FROM STORAGE
//generates the collectionNames array (containing CollectionDataObjs) from the collections saved to storage
//NOTE :: this function mutates parameter/original array!!! (BC objects within array are being mutated)
export const retrieveCollectionData = async function (collectionNames = []) {
  try {
    //TODO!!! ADD A CHECK TO SEE IF COLLECTION NAMES IS SAME SIZE AS STORAGE.length -1
    // THROW ERROR AND CATCH IT INSIDE INITIALIZE
    const storage = await getCollection(null); // All items in storage
    console.log('storage: ', storage);
    // 2. for each collection
    const populatedNames = collectionNames.map(dataObj => {
      // console.log('retrieve -- dataObj: ', dataObj);
      const collection = storage[dataObj.name];

      const newData = {
        name: dataObj.name,
        size: collection.length,
        tags: [], // tags: collection.tags?,
        favIconUrls: getFavIconUrls(collection),
      };
      // console.log('newData', newData);
      return newData;
    });
    // console.log('popnames', populatedNames);
    return populatedNames;
  } catch (err) {
    console.error(`💥 get collection names:  ${err.message}`);
    throw err;
  }
};

export const initializeState = async function () {
  try {
    console.log('im loading!');
    const { collectionNames } = await getCollectionNames(); // NEED THIS
    console.log('initState -- collectionNames: ', collectionNames);

    // console.log(await retrieveCollectionData(collectionNames));
    // await populateCollectionNames(); // Use this to reset collectionNames if accidentally deleted (in development) and then comment out line 83

    //TODO :: remove console.logs
    // TODO :: TEST TEST TEST THIS
    // TEST this by deleting everything then checking console
    if (!collectionNames || isEmpty(collectionNames))
      // think i need this?
      // return or throw err -> welcome message(?)
      return console.log('nothing in storage'); // think i need this?

    // state.collectionNames = collectionNames; // NEED THIS?
    state.collectionNames = await retrieveCollectionData(collectionNames);
    console.log(state.collectionNames);

    await updateStateStorageData();
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

//TODO! rename save session
//Promisified to handle the asynchronous behavior of chrome.tabs.query!
export const allTabsFromWindow = function () {
  return new Promise((resolve, reject) => {
    try {
      //   console.log('inside model.allTabsFromWin promise');
      //todo: reset these before setting this somehwere
      //   state.selectedTabs.byWindow = true;

      // API passes tabs --an array of tab objects with many tabdata properties--
      // into callback for processing
      chrome.tabs.query(
        { windowId: chrome.windows.WINDOW_ID_CURRENT },
        tabs => {
          chrome.runtime.lastError
            ? reject(new Error(chrome.runtime.lastError.message))
            : resolve((state.selectedTabs.tabs = tabs));
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
    // ADD THIS TO createCollectionDataObj TOO???
    byTabDragon: true,
  };
};
// TODO -- next round -- add more metadata to sort the collections by! then you can use populateCollectionNames below
const createCollectionDataObj = function (name, favIconUrls = []) {
  if (!name)
    return console.log('CreateCollectionDAtaObj -- Collection has no name wtf');
  console.log(state.selectedTabs.tabs.length);
  //Will have to add some transfer limit checks for this too once tags are implemented (checkBytesPerItem())
  return {
    name,
    tags: [],
    size: state.selectedTabs.tabs.length,
    favIconUrls,
  };
};

//TODO __ REMOVE THIS LATER (?)
// needed this to get collectionNames back after accidentally deleting it... reason not use it is because
// I dont want the order of data to be lost... if more meta-data is added later you can sort it always after populating
// const populateCollectionNames = async function () {
//   try {
//     console.log('inside populate');
//     const collections = await getCollection(null);
//     console.log(collections);
//     // .entries creates an array of key-val pairs: [ [key0,val0], [key1,val1],... ] note -- could use descrtucturing for more legibilty
//     const collectionNames = Object.entries(collections)
//       .filter(coll => {
//         const [key] = coll;
//         return key !== 'collectionNames';
//       })
//       .map(coll => {
//         const [key, val] = coll;
//         return { name: key, tags: [], size: val.length };
//         // coll[0];
//       });
//     // TODO connect this part when you reset storage -- want to be able to check if storage data is by tabdragon
//     //   .filter(
//     //     coll => coll[1].byTabDragon
//     //   )
//     //   .map(coll => {
//     //     const [key, val] = coll;
//     //     console.log(key);
//     //     return key;
//     //     // coll[0];
//     //   });
//     state.collectionNames = collectionNames;
//     // console.log(state.collectionNames);
//   } catch (err) {
//     throw err;
//   }
// };

// different from getCollectionNames -- extract returns an array containing only collection names and no other data.
const extractCollectionNames = function () {
  return state.collectionNames.map(dataObj => {
    return { name: dataObj.name };
  });
  // Note -- if you really want to save space dont return the array of objects, just the strings - dataObj.name
  // Note -- youd have to make changes to the way its accessed in retrieveCollectionData
};
export const saveCollection = async function (name, confirmed) {
  try {
    // State.collection names should be updated from chrome.storage on load
    // so when saving in this function, the entire list of saved collection names is correctly updated

    //----------GAURD CLAUSES START--------------
    // a. Check size in bytes of collection to save (including the name as key -- {name: [tabDat1,...tabDatN]}
    if (checkBytesPerItem(name))
      //''
      throw new Error(
        'This collection is to big to be saved all at once. Please delete some tabs!'
      );

    // b. Check if storage is too full to add collection
    if (await checkStorageSpace(name))
      // NOTE :: it would be cool if you could say how many... though you dont know how big data will be --- (pad it?)
      throw new Error(
        `Erm, storage is too full to save this collection. Try saving a smaller collection (by deleting some tabs) or deleting some of your existing collections.`
      );

    // Note :: this one maybe keep back in controlConfirm save so you can render a 'override?' popup
    // c. Check if collection name exists (otherwise it will override state)
    if (!confirmed && collectionExists(name)) {
      const err = new Error(
        'You already have a collection with this name. Do you want to overwrite it?'
      );
      err.name = 'NameExists';
      throw err;
    }
    //----------GAURD CLAUSES END--------------

    const { tabs } = state.selectedTabs; // Tab data from current session

    // 1est. Create array of favicons to pass into createCollectionDataObj()
    // const favIconUrls = tabs.map(tab => tab.favIconUrl);
    const favIconUrls = getFavIconUrls(tabs);
    console.log('favIconUrls -- ', favIconUrls);
    // 1. save the name of the collection saved for access to display on load browser action
    const collectionData = createCollectionDataObj(name, favIconUrls); //TODO -- add tags
    state.collectionNames.push(collectionData);
    console.log(state.collectionNames); // test

    // 1.1 create a mask from collection names with which to delete duplicates
    const arrayMask = state.collectionNames
      .map(coll => coll.name)
      .map((curName, index, self) =>
        self.lastIndexOf(curName) === index ? curName : null
      );
    // 1.2 remove duplicates
    state.collectionNames = state.collectionNames.filter(
      (value, index) => value.name === arrayMask[index]
    );

    //NOTE: could do --
    // const collectionNames = await getCollectionNames().push(collectionData);
    // await setStorage({ collectionNames: collectionNames });

    // console.log('extractCollectionNames: ', extractCollectionNames());

    // 2. put updated state.collectionNames in storage
    await setStorage({ collectionNames: extractCollectionNames() });
    // await setStorage({ collectionNames: state.collectionNames }); //old way

    // 3. Configure tab data for collection-to-be-saved
    const value = tabs.map(tab => createTabDataObj(tab)); // array of tab data Obj

    // 3.1 setStorage returns the name of the saved tabset/collection
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
// Returns object of array of (tab) objects { name: [ {}, {}, {}, ... ] } -- if null is passed in, all storage will be returned
export const getCollection = async function (name) {
  try {
    return getStorage(name);
  } catch (err) {
    console.error(`💥 get collection:  ${err.message}`);
    throw err;
  }
};
// returns { collectionNames: [ {name: name1}, {name: name2}, {name: name3}, ... ] }
export const getCollectionNames = async function () {
  try {
    return getStorage('collectionNames');
  } catch (err) {
    console.error(`💥 get collection names:  ${err.message}`);
    throw err;
  }
};

// Returns array of urls from a collection's tab data
export const getUrls = function (collection) {
  return collection.map(tab => tab.url);
};

//Name is the key for data in storage
export const openCollection = async function (name) {
  try {
    // 1. Use name to get collections tab data from storage.sync
    const { [name]: collection } = await getCollection(name);
    // 2. Extract urls from the stored tab data
    const urlArray = getUrls(collection);
    // 3. Create 'options' object with urlArray and other data stored @ save event
    //TODO :: save and load more options about the window object!
    // 4. Open window
    //TODO -- Promisify?
    chrome.windows.create({ url: urlArray }, chromeWin => {
      console.log('Opening worked!');
      console.log(chromeWin);
    });
    return collection;
  } catch (err) {
    console.error(`💥 Open Collection:  ${err.message}`);
    throw err;
  }
};

////////////////////////////////////////////////////////////////////////////////////
export const deleteTab = function (delUrl) {
  // 1. Get index of url to delete in the tabsArr
  const delIndex = state.selectedTabs.tabs.findIndex(tab => tab.url === delUrl);
  // 2. Use splice to delete the specified url (parameter: delUrl)
  state.selectedTabs.tabs.splice(delIndex, 1);
};

export const deleteCollection = async function (delName) {
  try {
    // 1. Delete collection from state.collectionNames
    // 1.a Get index of url to delete in the collectionNames Arr
    const delIndex = state.collectionNames.findIndex(
      collection => collection.name === delName
    );
    // 1.b Use splice to delete the specified collectionName (parameter: delName)
    state.collectionNames.splice(delIndex, 1);
    // testing
    // console.log('State.collectionNames', state.collectionNames);

    // todo! extract collectionNames
    // 2. Set storage.collectionNames = state.collectionNames (which just had collection delName deleted)
    await setStorage({ collectionNames: extractCollectionNames() }); // [reduced to objects with ONLY .name property]
    // await setStorage({ collectionNames: state.collectionNames }); // Old way

    //testing
    const collNames = await getCollectionNames();
    console.log('storage.collectionNames', collNames);

    // 3. Delete collection in question from storage.sync
    const check = await removeStorage(delName);

    await updateStateStorageData();
    //test
    console.log('Deleted collection Name', check);

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

const collectionExists = function (name) {
  return state.collectionNames.some(collection => collection.name === name);
};

// Bytes of currently selected for save collection
const collectionBytes = function (key) {
  // NOTE :: may need to change this when implementing get bytes
  const size = calcBytes({ [key]: state.selectedTabs.tabs });
  return size;
};

// Returns true if object to be saved is greater or equal to the maximum
// number of bytes that can be saved to chrome.storage.sync at a time
export const checkBytesPerItem = function (key) {
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

//*********************************** */

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
