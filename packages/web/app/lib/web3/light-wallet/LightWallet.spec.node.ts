import { createMock } from "@neufund/shared/tests";
import { expect } from "chai";

import { dummyEthereumAddressWithChecksum } from "../../../../test/fixtures";
import { Web3Adapter } from "../Web3Adapter";
import { IVault, LightWallet } from "./LightWallet";

describe("Light Wallet", () => {
  it("should generate correct metadata", () => {
    const web3AdapterMock = createMock<Web3Adapter>(Web3Adapter, {});
    const dummyEthAddress = dummyEthereumAddressWithChecksum;
    const dummyVault: IVault = { salt: "SOME SALT", walletInstance: "WALLET INSTANCE" };
    const dummyEmail = "test@example.com";

    const lightWallet = new LightWallet(web3AdapterMock, dummyEthAddress, dummyVault, dummyEmail);

    expect(lightWallet.getMetadata()).to.be.deep.eq({
      address: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
      email: "test@example.com",
      salt: "SOME SALT",
      walletType: "LIGHT",
      walletSubType: "UNKNOWN",
    });
  });
});
