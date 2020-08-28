import { assertNever, invariant, StateNotAllowedError } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet, View } from "react-native";

import Illustration from "assets/illustration-we-care-about-security.svg";

import { NeuGradientScreen } from "components/shared/NeuGradientScreen";
import { BodyText } from "components/shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";

import {
  BIOMETRICS_NONE,
  biometricsModuleApi,
  EBiometricsState,
  EBiometricsType,
} from "modules/biometrics/module";

import { appConnect } from "store/utils";

import { baseSilver, baseWhite } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TStateProps = {
  biometricsType: ReturnType<typeof biometricsModuleApi.selectors.selectBiometricsType>;
  biometricsState: ReturnType<typeof biometricsModuleApi.selectors.selectBiometricsState>;
};

const biometricsSettingsEntry: Record<EBiometricsType, string> = {
  [EBiometricsType.IOSFaceID]: "Face ID & Passcode",
  [EBiometricsType.IOSTouchID]: "Touch ID & Passcode",
};

const biometricsName: Record<EBiometricsType, string> = {
  [EBiometricsType.IOSFaceID]: "Face ID",
  [EBiometricsType.IOSTouchID]: "Touch ID",
};

const BiometricsText: React.FunctionComponent<TStateProps> = ({
  biometricsType,
  biometricsState,
}) => {
  invariant(biometricsType !== undefined, "Biometrics type should be defined");

  if (biometricsType === BIOMETRICS_NONE) {
    return <>To use the Neufund app, you need a device with biometrics authentication support.</>;
  }

  switch (biometricsState) {
    case EBiometricsState.NO_SUPPORT:
      return (
        <>
          To use the Neufund app, you need to setup a biometrics on your phone. To do this, go to
          your phone Settings > {biometricsSettingsEntry[biometricsType]}.
        </>
      );
    case EBiometricsState.NO_ACCESS:
      return (
        <>
          To use the Neufund app, you need to allow {biometricsName[biometricsType]} access. To do
          this, go to your Phone Settings > Neufund.
        </>
      );

    case EBiometricsState.ACCESS_ALLOWED:
    case EBiometricsState.ACCESS_REQUEST_REQUIRED:
    case EBiometricsState.UNKNOWN:
      throw new StateNotAllowedError("Biometrics should be initialized and without allowed access");

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
        <BiometricsText biometricsType={biometricsType} biometricsState={biometricsState} />
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
    biometricsType: biometricsModuleApi.selectors.selectBiometricsType(state),
    biometricsState: biometricsModuleApi.selectors.selectBiometricsState(state),
  }),
})(NoBiometricsScreenLayout);

export { NoBiometricsScreen, biometricsName };
