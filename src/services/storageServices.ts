export const getPersistentStorage = (key, defaultValue) => {
  const value = JSON.parse(localStorage.getItem(key));
  return value ? value : defaultValue;
};

export const setPersistentStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
