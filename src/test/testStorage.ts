export function resetLocalStorage(): Storage {
  window.localStorage.clear();
  return window.localStorage;
}
