import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { Layout } from "../../layouts/Layout";
import { withContainer } from "../hocs/withContainer";

import * as styles from "./ErrorBoundaryLayout.module.scss";

export const ErrorBoundaryComponent: React.FunctionComponent<{}> = () => (
  <div className={styles.layout}>
    <FormattedMessage id="error-boundary.main-error-message" />
  </div>
);

export const ErrorBoundaryLayout = compose(withContainer(Layout))(ErrorBoundaryComponent);
