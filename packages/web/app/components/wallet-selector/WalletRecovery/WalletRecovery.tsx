import * as React from "react";
import { withProps } from "recompose";
import { compose } from "redux";

import { EContentWidth } from "../../layouts/Content";
import { FullscreenProgressLayout } from "../../layouts/FullscreenProgressLayout";
import { TContentExternalProps } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../../shared/hocs/withContainer";

const RecoverWalletComponent = React.lazy(() =>
  import("./RecoverWallet/RecoverWallet").then(imp => ({ default: imp.RecoverWallet })),
);

export const WalletRecovery: React.FunctionComponent = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(
    withProps<TContentExternalProps, {}>({
      width: EContentWidth.SMALL,
      "data-test-id": "recover-layout",
    })(FullscreenProgressLayout),
  ),
)(RecoverWalletComponent);
