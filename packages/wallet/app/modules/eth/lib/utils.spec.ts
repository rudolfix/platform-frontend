import { isPrivateKey, isMnemonic } from "./utils";

const EMPTY_STRING = "";

describe("utils", () => {
  describe("isPrivateKey", () => {
    it("should return true for a valid private key", () => {
      const privateKeys = ["0x79177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93"];

      privateKeys.forEach(privateKey => {
        expect(isPrivateKey(privateKey)).toBeTruthy();
      });
    });

    it("should return false for an invalid private key", () => {
      const privateKeys = [
        "79177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93",
        "0xF79177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93",
        "0x9177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93",
        EMPTY_STRING,
      ];

      privateKeys.forEach(privateKey => {
        expect(isPrivateKey(privateKey)).toBeFalsy();
      });
    });
  });

  describe("isMnemonic", () => {
    it("should return true for a valid mnemonics", () => {
      const mnemonics = [
        "sword grace service smile staff weather fog husband slush diary silent artwork orbit wedding twelve mammal lamp position sorry weird foot record wide pioneer",
        "flat range capital party must this hero receive clown patch online index",
      ];

      mnemonics.forEach(mnemonic => {
        expect(isMnemonic(mnemonic)).toBeTruthy();
      });
    });

    it("should return false for an invalid mnemonics", () => {
      const mnemonics = [
        "flat range capital party car this hero receive clown patch online index",
        "pool hockey win moral spike wine renew space frequent early boost carry federal unlock rent code topic nature business elite vivid setup stand mosquito foo",
        "one two three",
        EMPTY_STRING,
      ];

      mnemonics.forEach(mnemonic => {
        expect(isMnemonic(mnemonic)).toBeFalsy();
      });
    });
  });
});
