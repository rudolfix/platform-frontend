import { expect } from "chai";
import { dummyEthereumAddress } from "../../../test/fixtures";
import { globalFakeClock } from "../../../test/setupTestsHooks";
import { createMock } from "../../../test/testUtils";
import { IVault, LIGHT_WALLET_PASSWORD_CACHE_TIME, LightWallet } from "./LightWallet";
import { Web3Adapter } from "./Web3Adapter";

describe("LightWallet > Wallet wrapper", () => {
  it("should clear password automatically", () => {
    const expectedPassword = "secret_password";
    const web3AdapterMock = createMock(Web3Adapter, {});
    const dummyVault: IVault = {} as any;

    const lightWallet = new LightWallet(
      web3AdapterMock,
      dummyEthereumAddress,
      dummyVault,
      expectedPassword,
    );

    expect(lightWallet.password).to.be.eq(expectedPassword);

    globalFakeClock.tick(LIGHT_WALLET_PASSWORD_CACHE_TIME - 1);
    expect(lightWallet.password).to.be.eq(expectedPassword);

    globalFakeClock.tick(1);
    expect(lightWallet.password).to.be.undefined;
  });
});
