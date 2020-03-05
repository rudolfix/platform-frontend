import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { appRoutes } from "../appRoutes";
import { Button } from "./common/buttons/Button";
import { initActions } from "../modules/init/actions";
import { selectInitStatus, selectTest } from "../modules/init/selectors";
import { appConnect } from "../store/utils";
import {Notifications} from "react-native-notifications";

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

const LandingLayout: React.FunctionComponent<TDispatchProps & TStateProps> = ({
  init,
  initStatus,
  test,
}) => {
  const navigation = useNavigation();

  React.useEffect(() => {
    init();
  }, []);

  Notifications.postLocalNotification({
    body: "Local notificiation!",
    title: "Local Notification Title",
    sound: "chime.aiff",
    thread: "test",
    badge: 1,
    payload: null,
    type: "test"
  }, 22);

  return (
    <View>
      <Text>Landing {test && test.name}</Text>

      <Text>Init status: {initStatus}</Text>

      <Button onPress={() => {
        send()
      }}
       title="Send"
      />

      <Button
        testID="landing.go-to-import-your-wallet"
        title="Import your wallet"
        onPress={() => navigation.navigate(appRoutes.importWallet)}
      />
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
