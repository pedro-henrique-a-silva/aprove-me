export function saveTokenToLocalStore(key: string, value: string) {
  localStorage.setItem(key, JSON.stringify(value));
}


export function getTokenFromLocalStore(key: string) {
  const token = localStorage.getItem(key);
  if (token) {
    return JSON.parse(token);
  }
  return null;
}