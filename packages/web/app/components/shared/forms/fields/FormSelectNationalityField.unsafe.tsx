import { NATIONALITIES } from "@neufund/shared";
import { FieldAttributes } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { FormSelectField, NONE_KEY } from "./FormSelectField";

const VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  ...NATIONALITIES,
};

interface IFieldGroup {
  label?: string;
  "data-test-id"?: string;
}

type FieldGroupProps = IFieldGroup & FieldAttributes<any>;

const FormSelectNationalityField: React.FunctionComponent<FieldGroupProps> = props => (
  <FormSelectField {...props} values={VALUES} />
);

export { FormSelectNationalityField };
