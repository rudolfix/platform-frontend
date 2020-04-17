import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, InteractionManager } from "react-native";
import * as Yup from "yup";
import { authModuleAPI, EAuthState } from "../../modules/auth/module";
import { ethereumMnemonic, ethereumPrivateKey } from "../../modules/eth/lib/schemas";
import { appConnect } from "../../store/utils";
import { baseGray, grayLighter2 } from "../../styles/colors";

import { spacingStyles } from "../../styles/spacings";
import { TComponentRefType } from "../../utils/types";
import { oneOfSchema } from "../../utils/yupSchemas";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { Form } from "../shared/forms/fields/Form";
import { EFieldType } from "../shared/forms/layouts/FieldLayout";
import { Field } from "../shared/forms/fields/Field";
import { TextAreaInput } from "../shared/forms/layouts/TextAreaInput";
import { SafeAreaScreen } from "../shared/Screen";
import { BodyText } from "../shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "../shared/typography/Headline";

type TStateProps = {
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
};

type TDispatchProps = {
  importExistingAccount: (privateKeyOrMnemonic: string) => void;
};

const ethereumPrivateKeyUISchema = ethereumPrivateKey().transform(value => {
  // Some tools generate private key without hex prefix
  // to allow importing such invalid private keys
  // add hex prefix manually if it doesn't exist
  if (!value.startsWith("0x")) {
    return "0x" + value;
  }

  return value;
});
const validationSchema = Yup.object({
  phrase: oneOfSchema(
    [ethereumPrivateKeyUISchema, ethereumMnemonic()],
    "Invalid recovery phrase or private key",
  ).required(),
});

type TFormValue = Yup.InferType<typeof validationSchema>;

const INITIAL_VALUES = {
  phrase: "" as TFormValue["phrase"],
};

const ImportAccountLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  authState,
  importExistingAccount,
}) => {
  const navigation = useNavigation();

  const inputRef = React.useCallback((ref: TComponentRefType<typeof TextAreaInput>) => {
    // focus needs to be done after all stack related animations have been finished
    // otherwise the input got's blurred almost immediately
    InteractionManager.runAfterInteractions(() => {
      // only focus input if the view is still focused
      if (ref && navigation.isFocused()) {
        ref.focus();
      }
    });
  }, []);

  return (
    <SafeAreaScreen contentContainerStyle={styles.content}>
      <Headline level={EHeadlineLevel.LEVEL2}>Connect an account</Headline>

      <BodyText style={styles.paragraph}>
        Enter your recovery phrase/private key to import and connect your Ethereum wallet to
        Neufund.
      </BodyText>

      <Form<TFormValue>
        validationSchema={validationSchema}
        initialValues={INITIAL_VALUES}
        onSubmit={values => {
          const { phrase } = validationSchema.cast(values);
          importExistingAccount(phrase);
        }}
      >
        {({ handleSubmit, isValid }) => (
          <>
            <Field
              name="phrase"
              inputRef={inputRef}
              type={EFieldType.TEXT_AREA}
              helperText="Separate your 12/24 recovery phrase words with a space."
            />

            <Button
              style={styles.importAccountButton}
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
    </SafeAreaScreen>
  );
};

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
  importAccountButton: {
    ...spacingStyles.mt2,
    ...spacingStyles.mb2,
  },
});

const ImportAccountScreen = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    authState: authModuleAPI.selectors.selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    importExistingAccount: (privateKeyOrMnemonic: string) =>
      dispatch(authModuleAPI.actions.importAccount(privateKeyOrMnemonic)),
  }),
})(ImportAccountLayout);

export { ImportAccountScreen };
