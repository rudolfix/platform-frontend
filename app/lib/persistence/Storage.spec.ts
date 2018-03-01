import { expect } from "chai";
import { spy } from "sinon";

import { Storage } from "./Storage";

describe("Browser Storage", () => {
  const expectedPhrase = "dummyWallet";
  const key = "lightWallet";
  const localStorageMock = {
    setItem: spy(),
    getItem: spy(() => expectedPhrase),
    removeItem: spy(),
  };

  it("should store an item", async () => {
    const storage = new Storage(localStorageMock);

    storage.setKey(key, expectedPhrase);

    expect(localStorageMock.setItem).to.be.calledWithExactly(key, expectedPhrase);
  });

  it("should retrieve an item given a key", async () => {
    const storage = new Storage(localStorageMock);

    storage.getKey(key);

    expect(localStorageMock.getItem).to.be.calledOnce;
  });

  it("should clear given key", async () => {
    const storage = new Storage(localStorageMock);

    storage.removeKey(key);

    expect(localStorageMock.removeItem).to.be.calledOnce;
    expect(localStorageMock.removeItem).to.be.calledWithExactly(key);
  });
});
