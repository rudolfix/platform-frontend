import { neuTakeLatest, put, fork, call, SagaGenerator } from "@neufund/sagas";
import { toEthereumAddress, toEthereumPrivateKey } from "@neufund/shared-utils";
import { tokenPriceModuleApi } from "@neufund/shared-modules";
import { utils } from "ethers";

import { TGlobalDependencies } from "../../di/setupBindings";
import { walletContractsModuleApi } from "../contracts/module";
import { initActions } from "./actions";

/**
 * Init global watchers
 */
function* initGlobalWatchers(): SagaGenerator<void> {
  yield put(tokenPriceModuleApi.actions.watchTokenPriceStart());
}

function* initStartSaga({ logger, ethManager }: TGlobalDependencies): Generator<unknown, void> {
  try {
    yield* call(walletContractsModuleApi.sagas.initializeContracts);
    yield* call(initGlobalWatchers);

    // TODO: Provide a proper init flow

    const balance = yield* call(() =>
      ethManager.getBalance(toEthereumAddress("0x429123b08DF32b0006fd1F3b0Ef893A8993802f3")),
    );

    const etherString = utils.formatEther(balance);

    console.log("0x429123b08DF32b0006fd1F3b0Ef893A8993802f3 balance", etherString);

    if (yield ethManager.hasExistingWallet()) {
      yield ethManager.plugExistingWallet();

      yield ethManager.unsafeDeleteWallet();
    }
    //
    // // yield ethManager.plugNewRandomWallet();
    //
    yield ethManager.plugNewWalletFromPrivateKey(
      toEthereumPrivateKey("0x79177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93"),
    );

    // yield ethManager.plugNewWalletFromMnemonic(
    //   "timber rely gap brown useful craft level lounge volume vote flush punch vanish casino fold cliff hollow maximum flip coast barrel copy quit globe",
    // );

    // yield ethManager.sendTransaction({
    //   to: toEthereumAddress("0x7824e49353BD72E20B61717cf82a06a4EEE209e8"),
    //   gasLimit: "0x21000",
    //   gasPrice: "0x20000000000",
    //   from: toEthereumAddress("0x429123b08DF32b0006fd1F3b0Ef893A8993802f3"),
    //   value: "0x1000000000000000000",
    // });

    yield put(initActions.done());
  } catch (e) {
    yield put(initActions.error(e?.message ?? "Unknown error"));
    logger.error("App init error", e);
  }
}

export function* initSaga(): Generator<any, void, any> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
}
