import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

type TExternalProps = {
  value: boolean;
};

const FormatBoolean: React.FunctionComponent<TExternalProps> = ({ value }) => {
  switch (value) {
    case true:
      return <FormattedMessage id="form.select.yes" />;
    case false:
      return <FormattedMessage id="form.select.no" />;
  }
};

export { FormatBoolean };
