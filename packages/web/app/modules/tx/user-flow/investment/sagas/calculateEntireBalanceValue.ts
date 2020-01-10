import { all, select } from "@neufund/sagas";

import { subtractBigNumbers } from "../../../../../utils/BigNumberUtils";
import {
  selectLiquidEtherBalance,
  selectLiquidEuroTokenBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
} from "../../../../wallet/selectors";
import { selectFakeTxGasCostEthUlps } from "../../../sender/selectors";
import { EInvestmentValueType, EInvestmentWallet } from "../types";

export function* calculateEntireBalanceValue(
  investmentWallet: EInvestmentWallet,
  investmentValueType: EInvestmentValueType,
): Generator<any, string, any> {
  switch (investmentWallet) {
    case EInvestmentWallet.ICBMEth:
      return yield select(selectLockedEtherBalance);

    case EInvestmentWallet.ICBMnEuro:
      return yield select(selectLockedEuroTokenBalance);

    case EInvestmentWallet.NEur:
      return yield select(selectLiquidEuroTokenBalance);

    case EInvestmentWallet.Eth:
      if (investmentValueType === EInvestmentValueType.FULL_BALANCE) {
        const [gasCostEth, fullBalance] = yield all([
          select(selectFakeTxGasCostEthUlps),
          select(selectLiquidEtherBalance),
        ]);
        return subtractBigNumbers([fullBalance, gasCostEth]);
      } else {
        return yield select(selectLiquidEtherBalance);
      }
  }
}
