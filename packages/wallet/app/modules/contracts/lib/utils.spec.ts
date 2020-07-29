import BigNumber from "bignumber.js";
import { utils } from "ethers";

import { converters } from "./utils";

describe("utils", () => {
  describe("converters", () => {
    it("bnToBne should properly convert bignumber to ethers bignumber", () => {
      expect(converters.bnToBne(new BigNumber("-1995"))).toEqual(utils.bigNumberify("-1995"));
      expect(converters.bnToBne(new BigNumber("0"))).toEqual(utils.bigNumberify("0"));
      expect(converters.bnToBne(new BigNumber("1e+23"))).toEqual(
        utils.bigNumberify("100000000000000000000000"),
      );
    });
  });
});
