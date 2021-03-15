// TODO :: use JS conventional commenting //** */

// NOTE :: wrapping the variable name in [] evaluates it immediately
// if not the API call will not evaluate it and assume
// that the key is called 'name'
export const setStorage = async function (data) {
  const name = Object.keys(data)[0];

  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError
        ? reject(new Error(chrome.runtime.lastError.message))
        : resolve(name)
    );
  });
};
// await setStorageData({ data: [someData] });

// NOTE :: result is an object -- with property name: containing array -- of objects
//      { name : [ tab_1, tab_2, tabData_3, ... ] }  -- { name : [ {}, {}, {}, ... ] }
//                -- where tabData-i is an object literal {}
export const getStorage = async function (name) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get(name, result =>
      chrome.runtime.lastError
        ? reject(new Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  );
};
// const { data } = await getStorageData('data');

// Remove item in storage using a single key (string) or array of keys (string[])
export const removeStorage = async function (keys) {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.remove(keys, () =>
      chrome.runtime.lastError
        ? reject(new Error(chrome.runtime.lastError.message))
        : resolve(keys)
    )
  );
};

// Clear chrome.storage.sync
export const clearSyncStorage = function () {
  chrome.storage.sync.clear(() =>
    console.log('chrome.storage.sync cleared 👌')
  );
  chrome.storage.sync.getBytesInUse(null, bytesUsed =>
    console.log(`Bytes used: ${bytesUsed}`)
  );
};
