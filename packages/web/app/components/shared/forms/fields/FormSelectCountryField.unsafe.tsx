import { COUNTRIES, Dictionary } from "@neufund/shared";
import { FieldAttributes } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../../types";
import { FormSelectField, NONE_KEY } from "./FormSelectField";

const VALUES: Dictionary<TTranslatedString> = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  ...COUNTRIES,
};

interface IFieldGroup {
  label?: string;
  "data-test-id"?: string;
}

type FieldGroupProps = IFieldGroup & FieldAttributes<any>;

const FormSelectCountryField: React.FunctionComponent<FieldGroupProps> = props => (
  <FormSelectField {...props} values={VALUES} />
);

export { FormSelectCountryField, VALUES };
