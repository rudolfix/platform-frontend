import { all, select } from "redux-saga/effects";

import { subtractBigNumbers } from "../../../../../utils/BigNumberUtils";
import {
  selectLiquidEtherBalance,
  selectLiquidEuroTokenBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
} from "../../../../wallet/selectors";
import { selectTxGasCostEthUlps } from "../../../sender/selectors";
import { EInvestmentType } from "../types";

export function* calculateEntireBalanceValue(
  investmentType: EInvestmentType,
): Generator<any, any, any> {
  switch (investmentType) {
    case EInvestmentType.ICBMEth:
      return yield select(selectLockedEtherBalance);

    case EInvestmentType.ICBMnEuro:
      return yield select(selectLockedEuroTokenBalance);

    case EInvestmentType.NEur:
      return yield select(selectLiquidEuroTokenBalance);

    case EInvestmentType.Eth:
      const [gasCostEth, fullBalance] = yield all([
        select(selectTxGasCostEthUlps),
        select(selectLiquidEtherBalance),
      ]);
      return subtractBigNumbers([fullBalance, gasCostEth]);
  }
}
