import { assertNever, StateNotAllowedError } from "@neufund/shared-utils";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { NoBiometricsScreen } from "components/screens/NoBiometricsScreen/NoBiometricsScreen";

import { EBiometricsState } from "modules/biometrics/module";

import { EAppRoutes } from "./appRoutes";
import { RootStackParamList } from "./routeUtils";

const NoBiometricsRouter = createStackNavigator<RootStackParamList>();

type TExternalProps = {
  biometricsState: EBiometricsState;
};

const getInitialRoute = (state: EBiometricsState) => {
  switch (state) {
    case EBiometricsState.NO_SUPPORT:
    case EBiometricsState.NO_ACCESS:
      return EAppRoutes.noBiometrics;

    case EBiometricsState.ACCESS_ALLOWED:
    case EBiometricsState.ACCESS_REQUEST_REQUIRED:
    case EBiometricsState.UNKNOWN:
      throw new StateNotAllowedError("Biometrics should be initialized and with allowed access");

    default:
      assertNever(state, "Invalid biometrics state");
  }
};

const NoBiometricsRoute: React.FunctionComponent<TExternalProps> = ({ biometricsState }) => (
  <NoBiometricsRouter.Navigator initialRouteName={getInitialRoute(biometricsState)}>
    <NoBiometricsRouter.Screen
      name={EAppRoutes.noBiometrics}
      component={NoBiometricsScreen}
      options={{ headerShown: false }}
    />
  </NoBiometricsRouter.Navigator>
);

export { NoBiometricsRoute };
