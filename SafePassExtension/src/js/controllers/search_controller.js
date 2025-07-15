import { Controller } from "@hotwired/stimulus";

class SearchController extends Controller {
  static targets = ["input", "item", "clearButton"];

  search() {
    const searchTerm = this.inputTarget.value.trim().toLowerCase();

    if (!searchTerm.length) {
      this.showItems();
      return;
    }

    this.itemTargets.forEach((item) => {
      item.hidden = !item.textContent.trim().toLowerCase().includes(searchTerm);
    });

    const visibleItems = this.itemTargets.filter((item) => !item.hidden);

    if (visibleItems.length == 1) {
      visibleItems[0].click();
    }
  }

  toggleClearButton(event) {
    if (event.target.value) {
      this.clearButtonTarget.hidden = false;
    } else {
      this.clearButtonTarget.hidden = true;
    }
  }

  clearSearch() {
    this.inputTarget.value = "";
    this.clearButtonTarget.hidden = true;
    this.showItems();
  }

  showItems() {
    this.itemTargets.forEach((item) => {
      item.hidden = false;
    });
  }
}

export default SearchController;
