import { expect } from "chai";
import { IWalletStateData } from "./reducer";
import {
  selectICBMLockedEuroTotalAmount,
  selectLiquidEuroTotalAmount,
  selectLockedEuroTotalAmount,
  selectTotalEtherBalance,
  selectTotalEtherBalanceEuroAmount,
  selectTotalEuroBalance,
  selectTotalEuroTokenBalance,
} from "./selectors";

describe("Wallet > selectors", () => {
  it("should calculate total value correctly", () => {
    const state: IWalletStateData = {
      euroTokenBalance: "1",
      euroTokenLockedBalance: "3",
      euroTokenICBMLockedBalance: "5",

      etherTokenBalance: "10",
      etherTokenLockedBalance: "30",
      etherTokenICBMLockedBalance: "50",

      etherBalance: "100",
      neuBalance: "1000",

      etherPriceEur: "10",
      neuPriceEur: "10000",
    };

    expect(selectTotalEtherBalance(state)).to.be.eq((10 + 30 + 50 + 100).toString());

    expect(selectTotalEtherBalanceEuroAmount(state)).to.be.eq(
      ((10 + 30 + 50 + 100) * 10).toString(),
    );
    expect(selectTotalEuroTokenBalance(state)).to.be.eq((1 + 3 + 5).toString());

    expect(selectLiquidEuroTotalAmount(state)).to.be.eq((1 + (10 + 100) * 10).toString());

    expect(selectLockedEuroTotalAmount(state)).to.be.eq((3 + 30 * 10).toString());

    expect(selectICBMLockedEuroTotalAmount(state)).to.be.eq((5 + 50 * 10).toString());

    expect(selectTotalEuroBalance(state)).to.be.eq(
      (1 + 3 + 5 + (10 + 30 + 50 + 100) * 10).toString(),
    );
  });
});
