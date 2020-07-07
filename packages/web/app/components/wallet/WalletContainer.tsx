import * as React from "react";
import { compose } from "redux";

import { withMetaTags } from "../../utils/withMetaTags";
import { Layout } from "../layouts/Layout";
import { WidgetGrid } from "../layouts/WidgetGrid";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../shared/hocs/withContainer";

export const WalletContainerBase: React.FunctionComponent = ({ children }) => (
  <WidgetGrid data-test-id="wallet-start-container">{children}</WidgetGrid>
);

export const WalletContainer = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("wallet.title") })),
)(WalletContainerBase);
