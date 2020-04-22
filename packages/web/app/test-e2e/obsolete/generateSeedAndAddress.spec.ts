import { expect } from "chai";

import { generateSeedAndAddress } from "./generateSeedAndAddress";

const DEFAULT_HD_PATH = "m/44'/60'/0'";

describe("generateSeedAndAddress", () => {
  it("generates seed and password", async () => {
    const { seed, address } = await generateSeedAndAddress(DEFAULT_HD_PATH);

    expect(seed.length).to.eq(24);
    expect(address.length).to.eq(42);
  });
});
