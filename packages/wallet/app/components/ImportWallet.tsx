import * as React from "react";
import { StyleSheet, InteractionManager } from "react-native";
import * as Yup from "yup";
import { authModuleAPI, EAuthState } from "../modules/auth/module";
import { ethereumHdPath, ethereumPrivateKey } from "../modules/eth/lib/schemas";
import { appConnect } from "../store/utils";
import { baseGray } from "../styles/colors";

import { spacingStyles } from "../styles/spacings";
import { TComponentRefType } from "../utils/types";
import { oneOfSchema } from "../utils/yupSchemas";
import { Button, EButtonLayout } from "./shared/buttons/Button";
import { Form } from "./shared/forms/fields/Form";
import { EFieldType } from "./shared/forms/layouts/FieldLayout";
import { Field } from "./shared/forms/fields/Field";
import { TextAreaInput } from "./shared/forms/layouts/TextAreaInput";
import { Screen } from "./shared/Screen";
import { EHeadlineLevel, Headline } from "./shared/typography/Headline";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  importExistingAccount: (privateKeyOrMnemonic: string) => void;
};

const validationSchema = Yup.object().shape({
  phrase: oneOfSchema(
    [ethereumPrivateKey(), ethereumHdPath()],
    "Invalid Private Key or Recovery Phrase",
  ).required(),
});

type TFormValue = Yup.InferType<typeof validationSchema>;

const INITIAL_VALUES: TFormValue = {
  phrase: "" as any,
};

const ImportWalletLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  authState,
  importExistingAccount,
}) => {
  const inputRef = React.useCallback((ref: TComponentRefType<typeof TextAreaInput>) => {
    // focus needs to be done after all stack related animations have been finished
    // otherwise the input got's blurred almost immediately
    InteractionManager.runAfterInteractions(() => {
      if (ref) {
        ref.focus();
      }
    });
  }, []);

  return (
    <Screen contentContainerStyle={styles.content}>
      <Headline level={EHeadlineLevel.LEVEL2} style={styles.headline}>
        Connect existing account
      </Headline>

      <Form<TFormValue>
        validationSchema={validationSchema}
        initialValues={INITIAL_VALUES}
        onSubmit={values => importExistingAccount(values.phrase)}
      >
        {({ handleSubmit, isValid }) => (
          <>
            <Field
              name="phrase"
              inputRef={inputRef}
              type={EFieldType.TEXT_AREA}
              placeholder="Enter your Private Key or Recovery Phrase"
              helperText="Separate your 12/24 recovery phrase words with a space."
            />

            <Button
              style={styles.importAccountButton}
              disabled={!isValid}
              loading={authState === EAuthState.AUTHORIZING}
              layout={EButtonLayout.PRIMARY}
              onPress={handleSubmit}
            >
              Import account
            </Button>
          </>
        )}
      </Form>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headline: {
    ...spacingStyles.mb4,
    color: baseGray,
  },
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
