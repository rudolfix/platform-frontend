import { ApplicationStorageError } from "./ApplicationStorageError";
import { StorageSchema } from "./StorageSchema";

export class SchemaMismatchError extends ApplicationStorageError {
  constructor(schema: StorageSchema<unknown>, message: string) {
    super(`SchemaMismatchError: version ${schema.version}, id ${schema.id}: ${message}`);
  }
}
