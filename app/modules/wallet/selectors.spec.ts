import { expect } from "chai";
import { IAppState } from "./../../store";
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
    const state = {
      wallet: {
        loading: false,
        data: {
          euroTokenBalance: "1",
          euroTokenLockedBalance: "3",
          euroTokenICBMLockedBalance: "5",

          etherTokenBalance: "10",
          etherTokenLockedBalance: "30",
          etherTokenICBMLockedBalance: "50",
          etherTokenNeumarksDue: "3",
          etherTokenUnlockDate: "2",

          etherBalance: "100",
          neuBalance: "1000",
        },
      },
      tokenPrice: {
        etherPriceEur: "483.96",
        neuPriceEur: "0.500901",
      },
    };

    const fullStateMock = (state as any) as IAppState;

    expect(selectTotalEtherBalance(state.wallet)).to.be.eq((10 + 30 + 50 + 100).toString());

    expect(selectTotalEtherBalanceEuroAmount(fullStateMock)).to.be.eq(
      ((10 + 30 + 50 + 100) * 10).toString(),
    );
    expect(selectTotalEuroTokenBalance(state.wallet)).to.be.eq((1 + 3 + 5).toString());

    expect(selectLiquidEuroTotalAmount(fullStateMock)).to.be.eq((1 + (10 + 100) * 10).toString());

    expect(selectLockedEuroTotalAmount(fullStateMock)).to.be.eq((3 + 30 * 10).toString());

    expect(selectICBMLockedEuroTotalAmount(fullStateMock)).to.be.eq((5 + 50 * 10).toString());

    expect(selectTotalEuroBalance(fullStateMock)).to.be.eq(
      (1 + 3 + 5 + (10 + 30 + 50 + 100) * 10).toString(),
    );
  });
});
