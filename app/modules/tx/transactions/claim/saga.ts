import { addHexPrefix } from "ethereumjs-util";
import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

export function* generateGetClaimTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  etoId: string,
): any {
  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  // TODO Add correct contract call
  const txInput = yield contractsService.getETOCommitmentContract(etoId);

  const txInitialDetails = {
    to: contractsService.neumark.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: addHexPrefix(estimatedGasWithOverhead),
  };

  return txDetails;
}

export function* startClaimGenerator(_: TGlobalDependencies, etoId: string): any {
  const generatedTxDetails = yield neuCall(generateGetClaimTransaction, etoId);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(actions.txSender.txSenderContinueToSummary(generatedTxDetails));
}
