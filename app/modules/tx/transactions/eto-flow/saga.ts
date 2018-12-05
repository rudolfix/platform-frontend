import { put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETOCommitment } from "../../../../lib/contracts/ETOCommitment";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { actions } from "../../../actions";
import { selectEtoStartDate, selectIssuerEto } from "../../../eto-flow/selectors";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

export function* generateSetStartDateTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const userAddress = selectEthereumAddressWithChecksum(state);
  const gasPriceWithOverhead = selectStandardGasPriceWithOverHead(state);
  const eto = selectIssuerEto(state);

  if (!eto) return;

  const startDate = selectEtoStartDate(state, eto.previewCode);

  if (!startDate) return;

  const contract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
  const terms = yield contract.etoTerms;
  const token = yield contract.equityToken;
  const time = startDate.getTime() / 1000;
  // we need to strip miliseconds from the timestamp

  const txData = contract.setStartDateTx(terms, token, time).getData();

  const txInitialDetails = {
    to: contract.address,
    from: userAddress,
    data: txData,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };

  return txDetails;
}

export function* etoSetDateGenerator(_: TGlobalDependencies): any {
  yield take("TX_SENDER_ACCEPT_DRAFT");
  yield put(actions.txSender.txSenderContinueToSummary());
}
