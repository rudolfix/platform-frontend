import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../../types";
import { WarningAlert } from "../../../shared/WarningAlert";

type TMyNeuWidgetError = {
  error: TTranslatedString;
};

export const MyNeuWidgetError: React.FunctionComponent<TMyNeuWidgetError> = () => (
  <WarningAlert data-test-id="my-neu-widget-error" className="m-auto">
    <FormattedMessage id="common.error" values={{ separator: <br /> }} />
  </WarningAlert>
);
