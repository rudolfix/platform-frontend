import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { ITxData } from "../../../lib/web3/Web3Manager";
import { IAppState } from "../../../store";
import { actions } from "../../actions";
import { selectEthereumAddressWithChecksum } from "./../../web3/selectors";

export function* generateUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  const userAddress = yield select((state: IAppState) =>
    selectEthereumAddressWithChecksum(state.web3),
  );
  /*   if (!eto || !selectReadyToInvest(i)) {
    throw new Error("Investment data is not valid to create an Transaction");
  }
 */
  let txDetails: ITxData | undefined;

  const test = yield contractsService.icbmEuroLock.currentMigrationTarget;
  const initAddress = contractsService.icbmEtherLock.address;
  const euroBalance = yield contractsService.icbmEuroLock.balanceOf(userAddress);
  const etherBalance = yield contractsService.icbmEtherLock.balanceOf(userAddress);
  const lockedEuro = yield contractsService.euroLock.balanceOf(userAddress);
  const txInput = contractsService.icbmEuroLock.migrateTx().getData();
  debugger;
  txDetails = {
    to: "0x72eaf00839340e6c3d4b3abc12a1bdd277894f6e",
    from: userAddress,
    data: txInput,
    value: "0",
    gas: "2400000",
    gasPrice: "10000",
  };

  //   const txInput2 = contractsService.icbmEtherLock.migrateTx().estimateGas(txDetails);

  if (txDetails) {
    yield put(actions.txSender.txSenderAcceptDraft(txDetails));
  }
}
