import { all, select } from "redux-saga/effects";

import { subtractBigNumbers } from "../../../../../utils/BigNumberUtils";
import {
  selectLiquidEtherBalance,
  selectLiquidEuroTokenBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
} from "../../../../wallet/selectors";
import { selectTxGasCostEthUlps } from "../../../sender/selectors";
import { EInvestmentWallet } from "../types";

export function* calculateEntireBalanceValue(
  investmentWallet: EInvestmentWallet,
): Generator<any, string, any> {
  switch (investmentWallet) {
    case EInvestmentWallet.ICBMEth:
      return yield select(selectLockedEtherBalance);

    case EInvestmentWallet.ICBMnEuro:
      return yield select(selectLockedEuroTokenBalance);

    case EInvestmentWallet.NEur:
      return yield select(selectLiquidEuroTokenBalance);

    case EInvestmentWallet.Eth:
      const [gasCostEth, fullBalance] = yield all([
        select(selectTxGasCostEthUlps),
        select(selectLiquidEtherBalance),
      ]);
      return subtractBigNumbers([fullBalance, gasCostEth]);
  }
}
