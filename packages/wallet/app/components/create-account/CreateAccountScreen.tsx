import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Config from "react-native-config";

import { appRoutes } from "../../appRoutes";
import { appConnect } from "../../store/utils";
import { silverLighter2 } from "../../styles/colors";
import { spacingStyles } from "../../styles/spacings";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { NeuLinearGradient } from "../shared/NeuLinearGradient";
import { BodyText } from "../shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "../shared/typography/Headline";
import { authModuleAPI, EAuthState } from "../../modules/auth/module";

import logo from "../../../assets/images/logo.png";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  createAccount: () => void;
};

const CreateAccountLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  createAccount,
  authState,
}) => {
  const navigation = useNavigation();

  return (
    <NeuLinearGradient style={styles.wrapper}>
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
          style={styles.button}
          loading={authState === EAuthState.AUTHORIZING}
          layout={EButtonLayout.PRIMARY}
          onPress={createAccount}
        >
          Create a new account
        </Button>

        <Button
          style={styles.button}
          layout={EButtonLayout.TEXT_DARK}
          onPress={() => navigation.navigate(appRoutes.importAccount)}
        >
          Import account
        </Button>

        {Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost" && (
          <Button
            layout={EButtonLayout.TEXT_DARK}
            onPress={() => navigation.navigate(appRoutes.switchAccount)}
          >
            Import fixture
          </Button>
        )}
      </View>
    </NeuLinearGradient>
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
  button: {
    ...spacingStyles.mb2,
  },
});

const CreateAccountScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authState: authModuleAPI.selectors.selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    createAccount: () => dispatch(authModuleAPI.actions.createAccount()),
  }),
})(CreateAccountLayout);

export { CreateAccountScreen };
