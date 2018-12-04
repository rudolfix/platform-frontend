import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { LayoutUnauthorized } from "../layouts/LayoutUnauthorized";

export const ErrorBoundaryLayoutUnauthorized: React.SFC<{}> = () => {
  return (
    <LayoutUnauthorized>
      <FormattedMessage id="error-boundary.widget-error-message" />
    </LayoutUnauthorized>
  );
};
