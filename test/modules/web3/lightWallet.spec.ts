import { expect } from "chai";

describe("LightWallet", () => {
  let oldWindow: any;
  beforeEach(() => {
    oldWindow = window;
    // tslint:disable-next-line
    (window as any) = undefined;
  });
  afterEach(() => {
    window = oldWindow;
  });

  it.only("should create a new serialized wallet", async () => {
    const createNewLightWallet = require("../../../app/modules/web3/LightWallet")
      .createNewLightWallet;
    const serializedLightWallet = await createNewLightWallet({
      password: "serializedLightWallet",
      hdPathString: "m/44'/60'/0'",
      customSalt: "salt",
    });
    expect(serializedLightWallet.walletInstance).to.deep.include("addresses");
    expect(serializedLightWallet.walletInstance).to.deep.include("encHdRootPriv");
    expect(serializedLightWallet.walletInstance).to.deep.include("encPrivKeys");
    expect(serializedLightWallet.walletInstance).to.deep.include("encSeed");
    expect(serializedLightWallet.walletInstance).to.deep.include("hdIndex");
    expect(serializedLightWallet.walletInstance).to.deep.include("hdPathString");
    expect(serializedLightWallet.salt).to.equal("salt");
  });

  it.only("should recover a 24 word mnemonic and generate a nano compatible BIP39", async () => {
    const recoverSeed =
      "butter clean pledge exist gym busy shove pyramid cereal bird unique bar anger hazard weapon shoe clog possible spider convince object mind beef music";
    const hdPathString = "m/44'/60'/0'";
    const nanoAddress = "07dc3a64a5fd98d23776c54f02c53d0a28b61515";
    const createNewLightWallet = require("../../../app/modules/web3/LightWallet")
      .createNewLightWallet;
    const lightWalletObject = await createNewLightWallet({
      password: "test",
      hdPathString,
      recoverSeed,
    });
    const walletInstance = JSON.parse(lightWalletObject.walletInstance);
    expect(walletInstance.addresses[0]).to.equal(nanoAddress);
  });

  it.only("should recover a 12 word mnemonic and a BIP44 compatible derivation path", async () => {
    const recoverSeed =
      "author foster awkward faint script unique letter tag meadow garment elite drip";
    const hdPathString = "m/44'/60'/0'";
    const nanoAddress = "47fde38dc660f9d935c41b4f3a2a6e62d2e823eb";
    const createNewLightWallet = require("../../../app/modules/web3/LightWallet")
      .createNewLightWallet;
    const lightWalletObject = await createNewLightWallet({
      password: "test",
      hdPathString,
      recoverSeed,
    });
    const walletInstance = JSON.parse(lightWalletObject.walletInstance);
    expect(walletInstance.addresses[0]).to.equal(nanoAddress);
  });

  it.only("should de-serialized a lightWallet instance", async () => {
    const recoverSeed =
      "author foster awkward faint script unique letter tag meadow garment elite drip";
    const hdPathString = "m/44'/60'/0'";
    const createNewLightWallet = require("../../../app/modules/web3/LightWallet")
      .createNewLightWallet;
    const deserializeLightWallet = require("../../../app/modules/web3/LightWallet")
      .deserializeLightWallet;
    const walletInstance = (await createNewLightWallet({
      password: "test",
      hdPathString,
      recoverSeed,
      customSalt: "salt",
    })).walletInstance;
    const deserializedInstance = await deserializeLightWallet(walletInstance, "salt");
    //TODO: change test to equal see  https://github.com/Neufund/eth-lightwallet/issues/3
    expect(deserializedInstance).to.deep.include(JSON.parse(walletInstance));
  });
});
