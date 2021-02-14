export const state = {
  selectedTabs: {
    //Todo rename booleans to more informative names
    byWindow: false,
    byTab: false,
    byUrl: false,
    tabsArr: [],
  },
};
const changeTabUrl = function () {
  chrome.tabs.update({ url: "https://mail.google.com/mail/u/0/?tab=rm" });
};

//Promisified to handle the asynchronous behavior of chrome.tabs.query!
export const allTabsFromWindow = function () {
  return new Promise((resolve, reject) => {
    try {
      console.log("inside model.allTabsFromWin promise");
      //todo: reset these before setting this somehwere
      state.selectedTabs.byWindow = true;
      chrome.tabs.query(
        { windowId: chrome.windows.WINDOW_ID_CURRENT },
        (tabs) => {
          state.selectedTabs.tabsArr = tabs;
          resolve(console.log("promise fulfilled bitch!"));
          // console.log("state after tabs.query");
          // console.log(state);
        }
      );
    } catch (err) {
      console.log(err.message);
      reject(err);
    }
  });
};

// const resetSelectedBy(){
//     state.selectedTabs.selectBy.map(by => by=false);
// }
