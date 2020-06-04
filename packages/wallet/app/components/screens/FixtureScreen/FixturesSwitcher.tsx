import { nonNullable } from "@neufund/shared-utils";
import Fuse from "fuse.js";
import * as React from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import { SafeAreaScreen } from "components/shared/Screen";
import { Button, EButtonLayout } from "components/shared/buttons/Button";
import { Field } from "components/shared/forms/fields/Field";
import { Form } from "components/shared/forms/fields/Form";
import { EFieldType } from "components/shared/forms/layouts/FieldLayout";

import fixtures from "lib/contracts/fixtures.json";

import { EAuthState } from "modules/auth/module";
import { walletEthModuleApi } from "modules/eth/module";

import { spacingStyles } from "styles/spacings";

type TExternalProps = {
  authState: EAuthState;
  changeAccount: (privateKeyOrMnemonic: string, name: string) => void;
};

const validationSchema = Yup.object({
  filter: Yup.string(),
  address: walletEthModuleApi.utils.ethereumAddress().required(),
});

type TFormValue = Yup.InferType<typeof validationSchema>;

const INITIAL_VALUES = {
  filter: "",
  address: "" as TFormValue["address"],
};

const UIFixtures = Object.values(fixtures).map(fixture => ({
  id: fixture.address,
  title: fixture.name,
  subTitle: fixture.address,
}));

const fuse = new Fuse(UIFixtures, { keys: ["id", "title"], shouldSort: false, threshold: 0.4 });

const FixturesSwitcher: React.FunctionComponent<TExternalProps> = ({
  authState,
  changeAccount,
}) => {
  return (
    <SafeAreaScreen contentContainerStyle={styles.content}>
      <Form<TFormValue>
        validationSchema={validationSchema}
        initialValues={INITIAL_VALUES}
        onSubmit={values => {
          const fixture = fixtures[values.address as keyof typeof fixtures];

          changeAccount(nonNullable(fixture.privateKey), nonNullable(fixture.name));
        }}
      >
        {({ handleSubmit, isValid, values }) => {
          const items = values.filter
            ? fuse.search(values.filter).map(result => result.item)
            : UIFixtures;

          return (
            <>
              <Field
                name="filter"
                type={EFieldType.INPUT}
                placeholder="Filter by name or address..."
              />

              <Field name="address" style={styles.list} type={EFieldType.SWITCHER} items={items} />

              <Button
                disabled={!isValid}
                loading={authState === EAuthState.AUTHORIZING}
                layout={EButtonLayout.PRIMARY}
                onPress={handleSubmit}
              >
                Connect account
              </Button>
            </>
          );
        }}
      </Form>
    </SafeAreaScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    ...spacingStyles.p4,
    flex: 1,
  },
  list: {
    ...spacingStyles.mt2,
    ...spacingStyles.mb5,
    flex: 1,
  },
});

export { FixturesSwitcher };
