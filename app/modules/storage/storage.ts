export interface ILocalStorage {
  setKey(key: string, value: string): void;
  getKey(key: string): string;
}

export const setKey = (key: string, value: string): void => {
  (window as any).localStorage.setItem(key, value);
};

export const getKey = (key: string): string => {
  return (window as any).localStorage.getItem(key);
};
