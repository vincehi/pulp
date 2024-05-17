export const getLocalStorage = (key, defaultValue) => {
  const value = JSON.parse(localStorage.getItem(key));
  return value ? value : defaultValue;
};

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
