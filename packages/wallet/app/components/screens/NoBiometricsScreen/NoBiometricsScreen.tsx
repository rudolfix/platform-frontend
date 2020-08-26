import { assertNever, invariant, StateNotAllowedError } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet, View } from "react-native";

import Illustration from "assets/illustration-we-care-about-security.svg";

import { NeuGradientScreen } from "components/shared/NeuGradientScreen";
import { BodyText } from "components/shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";

import {
  BIOMETRY_NONE,
  biometryModuleApi,
  EBiometricsState,
  EBiometryType,
} from "modules/biometry/module";

import { appConnect } from "store/utils";

import { baseSilver, baseWhite } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TStateProps = {
  biometricsType: ReturnType<typeof biometryModuleApi.selectors.selectBiometricsType>;
  biometricsState: ReturnType<typeof biometryModuleApi.selectors.selectBiometricsState>;
};

const biometrySettingsEntry: Record<EBiometryType, string> = {
  [EBiometryType.IOSFaceID]: "Face ID & Passcode",
  [EBiometryType.IOSTouchID]: "Touch ID & Passcode",
};

const biometryName: Record<EBiometryType, string> = {
  [EBiometryType.IOSFaceID]: "Face ID",
  [EBiometryType.IOSTouchID]: "Touch ID",
};

const BiometryText: React.FunctionComponent<TStateProps> = ({
  biometricsType,
  biometricsState,
}) => {
  invariant(
    biometricsType !== undefined && biometricsType !== BIOMETRY_NONE,
    "Biometrics type should be defined",
  );

  switch (biometricsState) {
    case EBiometricsState.NO_SUPPORT:
      return (
        <>
          To use the Neufund app, you need to setup a biometrics on your phone. To do this, go to
          your phone Settings > {biometrySettingsEntry[biometricsType]}.
        </>
      );
    case EBiometricsState.NO_ACCESS:
      return (
        <>
          To use the Neufund app, you need to allow {biometryName[biometricsType]} access. To do
          this, go to your Phone Settings > Neufund.
        </>
      );

    case EBiometricsState.ACCESS_ALLOWED:
    case EBiometricsState.ACCESS_REQUEST_REQUIRED:
    case EBiometricsState.UNKNOWN:
      throw new StateNotAllowedError("Biometrics should be initialized and with allowed access");

    default:
      assertNever(biometricsState, "Invalid biometrics state");
  }
};

const NoBiometricsScreenLayout: React.FunctionComponent<TStateProps> = ({
  biometricsType,
  biometricsState,
}) => (
  <NeuGradientScreen style={styles.wrapper}>
    <View style={styles.logoContainer}>
      <Illustration />
    </View>

    <View style={styles.container}>
      <Headline level={EHeadlineLevel.LEVEL1} style={styles.headline}>
        We care about security
      </Headline>

      <BodyText style={styles.paragraph}>
        <BiometryText biometricsType={biometricsType} biometricsState={biometricsState} />
      </BodyText>
    </View>
  </NeuGradientScreen>
);

const styles = StyleSheet.create({
  wrapper: {
    ...spacingStyles.p4,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1.2,
  },
  container: {
    flex: 1.5,
  },
  headline: {
    ...spacingStyles.mb4,
    textAlign: "center",
    color: baseWhite,
  },
  paragraph: {
    textAlign: "center",
    color: baseSilver,
  },
});

const NoBiometricsScreen = appConnect<TStateProps>({
  stateToProps: state => ({
    biometricsType: biometryModuleApi.selectors.selectBiometricsType(state),
    biometricsState: biometryModuleApi.selectors.selectBiometricsState(state),
  }),
})(NoBiometricsScreenLayout);

export { NoBiometricsScreen };
