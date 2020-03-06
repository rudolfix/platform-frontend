import { neuTakeLatest, put, fork, getContext } from "@neufund/sagas";
import { TGlobalDependencies } from "../../di/setupBindings";
import { initActions } from "./actions";
import * as yup from "yup";
import messaging from '@react-native-firebase/messaging';
import {Notification, NotificationResponse, Notifications} from 'react-native-notifications';

// TODO: Remove after testing. Test setting some data.
// We can use Yup as both: schema and a type
const PersonSchema = yup.object().shape({
  name: yup.string(),
  age: yup.number(),
});

// get a type for TS from Yup object
type Person = yup.InferType<typeof PersonSchema>;

const JohnDoe: Person = {
  name: "John Doe",
  age: 22,
};

const testWallet: any = {
  wallets: ["cd2a3d9f938e13cd947ec05abc7fe734df8dd826", "cd2a3d9f938e13cd947ec05abc7fe734df8dd826"],
};
// remove after testing end

async function registerAppWithFCM() {
  await messaging().registerForRemoteNotifications();
}

async function getToken() {
  await messaging().getAPNSToken();
}

export function* initStartSaga({
  logger,
}: TGlobalDependencies): Generator<any, void, TGlobalDependencies> {
  try {
    // TODO: Provide a proper init flow

    // TODO: Remove after testing. Test setting some data.
    const { appStorage }: TGlobalDependencies = yield getContext("deps");
    const { singleKeyAppStorage }: TGlobalDependencies = yield getContext("deps");

    yield appStorage.setItem("test", JohnDoe);
    yield singleKeyAppStorage.setItem(testWallet);

    // Notifications

    yield registerAppWithFCM();

        const token = yield getToken();


        console.log("-------------", token);




    //Notifications.registerRemoteNotifications();

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      console.log(event);
    })

    Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
      console.log(`Notification received in foreground `, notification);
      completion({alert: true, sound: true, badge: false});
    });

    Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion) => {
      console.log(`Notification received in background AAAAA `, notification);
      completion({alert: true, sound: true, badge: false});
    });



    messaging().onTokenRefresh(fcmToken => {
      console.log("-----new tokken------", fcmToken);
    });

/*
    setTimeout(() => {
      Notifications.postLocalNotification({
        body: "Local notificiation!",
        title: "Welcome to Neufund",
        sound: "chime.aiff",
        thread: "test",
        badge: 1,
        payload: null,
        type: "test"
      }, 22);
    }, 10000)
*/
    // Notifications

    yield put(initActions.done());
  } catch (e) {
    yield put(initActions.error(e?.message ?? "Unknown error"));
    logger.error("App init error", e);
  }
}

export function* initSaga(): Generator<any, void, any> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
}
