export const getPersistentStorage = (key, defaultValue) => {
  const value = JSON.parse(localStorage.getItem(key));
  return value ? value : defaultValue;
};

export const setPersistentStorage: (key: string, value: object) => void = (
  key,
  value
) => {
  localStorage.setItem(key, JSON.stringify(value));
};
