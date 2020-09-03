import * as React from "react";
import { StyleSheet } from "react-native";

import { EStatusBarStyle, SafeAreaScreen } from "components/shared/Screen";
import { BodyText } from "components/shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";

import { authModuleAPI } from "modules/auth/module";

import { appConnect } from "store/utils";

import { baseGray, grayLighter2 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

import { ImportAccountScreenForm } from "./ImportAccountScreenForm";

type TStateProps = {
  isStateChangeInProgress: ReturnType<typeof authModuleAPI.selectors.selectIsStateChangeInProgress>;
};

type TDispatchProps = {
  importExistingAccount: (privateKeyOrMnemonic: string) => void;
};

const ImportAccountLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  isStateChangeInProgress,
  importExistingAccount,
}) => (
  <SafeAreaScreen contentContainerStyle={styles.content} statusBarStyle={EStatusBarStyle.WHITE}>
    <Headline style={styles.headline} level={EHeadlineLevel.LEVEL2}>
      Connect an account
    </Headline>

    <BodyText style={styles.paragraph}>
      Enter your recovery phrase/private key to import and connect your Ethereum wallet to Neufund.
    </BodyText>

    <ImportAccountScreenForm
      isStateChangeInProgress={isStateChangeInProgress}
      importExistingAccount={importExistingAccount}
    />
  </SafeAreaScreen>
);

const styles = StyleSheet.create({
  content: {
    ...spacingStyles.p4,
    justifyContent: "flex-end",
    flex: 1,
  },
  headline: {
    color: baseGray,
  },
  paragraph: {
    ...spacingStyles.mv4,
    color: grayLighter2,
  },
});

const ImportAccountScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    isStateChangeInProgress: authModuleAPI.selectors.selectIsStateChangeInProgress(state),
  }),
  dispatchToProps: dispatch => ({
    importExistingAccount: (privateKeyOrMnemonic: string) =>
      dispatch(authModuleAPI.actions.importAccount(privateKeyOrMnemonic)),
  }),
})(ImportAccountLayout);

export { ImportAccountScreen };
