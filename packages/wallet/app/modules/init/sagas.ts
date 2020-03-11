import { neuTakeLatest, put, fork } from "@neufund/sagas";
import { toEthereumAddress, toEthereumPrivateKey } from "@neufund/shared";
import { utils } from "ethers";
import { TGlobalDependencies } from "../../di/setupBindings";
import { initActions } from "./actions";

function* initStartSaga({
  logger,
  ethManager,
  notifications,
}: TGlobalDependencies): Generator<any, void, any> {
  try {
    // TODO: Provide a proper init flow

    const balance = yield ethManager.getBalance(
      toEthereumAddress("0x429123b08DF32b0006fd1F3b0Ef893A8993802f3"),
    );

    const etherString = utils.formatEther(balance);

    console.log("0x429123b08DF32b0006fd1F3b0Ef893A8993802f3 balance", etherString);

    if (yield ethManager.hasExistingWallet()) {
      yield ethManager.plugExistingWallet();

      yield ethManager.unsafeDeleteWallet();
    }

    // yield ethManager.plugNewRandomWallet();

    yield ethManager.plugNewWalletFromPrivateKey(
      toEthereumPrivateKey("0x79177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93"),
    );

    // yield ethManager.plugNewWalletFromMnemonic(
    //   "timber rely gap brown useful craft level lounge volume vote flush punch vanish casino fold cliff hollow maximum flip coast barrel copy quit globe",
    // );

    yield ethManager.sendTransaction({
      to: toEthereumAddress("0x7824e49353BD72E20B61717cf82a06a4EEE209e8"),
      gasLimit: utils.bigNumberify("21000"),
      gasPrice: utils.bigNumberify("20000000000"),
      from: toEthereumAddress("0x429123b08DF32b0006fd1F3b0Ef893A8993802f3"),
      value: utils.parseEther("1.0"),
    });

    // init push notifications
    yield notifications.init();

    // subscribe for notifications test
    notifications.onReceivedNotificationInForeground(notification => {
      console.log("------event work--------", notification);
    }, { alert: false, sound: false, badge: false });

    yield put(initActions.done());
  } catch (e) {
    yield put(initActions.error(e?.message ?? "Unknown error"));
    logger.error("App init error", e);
  }
}

export function* initSaga(): Generator<any, void, any> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
}
