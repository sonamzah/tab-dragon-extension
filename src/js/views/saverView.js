// import "core-js/stable";
// import {} from "fractional";

class SaverView {
  _parentElement = document.querySelector(".collections-save-menu");
  _data = [];

  message(message) {
    alert(message);
    console.log(this._parentElement.classList);
    // document.write(`<h2>${this._parentElement}</h2>`);
  }

  handleSaveWindow(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (!e.target.classList.contains("btn--save-window")) return;
      handler();
    });
  }
  //   handleSaveSelectTabs(handler) {}
  //   handleSaveByUrl(handler) {}

  //   render(data) {}
}

export default new SaverView();
