import { BigNumber } from "bignumber.js";
import { select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { selectEthereumAddress } from "../web3/reducer";

export async function initializeContracts({
  contractsService,
}: TGlobalDependencies): Promise<void> {
  return await contractsService.init();
}

export function* loadWalletData({ contractsService }: TGlobalDependencies): any {
  const ethAddress: EthereumAddress = yield select((s: IAppState) =>
    selectEthereumAddress(s.web3State),
  );

  const euroBalance: BigNumber = yield contractsService.euroTokenContract.balanceOf(ethAddress);
  const neumarkBalance: BigNumber = yield contractsService.neumarkContract.balanceOf(ethAddress);
  // tslint:disable-next-line
  console.log({
    euroBalance,
    neumarkBalance,
  });
}
