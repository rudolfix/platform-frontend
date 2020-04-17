import { withContainer } from "@neufund/shared-utils";
import * as React from "react";
import { compose, withProps } from "recompose";

import { EContentWidth } from "../../layouts/Content";
import { Layout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";

const UnsubscriptionModule = React.lazy(() =>
  import("./UnsubscriptionModule").then(imp => ({ default: imp.UnsubscriptionModule })),
);

const Unsubscription = compose<
  React.ComponentProps<typeof UnsubscriptionModule>,
  React.ComponentProps<typeof UnsubscriptionModule>
>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(
    withProps<React.ComponentProps<typeof Layout>, {}>({
      width: EContentWidth.FULL,
    })(Layout),
  ),
)(UnsubscriptionModule);

export { Unsubscription };
