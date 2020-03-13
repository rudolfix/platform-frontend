export interface IStorageMetaData {
  /**
   * @property {number} created - timestamp of creation.
   */
  created: number;

  /**
   * @property {number} lastUpdated - timestamp of the last update.
   */
  lastUpdated: number;

  /**
   * @property {string} appVersion - application version.
   */
  appVersion: number;

  /**
   * @property {string} schemaId - ID of s schema.
   */
  schemaId: string;

  /**
   * @property {number} schemaId - schema version.
   */
  schemaVersion: number;
}
