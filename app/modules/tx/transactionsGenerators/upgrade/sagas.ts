import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/Web3Manager";
import { IAppState } from "../../../../store";
import { actions } from "../../../actions";
import { selectGasPrice } from "../../../gas/selectors";
import {
  selectICBMLockedEtherBalance,
  selectIsEtherUpgradeTargetSet,
  selectIsEuroUpgradeTargetSet,
} from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { selectICBMLockedEuroTokenBalance } from "./../../../wallet/selectors";

export function* generateEuroUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  const userAddress = yield select((state: IAppState) =>
    selectEthereumAddressWithChecksum(state.web3),
  );
  const gasPrice = yield select((state: IAppState) => selectGasPrice(state.gas));
  const migrationTarget = yield select((state: IAppState) =>
    selectIsEuroUpgradeTargetSet(state.wallet),
  );
  const euroBalance = yield select((state: IAppState) =>
    selectICBMLockedEuroTokenBalance(state.wallet),
  );

  if (!migrationTarget || new BigNumber(euroBalance).equals(0)) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEuroLock.migrateTx().getData();

  const txDetails: Partial<ITxData> = {
    to: contractsService.icbmEuroLock.address,
    from: userAddress,
    data: txInput,
    value: addHexPrefix("0"),
    gasPrice: gasPrice.standard,
  };
  const estimatedGas = yield contractsService.icbmEuroLock.migrateTx().estimateGas(txDetails);
  txDetails.gas = addHexPrefix(new BigNumber(estimatedGas).toString(16));

  yield put(actions.txSender.txSenderAcceptDraft(txDetails as ITxData));
}

export function* generateEtherUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  const userAddress = yield select((state: IAppState) =>
    selectEthereumAddressWithChecksum(state.web3),
  );
  const gasPrice = yield select((state: IAppState) => selectGasPrice(state.gas));
  const migrationTarget = yield select((state: IAppState) =>
    selectIsEtherUpgradeTargetSet(state.wallet),
  );
  const etherBalance = yield select((state: IAppState) =>
    selectICBMLockedEtherBalance(state.wallet),
  );

  if (!migrationTarget || new BigNumber(etherBalance).equals(0)) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEtherLock.migrateTx().getData();

  const txDetails: Partial<ITxData> = {
    to: contractsService.icbmEtherLock.address,
    from: userAddress,
    data: txInput,
    value: addHexPrefix("0"),
    gasPrice: gasPrice.standard,
  };

  const estimateGas = yield contractsService.icbmEtherLock.migrateTx().estimateGas(txDetails);
  txDetails.gas = addHexPrefix(new BigNumber(estimateGas).toString(16));

  yield put(actions.txSender.txSenderAcceptDraft(txDetails as ITxData));
}
