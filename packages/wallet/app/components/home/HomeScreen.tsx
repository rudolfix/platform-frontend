import React from "react";
import { Text } from "react-native";

import { appConnect } from "../../store/utils";
import { SafeAreaScreen } from "../shared/Screen";
import { Header } from "./Header";

type TStateProps = {};

const HomeLayout: React.FunctionComponent<TStateProps> = () => (
  <>
    <Header />
    <SafeAreaScreen>
      <Text>fdds</Text>
    </SafeAreaScreen>
  </>
);

const HomeScreen = appConnect<TStateProps>({
  stateToProps: () => ({}),
})(HomeLayout);

export { HomeScreen };
