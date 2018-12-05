import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";

import * as styles from "./ErrorBoundary.module.scss";

export const ErrorBoundaryLayoutAuthorized: React.SFC<{}> = () => {
  return (
    <LayoutAuthorized>
      <div className={styles.errorLayout}>
        <FormattedMessage id="error-boundary.main-error-message" />
      </div>
    </LayoutAuthorized>
  );
};
