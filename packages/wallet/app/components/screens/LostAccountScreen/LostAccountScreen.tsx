import React from "react";
import { StyleSheet, View } from "react-native";
import Config from "react-native-config";

import Illustration from "assets/illustration-we-care-about-security.svg";

import { NeuGradientScreen } from "components/shared/NeuGradientScreen";
import { Button, EButtonLayout } from "components/shared/buttons/Button";
import { BodyText } from "components/shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";

import { authModuleAPI } from "modules/auth/module";
import { EAuthState } from "modules/auth/reducer";

import { EAppRoutes } from "router/appRoutes";
import { useNavigationTyped } from "router/routeUtils";

import { appConnect } from "store/utils";

import { baseSilver, baseWhite } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  createAccount: () => void;
};

const LostAccountScreenLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  authState,
  createAccount,
}) => {
  const navigation = useNavigationTyped();

  return (
    <NeuGradientScreen style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Illustration />
      </View>

      <View style={styles.container}>
        <Headline level={EHeadlineLevel.LEVEL1} style={styles.headline}>
          We care about security
        </Headline>

        <BodyText style={styles.paragraph}>
          You recently changed your biometrics, to access Neufund please recover you account from
          your backup.
        </BodyText>

        <Button
          style={styles.button}
          layout={EButtonLayout.PRIMARY}
          onPress={() => navigation.navigate(EAppRoutes.importAccount)}
        >
          Import account
        </Button>

        <Button
          style={styles.button}
          loading={authState === EAuthState.AUTHORIZING}
          layout={EButtonLayout.TEXT_DARK}
          onPress={createAccount}
        >
          Create a new account
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
    ...spacingStyles.mb6,
  },
  button: {
    ...spacingStyles.mb2,
  },
});

const LostAccountScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authState: authModuleAPI.selectors.selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    createAccount: () => dispatch(authModuleAPI.actions.createAccount()),
  }),
})(LostAccountScreenLayout);

export { LostAccountScreen };
