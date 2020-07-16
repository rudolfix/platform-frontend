import { walletApi } from "@neufund/shared-modules";
import BigNumber from "bignumber.js";
import { createSelector } from "reselect";

export const selectUserHasEnoughNeumarkToUnlockEtherWallet = createSelector(
  walletApi.selectors.selectNeuBalance,
  walletApi.selectors.selectEtherLockedNeumarksDue,
  (neuBalance, neumarksDue) => {
    const neuCompare = new BigNumber(neuBalance).comparedTo(neumarksDue);
    return neuCompare >= 0;
  },
);

export const selectUserHasEnoughNeumarkToUnlockEuroWallet = createSelector(
  walletApi.selectors.selectNeuBalance,
  walletApi.selectors.selectEuroLockedNeumarksDue,
  (neuBalance, neumarksDue) => {
    const neuCompare = new BigNumber(neuBalance).comparedTo(neumarksDue);
    return neuCompare >= 0;
  },
);
