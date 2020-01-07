import { all, select } from "redux-saga/effects";

import { selectEtoOnChainStateById } from "../../../../eto/selectors";
import { EETOStateOnChain } from "../../../../eto/types";
import { selectIsWhitelisted } from "../../../../investor-portfolio/selectors";
import {
  selectICBMLockedEtherBalance,
  selectICBMLockedEtherBalanceEuroAmount,
  selectICBMLockedEuroTokenBalance,
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLiquidEuroTokenBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
  selectNEURStatus,
} from "../../../../wallet/selectors";
import { ENEURWalletStatus } from "../../../../wallet/types";
import { selectTxUserFlowInvestmentEtoId } from "../selectors";
import { EInvestmentWallet } from "../types";
import { createWallets, hasFunds } from "../utils";

export function* generateWalletsData(): Generator<any, any, any> {
  const etoId = yield select(selectTxUserFlowInvestmentEtoId);

  const {
    etoOnChainState,
    neurStatus,
    userIsWhitelisted,
    balanceNEur,
    ethBalance,
    icbmBalanceNEuro,
    icbmBalanceEth,
    lockedBalanceNEuro,
    lockedBalanceEth,
    ethBalanceAsEuro,
    icbmBalanceEthAsEuro,
  } = yield all({
    etoOnChainState: select(selectEtoOnChainStateById, etoId),
    neurStatus: select(selectNEURStatus),
    userIsWhitelisted: select(selectIsWhitelisted, etoId),
    balanceNEur: select(selectLiquidEuroTokenBalance),
    ethBalance: select(selectLiquidEtherBalance),
    icbmBalanceNEuro: select(selectICBMLockedEuroTokenBalance),
    icbmBalanceEth: select(selectICBMLockedEtherBalance),
    lockedBalanceNEuro: select(selectLockedEuroTokenBalance),
    lockedBalanceEth: select(selectLockedEtherBalance),
    ethBalanceAsEuro: select(selectLiquidEtherBalanceEuroAmount),
    icbmBalanceEthAsEuro: select(selectICBMLockedEtherBalanceEuroAmount),
  });

  let activeInvestmentTypes: EInvestmentWallet[] = [];

  //todo rewrite this logic in a nicer way
  if (hasFunds(ethBalance)) {
    activeInvestmentTypes.unshift(EInvestmentWallet.Eth);
  }

  // if neur is not restricted because of the us state
  if (hasFunds(balanceNEur) && neurStatus !== ENEURWalletStatus.DISABLED_RESTRICTED_US_STATE) {
    activeInvestmentTypes.unshift(EInvestmentWallet.NEur);
  }

  // no regular investment if not whitelisted in pre eto
  if (etoOnChainState === EETOStateOnChain.Whitelist && !userIsWhitelisted) {
    activeInvestmentTypes = [];
  }

  // only ICBM investment if balance available
  if (hasFunds(lockedBalanceNEuro)) {
    activeInvestmentTypes.unshift(EInvestmentWallet.ICBMnEuro);
  }
  if (hasFunds(lockedBalanceEth)) {
    activeInvestmentTypes.unshift(EInvestmentWallet.ICBMEth);
  }

  return createWallets({
    lockedBalanceNEuro,
    balanceNEur,
    icbmBalanceNEuro,
    ethBalance,
    lockedBalanceEth,
    icbmBalanceEth,
    ethBalanceAsEuro,
    icbmBalanceEthAsEuro,
    activeInvestmentTypes,
  });
}
