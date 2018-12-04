import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";

export const ErrorBoundaryLayoutAuthorized: React.SFC<{}> = () => {
  return (
    <LayoutAuthorized>
      <FormattedMessage id="error-boundary.widget-error-message" />
    </LayoutAuthorized>
  );
};
