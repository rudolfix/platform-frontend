import React, {useState} from "react";
import {Button, Text, View} from "react-native";
import { initActions } from "../modules/init/actions";
import { selectInitStatus, selectTest } from "../modules/init/selectors";
import { appConnect } from "../store/utils";
import { Notifications } from "react-native-notifications";

import messaging from '@react-native-firebase/messaging';

type TDispatchProps = {
  init: () => void;
};

type TStateProps = {
  initStatus: ReturnType<typeof selectInitStatus>;
  test: ReturnType<typeof selectTest>;
};

const send = () => {
  Notifications.postLocalNotification({
    body: "Local notificiation!",
    title: "Local Notification Title",
    sound: "chime.aiff",
    thread: "test",
    badge: 1,
    payload: null,
    type: "test"
  }, 22);
}

const deleteToken = async () => {
  console.log("Deleting the token");
  const deleted = await messaging().deleteToken();
  console.log("----------deleting  token----------", deleted);
  const newT = await getToken();
  console.log("----------getting new token----------", newT);
}

async function getToken() {
  return messaging().getToken();
}

const LandingLayout: React.FunctionComponent<TDispatchProps & TStateProps> = ({
  init,
}) => {

  const [text, setText] = useState("");

  Notifications.events().registerNotificationOpened((response: any, completion) => {
    console.log("---------response.notification.payload-----", response.payload.title);
    setText(response.payload.body);
    completion();
  });

  React.useEffect(() => {
    init();
  }, []);


  return (
    <View>
      <Text style={{fontWeight:"bold", textAlign:"center", padding: 20, fontSize: 33 }}> Transactions</Text>
      <Text style={{fontWeight:"normal", textAlign:"center", padding: 20, fontSize: 22 }}>{text || "No transaction to sign"}</Text>
      <Button onPress={() => { deleteToken() }}   title={"Delete the token"} />
    </View>
  );
};

const Landing = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    initStatus: selectInitStatus(state),
    test: selectTest(state),
  }),
  dispatchToProps: dispatch => ({
    init: () => dispatch(initActions.start()),
  }),
})(LandingLayout);

export { Landing };
