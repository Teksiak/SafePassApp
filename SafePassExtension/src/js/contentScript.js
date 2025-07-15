import { getUsernameInput, getPasswordInput } from "./utils/inputs";

const autoFillSignIn = ({ username, password }) => {
  const usernameInput = getUsernameInput();
  if (usernameInput) {
    usernameInput.value = username;
  }

  const passwordInput = getPasswordInput();
  if (passwordInput) {
    passwordInput.value = password;
  }
};

chrome.runtime.onMessage.addListener((message) => {
  autoFillSignIn(message);
});
