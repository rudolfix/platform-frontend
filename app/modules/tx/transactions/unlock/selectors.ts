import BigNumber from "bignumber.js";
import { createSelector } from "reselect";

import {
  selectEtherLockedNeumarksDue,
  selectEtherLockedWalletHasFunds,
  selectNeuBalance,
} from "../../../wallet/selectors";

const selectUserHasEnoughNeumarkToUnlock = createSelector(
  selectNeuBalance,
  selectEtherLockedNeumarksDue,
  (neuBalance, neumarksDue) => {
    const neuCompare = new BigNumber(neuBalance).comparedTo(neumarksDue);
    if (neuCompare >= 0) return true;
    return false;
  },
);

export const selectCanUnlockWallet = createSelector(
  selectUserHasEnoughNeumarkToUnlock,
  selectEtherLockedWalletHasFunds,
  (etherWalletHasEnoughNeumark, etherWalletHasFunds) =>
    !!(etherWalletHasFunds && etherWalletHasEnoughNeumark),
);
