import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { LayoutBase } from "../layouts/LayoutBase";

export const ErrorBoundaryLayoutBase: React.SFC<{}> = () => {
  return (
    <LayoutBase>
      <FormattedMessage id="error-boundary.widget-error-message" />
    </LayoutBase>
  );
};
