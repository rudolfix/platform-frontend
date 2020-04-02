import { useHeaderHeight } from "@react-navigation/stack";
import { useSafeArea } from "react-native-safe-area-context";
import * as React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  SafeAreaView,
  Platform,
  InteractionManager,
} from "react-native";
import { authModuleAPI, EAuthState } from "../modules/auth/module";
import { appConnect } from "../store/utils";

import { spacingStyles } from "../styles/spacings";
import { TComponentRefType } from "../utils/types";
import { Button, EButtonLayout } from "./shared/buttons/Button";
import { EFieldType, Field } from "./shared/forms/layouts/Field";
import { TextAreaInput } from "./shared/forms/layouts/TextAreaInput";
import { Screen } from "./shared/Screen";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  importExistingAccount: (privateKeyOrMnemonic: string) => void;
};

const ImportWalletLayout: React.FunctionComponent = ({ authState, importExistingAccount }) => {
  const inputRef = React.useCallback((ref: TComponentRefType<typeof TextAreaInput>) => {
    InteractionManager.runAfterInteractions(() => {
      if (ref) {
        ref.focus();
      }
    });
  }, []);

  const [value, setValue] = React.useState("");

  return (
    <Screen contentContainerStyle={styles.content}>
      <Field
        onChangeText={setValue}
        inputRef={inputRef}
        type={EFieldType.TEXT_AREA}
        placeholder="Enter your Private Key or Recovery Phrase"
        helperText="Separate your 12/24 recovery phrase words with a space."
      />

      <Button
        style={styles.importAccountButton}
        loading={authState === EAuthState.AUTHORIZING}
        layout={EButtonLayout.PRIMARY}
        onPress={() => importExistingAccount(value)}
      >
        Import account
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    ...spacingStyles.p4,
    justifyContent: "flex-end",
    flex: 1,
  },
  importAccountButton: {
    ...spacingStyles.mt2,
  },
});

const ImportWallet = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authState: authModuleAPI.selectors.selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    importExistingAccount: (privateKeyOrMnemonic: string) =>
      dispatch(authModuleAPI.actions.importNewAccount(privateKeyOrMnemonic)),
  }),
})(ImportWalletLayout);

export { ImportWallet };
