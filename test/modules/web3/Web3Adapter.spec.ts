import * as Web3 from "web3";

import { expect } from "chai";
import { WalletSubType } from "../../../app/modules/web3/PersonalWeb3";
import { Web3Adapter } from "../../../app/modules/web3/Web3Adapter";
import { DeepPartial } from "../../../app/types";

describe("Web3Adapter", () => {
  describe("getNodeType", () => {
    it("should recognize metamask", async () => {
      const web3Mock: DeepPartial<Web3> = {
        version: {
          getNode: (cb: any) => {
            cb(undefined, "MetaMask/v3.13.6");
          },
        },
      };
      const web3Adapter = new Web3Adapter(web3Mock as any);

      const walletSubType = await web3Adapter.getNodeType();
      expect(walletSubType).to.be.eq(WalletSubType.METAMASK);
    });
  });
});
