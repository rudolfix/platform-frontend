import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Config from "react-native-config";

import logo from "assets/images/logo.png";

import { NeuGradientScreen } from "components/shared/NeuGradientScreen";
import { Button, EButtonLayout } from "components/shared/buttons/Button";
import { BodyText } from "components/shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";

import { authModuleAPI } from "modules/auth/module";

import { EAppRoutes } from "router/appRoutes";
import { useNavigationTyped } from "router/routeUtils";

import { appConnect } from "store/utils";

import { silverLighter2 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TStateProps = {
  isStateChangeInProgress: ReturnType<typeof authModuleAPI.selectors.selectIsStateChangeInProgress>;
};

type TDispatchProps = {
  createAccount: () => void;
};

const LandingLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  createAccount,
  isStateChangeInProgress,
}) => {
  const navigation = useNavigationTyped();

  return (
    <NeuGradientScreen style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Image accessibilityIgnoresInvertColors style={styles.logo} source={logo} />
      </View>

      <View style={styles.container}>
        <Headline level={EHeadlineLevel.LEVEL1} style={styles.headline}>
          Welcome
        </Headline>

        <BodyText style={styles.paragraph}>
          Join Neufund today. Setup your account to start investing.
        </BodyText>

        <Button
          style={styles.button}
          loading={isStateChangeInProgress}
          layout={EButtonLayout.PRIMARY}
          onPress={createAccount}
        >
          Create a new account
        </Button>

        <Button
          style={styles.button}
          layout={EButtonLayout.TEXT_DARK}
          onPress={() => navigation.navigate(EAppRoutes.importAccount)}
        >
          Import account
        </Button>

        {Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost" && (
          <Button
            layout={EButtonLayout.TEXT_DARK}
            onPress={() => navigation.navigate(EAppRoutes.importFixture)}
          >
            Import fixture
          </Button>
        )}
      </View>
    </NeuGradientScreen>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...spacingStyles.p5,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1.2,
  },
  logo: {
    width: 64,
    height: 74,
  },
  container: {
    justifyContent: "center",
    flex: 1.5,
  },
  headline: {
    ...spacingStyles.mb4,
    textAlign: "center",
    color: silverLighter2,
  },
  paragraph: {
    ...spacingStyles.mb5,
    ...spacingStyles.ph5,
    textAlign: "center",
    color: silverLighter2,
  },
  button: {
    ...spacingStyles.mb2,
  },
});

const LandingScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    isStateChangeInProgress: authModuleAPI.selectors.selectIsStateChangeInProgress(state),
  }),
  dispatchToProps: dispatch => ({
    createAccount: () => dispatch(authModuleAPI.actions.createAccount()),
  }),
})(LandingLayout);

export { LandingScreen };
