/**
 * An interface that a storage provider has to implement.
 * Storage provider is an abstraction class that wraps a storage library e.g. AsyncStorage or SQLite,
 * and provides common interface to interact with the storage and incapsulates specific storage implementation.
 */
export interface ISecureStorageProvider {
  /**
   * Adds value to a storage by key -> value pair.
   *
   * @param {string} key - Key a value
   * @param value - Serializable data
   * @returns Promise of void
   *
   */
  setItem: (key: string, value: string) => Promise<void>;
  /**
   * Gets a value from storage by key.
   *
   * @param key - The first input number
   * @returns Promise of string or null if key doesn't exist
   *
   */
  getItem: (key: string) => Promise<string | null>;
  /**
   * Removes a value from storage by key.
   *
   * @param key - The first input number
   * @returns Promise of void
   *
   */
  removeItem: (key: string) => Promise<void>;
}
