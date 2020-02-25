import { withContainer } from "@neufund/shared";
import * as React from "react";
import { withProps } from "recompose";
import { compose } from "redux";

import { EContentWidth } from "../../layouts/Content";
import { FullscreenProgressLayout } from "../../layouts/FullscreenProgressLayout";
import { TContentExternalProps } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";

const RecoverWalletMain = React.lazy(() =>
  import("./recovery/RecoverWallet").then(imp => ({ default: imp.RecoverWallet })),
);

export const WalletRecoverMain: React.FunctionComponent = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(FullscreenProgressLayout),
  ),
)(RecoverWalletMain);
