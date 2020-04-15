import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { appRoutes } from "../../appRoutes";
import { appConnect } from "../../store/utils";
import { abyssalAnchorfishBlue, silverLighter2, subterraneanRiver } from "../../styles/colors";
import { spacingStyles } from "../../styles/spacings";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { BodyText } from "../shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "../shared/typography/Headline";
import { authModuleAPI, EAuthState } from "../../modules/auth/module";

import logo from "../../../assets/images/logo.png";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  createNewAccount: () => void;
};

const LandingLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  createNewAccount,
  authState,
}) => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={[subterraneanRiver, abyssalAnchorfishBlue]} style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={logo} />
      </View>

      <View style={styles.container}>
        <Headline level={EHeadlineLevel.LEVEL1} style={styles.headline}>
          Welcome
        </Headline>

        <BodyText style={styles.paragraph}>
          Join Neufund today. Setup your account to start investing.
        </BodyText>

        <Button
          style={styles.createAccountButton}
          loading={authState === EAuthState.AUTHORIZING}
          layout={EButtonLayout.PRIMARY}
          onPress={createNewAccount}
        >
          Create a new account
        </Button>

        <Button
          layout={EButtonLayout.TEXT_DARK}
          onPress={() => navigation.navigate(appRoutes.importWallet)}
        >
          Import account
        </Button>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...spacingStyles.p5,
    flex: 1,
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
    ...spacingStyles.mb4,
    ...spacingStyles.ph5,
    textAlign: "center",
    color: silverLighter2,
  },
  createAccountButton: {
    ...spacingStyles.mb2,
  },
});

const LandingScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authState: authModuleAPI.selectors.selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    createNewAccount: () => dispatch(authModuleAPI.actions.createNewAccount()),
  }),
})(LandingLayout);

export { LandingScreen };
