import * as React from "react";

import { TDataTestId } from "../../types";
import { ILayoutUnauthProps, LayoutUnauthorized, TContentExternalProps } from "./Layout";

import * as styles from "./Layout.module.scss";

export const TransitionalLayout: React.FunctionComponent<
  TDataTestId & TContentExternalProps & ILayoutUnauthProps
> = ({ children, hideHeaderCtaButtons = false, "data-test-id": dataTestId, ...contentProps }) => (
  <div className={styles.layout} data-test-id={dataTestId}>
    <LayoutUnauthorized {...contentProps} hideHeaderCtaButtons={hideHeaderCtaButtons}>
      {children}
    </LayoutUnauthorized>
  </div>
);
