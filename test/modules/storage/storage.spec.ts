import { expect } from "chai";
import * as localStorage from "node-localstorage";
import { getKey, setKey } from "../../../app/modules/storage/storage";

beforeEach(() => {
  (window as any).localStorage = new localStorage.LocalStorage("./scratch");
});

afterEach(() => {
  (window as any).localStorage._deleteLocation();
  (window as any).localStorage = undefined;
});

describe("Browser Storage", () => {
  it("should store an item and retrieve it from local storage", async () => {
    const expectedPhrase = "dummyWallet";
    const key = "lightWallet";
    setKey(key, expectedPhrase);
    expect(getKey(key)).to.be.equal(expectedPhrase);
  });
});
