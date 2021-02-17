//**************************** */
//**************************** */
saverView.render({});
model.updateCurrentUI('saverView'); //update state

displayCollectionsView.hide();
saverView.render({}).show();
model.updateCurrentUI('saverView'); //update state
//**************************** */
//**************************** */

//**************************** */
//**************************** */

//✅✅✅✅✅✅✅✅✅✅✅
saverView.hide();
displayCollectionsView.render(model.state.collectionNames).show();
model.updateCurrentUI('displayCollectionsView'); //update state
////////////////////////////////
//✅✅✅✅✅✅✅✅✅✅✅
confirmSaveView.hide();
displayCollectionsView.render(model.state.collectionNames).show();
model.updateCurrentUI('displayCollectionsView'); //update state
////////////////////////////////
//✅✅✅✅✅✅✅✅✅✅✅
confirmSaveView.hide();
displayCollectionsView.render(model.state.collectionNames).show();
model.updateCurrentUI('displayCollectionsView');
//**************************** */
//**************************** */

//**************************** */
//**************************** */
confirmSaveView.render(model.state.selectedTabs.tabsArr);
// 3. Update state.currentUI
model.updateCurrentUI('confirmSaveView');
//**************************** */
//**************************** */

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

//cases
// 1. on saverView
// 2. on confirmSaveView
// 3. on displayCollectionsView

const goToSaverView = function () {
  displayCollectionsView.hide(); //Doesnt change if already hidden
  saverView.render({}).show();
  model.updateCurrentUI('saverView'); //update state
};

//cases
// 1. on saverView
// 2. on confirmSaveView
// 3. on displayCollectionsView

//Handles saverView.hide() and confirmSaveView.hide()
const goToDisplayView = function () {
  saverView.hide();
  displayCollectionsView.render(model.state.collectionNames).show();
  model.updateCurrentUI('displayCollectionsView'); //update state
};

const controlNav = function (direction) {
  //   if (!isString(direction)) return;
  console.log(direction);
  if (model.state.currentUI.confirmSaveView) alert('cancel save?');

  if (direction === 'left') goToSaverView();
  if (direction === 'right') goToDisplayView();
};

// const controlNav = function (direction) {
//   //   if (!isString(direction)) return;
//   console.log(direction);
//   if (direction === 'left') {
//     // current UI === saverView
//     if (model.state.currentUI.saverView) return;
//     // current UI === confirmSaveView
//     if (model.state.currentUI.confirmSaveView) {
//       alert('cancel save?');
//       goToSaverView();
//     }
//     // current UI === displayCollectionsView
//     if (model.state.currentUI.displayCollectionsView) {
//       goToSaverView();
//     }
//   }
//   if (direction === 'right') {
//     // current UI === saverView
//     if (model.state.currentUI.saverView) {
//       goToDisplayView();
//     }
//     // current UI === confirmSaveView
//     if (model.state.currentUI.confirmSaveView) {
//       alert('cancel save?');
//       goToDisplayView();
//     }
//     // current UI === displayCollectionsView
//     if (model.state.currentUI.displayCollectionsView) return;
//   }

//   // current UI === saverView
//   //    direction === 'left'
//   //    direction === 'right'
//   // current UI === cinfirmSaveView
//   //    direction === 'left'
//   //    direction === 'right'
//   // current UI === displayCollectionsView
//   //    direction === 'left'
//   //    direction === 'right'
// };
