import { getSessionStorage } from "./storage_service";

const fetchEntries = async () => {
  const token = await getSessionStorage("token");

  try {
    const response = await fetch("http://localhost:3000/api/v1/entries", {
      headers: {
        Authorization: token,
        "Content-type": "application/json",
      },
    });

    const entries = await response.json();

    if (entries.errors) {
      document.dispatchEvent(new CustomEvent("auth:signOut"));
      return;
    }

    return entries;
  } catch (e) {
    console.log(e);
  }
};

export default fetchEntries;
