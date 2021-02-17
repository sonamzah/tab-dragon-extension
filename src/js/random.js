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
