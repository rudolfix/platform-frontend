import { expect } from "chai";
import { Q18 } from "../../config/constants";
import { IAppState } from "../../store";
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
          euroTokenBalance: Q18.toString(),
          euroTokenLockedBalance: Q18.mul(3).toString(),

          etherTokenLockedWallet: {
            ICBMLockedBalance: Q18.mul(50).toString(),
            neumarksDue: "0",
            unlockDate: "0",
          },
          euroTokenLockedWallet: {
            ICBMLockedBalance: Q18.mul(5).toString(),
            neumarksDue: "0",
            unlockDate: "0",
          },
          etherTokenBalance: Q18.mul(10).toString(),
          etherTokenLockedBalance: Q18.mul(30).toString(),
          etherTokenNeumarksDue: Q18.mul(3).toString(),
          etherTokenUnlockDate: Q18.mul(2).toString(),

          etherBalance: Q18.mul(100).toString(),
          neuBalance: Q18.mul(1000).toString(),
        },
      },
      tokenPrice: {
        tokenPriceData: {
          etherPriceEur: "10",
          neuPriceEur: "10000",
        },
      },
    };

    const fullStateMock = (state as any) as IAppState;

    expect(selectTotalEtherBalance(state.wallet)).to.be.eq(Q18.mul(10 + 30 + 50 + 100).toString());

    expect(selectTotalEtherBalanceEuroAmount(fullStateMock)).to.be.eq(
      Q18.mul((10 + 30 + 50 + 100) * 10).toString(),
    );
    expect(selectTotalEuroTokenBalance(state.wallet)).to.be.eq(Q18.mul(1 + 3 + 5).toString());

    expect(selectLiquidEuroTotalAmount(fullStateMock)).to.be.eq(
      Q18.mul(1 + (10 + 100) * 10).toString(),
    );

    expect(selectLockedEuroTotalAmount(fullStateMock)).to.be.eq(Q18.mul(3 + 30 * 10).toString());

    expect(selectICBMLockedEuroTotalAmount(fullStateMock)).to.be.eq(
      Q18.mul(5 + 50 * 10).toString(),
    );

    expect(selectTotalEuroBalance(fullStateMock)).to.be.eq(
      Q18.mul(1 + 3 + 5 + (10 + 30 + 50 + 100) * 10).toString(),
    );
  });
});
