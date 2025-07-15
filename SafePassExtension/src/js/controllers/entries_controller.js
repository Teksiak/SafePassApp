import { Controller } from "@hotwired/stimulus";
import { getSessionStorage } from "../services/storage_service";
import fetchEntries from "../services/fetch_entries_service";
import { sidebar, main } from "../templates/entries";

class EntriesController extends Controller {
  static targets = ["sidebar", "main"];

  async connect() {
    const token = await getSessionStorage("token");

    if (!token) {
      document.dispatchEvent(new CustomEvent("auth:signOut"));
      return;
    }

    const entries = await fetchEntries();

    try {
      this.sidebarTarget.innerHTML = sidebar(entries);
      this.mainTarget.innerHTML = main(entries[0]);
    } catch (error) {
      return;
    }

    const activeTab = await this.#getActiveTab();

    if (!activeTab) return;

    const activeEntry = entries.find((entry) =>
      entry.url.includes(activeTab.url.hostname)
    );

    if (!activeEntry) return;

    if (activeEntry) {
      this.mainTarget.innerHTML = main(activeEntry);
    }
  }

  updateMain({ params }) {
    this.mainTarget.innerHTML = main(params.entry);
  }

  navigateToLogin({ params }) {
    chrome.tabs.create({ url: params.entry.url });
  }

  async fillInCredentials({ params }) {
    const activeTab = await this.#getActiveTab();

    if (!activeTab) return;

    const activeTabMatchesEntry = params.entry.includes(activeTab.url.host);

    if (activeTabMatchesEntry) {
      chrome.tabs.sendMessage(activeTab.id, {
        username: params.entry.username,
        password: params.entry.password,
      });
    }
  }

  async #getActiveTab() {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!activeTab) return;

    let parsedUrl;
    try {
      parsedUrl = new URL(activeTab.url);
    } catch (e) {
      console.error("Invalid URL in activeTab: ", e);
      return;
    }

    return {
      url: parsedUrl,
      id: activeTab.id,
    };
  }
}

export default EntriesController;
