import { Schema } from "yup";

export interface IStorageSchema<DataType> {
  version: number;
  id: string;
  schema: Schema<DataType>;
  migrate: (storageVersion: number, data: DataType) => Promise<DataType>;
  validate: (data: DataType) => Promise<DataType>;
}
