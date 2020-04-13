import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { appRoutes } from "../../appRoutes";
import { appConnect } from "../../store/utils";
import { silverLighter2 } from "../../styles/colors";
import { spacingStyles } from "../../styles/spacings";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { NeuLinearGradient } from "../shared/NeuLinearGradient";
import { EHeadlineLevel, Headline } from "../shared/typography/Headline";
import { authModuleAPI, EAuthState } from "../../modules/auth/module";

import logo from "../../../assets/images/logo.png";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  unlockAccount: () => void;
};

const UnlockWalletLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  unlockAccount,
  authState,
}) => {
  const navigation = useNavigation();

  return (
    <NeuLinearGradient style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={logo} />
      </View>

      <View style={styles.container}>
        <Headline level={EHeadlineLevel.LEVEL2} style={styles.headline}>
          Welcome back, username
        </Headline>

        <Button
          style={styles.createAccountButton}
          loading={authState === EAuthState.AUTHORIZING}
          layout={EButtonLayout.PRIMARY}
          onPress={unlockAccount}
        >
          Unlock account
        </Button>

        <Button
          layout={EButtonLayout.TEXT_DARK}
          onPress={() => navigation.navigate(appRoutes.switchAccount)}
        >
          Switch account
        </Button>
      </View>
    </NeuLinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...spacingStyles.p4,
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

const UnlockWalletScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authState: authModuleAPI.selectors.selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    unlockAccount: () => dispatch(authModuleAPI.actions.unlockAccount()),
  }),
})(UnlockWalletLayout);

export { UnlockWalletScreen };