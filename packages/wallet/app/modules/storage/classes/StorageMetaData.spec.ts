import { StorageMetaData } from "./StorageMetaData";

describe("StorageMetadata", () => {
  it("should set up appVersion property automatically", () => {
    const storageMetaData: StorageMetaData = new StorageMetaData(
      Date.now(),
      Date.now(),
      "TestID",
      1,
    );
    // TODO: replace this when a proper appVersion is ready
    expect(storageMetaData.appVersion).toBe(1);
  });
});
