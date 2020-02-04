import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { WarningAlert } from "../../../shared/WarningAlert";

export const MyNeuWidgetError: React.FunctionComponent = () => (
  <WarningAlert data-test-id="my-neu-widget-error" className="m-auto">
    <FormattedMessage id="common.error" values={{ separator: <br /> }} />
  </WarningAlert>
);
