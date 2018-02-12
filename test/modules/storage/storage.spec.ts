import { expect } from "chai";
import { spy } from "sinon";

import { Storage } from "../../../app/modules/storage/storage";

describe("Browser Storage", () => {
  it("should store an item and retrieve it from local storage", async () => {
    const expectedPhrase = "dummyWallet";
    const key = "lightWallet";
    const localStorageMock = {
      setItem: spy(),
      getItem: spy(() => expectedPhrase),
    };

    const storage = new Storage(localStorageMock);
    storage.setKey(key, expectedPhrase);
    storage.getKey(key);

    expect(localStorageMock.setItem).to.be.calledWithExactly(key, expectedPhrase);
    expect(localStorageMock.getItem.returned(expectedPhrase)).to.be.true;
  });
});
