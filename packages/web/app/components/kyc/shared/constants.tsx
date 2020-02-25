import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { BOOL_FALSE_KEY, BOOL_TRUE_KEY, NONE_KEY } from "../../shared/forms/fields/FormSelectField";

export const PEP_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-i-am" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-i-am-not" />,
};
