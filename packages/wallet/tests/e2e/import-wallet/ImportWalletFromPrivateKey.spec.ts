import { device, element, by, expect } from "detox";

describe("Example", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should properly import wallet from private key", async () => {
    await element(by.id("landing.go-to-import-your-wallet")).tap();

    await expect(element(by.id("import-wallet"))).toBeVisible();
  });
});
