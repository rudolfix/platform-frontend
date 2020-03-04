import { Schema } from "yup";
import { IStorageSchema } from "../types/IStorageSchema";

/**
 * Class representing a schema item
 * @class  StorageSchema
 */
export class StorageSchema<DataType> implements IStorageSchema<DataType> {
  /**
   * @param {string} version - version of a schema
   * @param {string} id - schema id
   * @param schema - YupTS object schema
   */
  constructor(public version: number, public id: string, public schema: Schema<DataType>) {}

  /**
   * @param {string} data - validate data with YUP
   * returns boolean promise
   */
  async validate(data: DataType): Promise<DataType> {
    return await this.schema.validate(data);
  }

  /**
   * @param {string} data - validate data with YUP
   * returns boolean promise
   */
  async migrate(data: DataType): Promise<DataType> {
    return Promise.resolve(data);
  }
}
