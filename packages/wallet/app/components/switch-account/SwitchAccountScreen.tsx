import * as React from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";
import { authModuleAPI, EAuthState } from "../../modules/auth/module";
import { appConnect } from "../../store/utils";

import { spacingStyles } from "../../styles/spacings";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { Field } from "../shared/forms/fields/Field";
import { Form } from "../shared/forms/fields/Form";
import { EFieldType } from "../shared/forms/layouts/FieldLayout";
import { Screen } from "../shared/Screen";
import { walletEthModuleApi } from "../../modules/eth/module";
import fixtures from "../../lib/contracts/fixtures.json";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  importExistingAccount: (privateKeyOrMnemonic: string, name: string) => void;
};

const validationSchema = Yup.object({
  address: walletEthModuleApi.utils.ethereumAddress().required(),
});

type TFormValue = Yup.InferType<typeof validationSchema>;

const INITIAL_VALUES = {
  address: "" as TFormValue["address"],
};

const SwitchAccountLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  authState,
  importExistingAccount,
}) => {
  return (
    <Screen contentContainerStyle={styles.content}>
      <Form<TFormValue>
        validationSchema={validationSchema}
        initialValues={INITIAL_VALUES}
        onSubmit={values => {
          const fixture = fixtures[values.address as keyof typeof fixtures];

          importExistingAccount(fixture.privateKey!, fixture.name!);
        }}
      >
        {({ handleSubmit, isValid }) => (
          <>
            <Field
              name="address"
              style={styles.list}
              type={EFieldType.SWITCHER}
              items={Object.values(fixtures).map(fixture => ({
                id: fixture.address,
                title: fixture.name,
                subTitle: fixture.address,
              }))}
            />

            <Button
              disabled={!isValid}
              loading={authState === EAuthState.AUTHORIZING}
              layout={EButtonLayout.PRIMARY}
              onPress={handleSubmit}
            >
              Connect account
            </Button>
          </>
        )}
      </Form>
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
    importExistingAccount: (privateKeyOrMnemonic: string, name: string) =>
      dispatch(authModuleAPI.actions.importAccount(privateKeyOrMnemonic, name, true)),
  }),
})(SwitchAccountLayout);

export { SwitchAccountScreen };
