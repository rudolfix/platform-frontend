import { neuTakeLatest, put, fork } from "@neufund/sagas";
import { toEthereumAddress, toEthereumPrivateKey } from "@neufund/shared";
import { utils } from "ethers";

import { TGlobalDependencies } from "../../di/setupBindings";
import { initActions } from "./actions";
import {requestNotifications} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';

async function registerAppWithFCM() {
  await messaging().registerForRemoteNotifications();
}

async function requestPermission() {
  const granted = messaging().requestPermission();

  if (granted) {
    console.log('User granted messaging permissions!');
  } else {
    console.log('User declined messaging permissions :(');
  }
}

async function getToken() {
  return messaging().getToken();
}

// only used on iOS
type NotificationOption =
  | 'alert'
  | 'badge'
  | 'sound'
  | 'criticalAlert'
  | 'carPlay'
  | 'provisional';

interface NotificationSettings {
  // properties only availables on iOS
  // unavailable settings will not be included in the response object
  alert?: boolean;
  badge?: boolean;
  sound?: boolean;
  lockScreen?: boolean;
  carPlay?: boolean;
  notificationCenter?: boolean;
  criticalAlert?: boolean;
}
type PermissionStatus = 'unavailable' | 'denied' | 'blocked' | 'granted';


function requestNotifications(
  options: NotificationOption[],
): Promise<{
  status: PermissionStatus;
  settings: NotificationSettings;
}>;

function* initStartSaga({ logger, ethManager }: TGlobalDependencies): Generator<any, void, any> {
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


    const notificationsAllowed = yield requestNotifications(['alert', 'sound']);

    if(notificationsAllowed.status === "granted") {
      yield registerAppWithFCM();
      console.log("----Notification permissions------", notificationsAllowed);
      //yield requestPermission();
      const t = yield getToken();

      console.log("----------11FCMTo1111ken11111s1--11111--------", t);


      messaging().onTokenRefresh(async (fcmToken) => {
        console.log('----------New FCM Token:--------', fcmToken);
      });

    }

    yield put(initActions.done());
  } catch (e) {
    yield put(initActions.error(e?.message ?? "Unknown error"));
    logger.error("App init error", e);
  }
}

export function* initSaga(): Generator<any, void, any> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
}
