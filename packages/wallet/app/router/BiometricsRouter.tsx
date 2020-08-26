import { assertNever, StateNotAllowedError } from "@neufund/shared-utils";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { NoBiometricsScreen } from "components/screens/NoBiometricsScreen/NoBiometricsScreen";

import { EBiometricsState } from "modules/biometry/module";

import { EAppRoutes } from "./appRoutes";
import { RootStackParamList } from "./routeUtils";

const BiometricsRouter = createStackNavigator<RootStackParamList>();

type TExternalProps = {
  biometricsState: EBiometricsState;
};

const getInitialState = (state: EBiometricsState) => {
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

const BiometricsRoute: React.FunctionComponent<TExternalProps> = ({ biometricsState }) => (
  <BiometricsRouter.Navigator initialRouteName={getInitialState(biometricsState)}>
    <BiometricsRouter.Screen
      name={EAppRoutes.noBiometrics}
      component={NoBiometricsScreen}
      options={{ headerShown: false }}
    />
  </BiometricsRouter.Navigator>
);

export { BiometricsRoute };
