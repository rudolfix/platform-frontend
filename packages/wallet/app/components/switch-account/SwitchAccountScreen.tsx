import * as React from "react";
import { StyleSheet } from "react-native";
import { authModuleAPI, EAuthState } from "../../modules/auth/module";
import { appConnect } from "../../store/utils";

import { spacingStyles } from "../../styles/spacings";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { Screen } from "../shared/Screen";
import fixtures from "../../lib/contracts/fixtures.json";
import { SelectList } from "../shared/forms/layouts/select-list/SelectList";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  importExistingAccount: (privateKeyOrMnemonic: string, name: string) => void;
};

const SwitchAccountLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  authState,
  importExistingAccount,
}) => {
  return (
    <Screen contentContainerStyle={styles.content}>
      <SelectList
        style={styles.list}
        items={Object.values(fixtures).map(fixture => ({
          id: fixture.address,
          title: fixture.name,
          subTitle: fixture.address,
        }))}
        selectedItemId={Object.values(fixtures)[0]!.address}
      ></SelectList>

      <Button
        loading={authState === EAuthState.AUTHORIZING}
        layout={EButtonLayout.PRIMARY}
        onPress={() => importExistingAccount("", "")}
      >
        Connect account
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    ...spacingStyles.p4,
    flex: 1,
  },
  list: {
    flex: 1,
    ...spacingStyles.mv5,
  },
});

const SwitchAccountScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authState: authModuleAPI.selectors.selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    importExistingAccount: (privateKeyOrMnemonic: string) =>
      dispatch(authModuleAPI.actions.importNewAccount(privateKeyOrMnemonic)),
  }),
})(SwitchAccountLayout);

export { SwitchAccountScreen };
