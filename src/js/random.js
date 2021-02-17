saverView.render({});
model.updateCurrentUI('saverView'); //update state

displayCollectionsView.hide();
saverView.render({}).show();
model.updateCurrentUI('saverView'); //update state

saverView.hide();
displayCollectionsView.render(model.state.collectionNames).show();
model.updateCurrentUI('displayCollectionsView'); //update state

confirmSaveView.hide();
displayCollectionsView.render(model.state.collectionNames).show();
model.updateCurrentUI('displayCollectionsView'); //update state

confirmSaveView.render(model.state.selectedTabs.tabsArr);
// 3. Update state.currentUI
model.updateCurrentUI('confirmSaveView');

confirmSaveView.hide();
displayCollectionsView.render(model.state.collectionNames).show();
model.updateCurrentUI('displayCollectionsView');

const goToSaverView = function () {};

const goToDisplayView = function () {};
