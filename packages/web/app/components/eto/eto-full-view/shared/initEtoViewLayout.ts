import * as React from "react";
import { compose } from "recompose";

import { TEtoViewData } from "../../../../modules/eto-view/shared/types";
import { withMetaTags } from "../../../../utils/withMetaTags";
import { Layout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../../../shared/hocs/withContainer";

export const initEtoViewLayout = (WrappedComponent: React.ComponentType<TEtoViewData>) =>
  compose<TEtoViewData, TEtoViewData>(
    createErrorBoundary(ErrorBoundaryLayout),
    withContainer(Layout),
    withMetaTags<TEtoViewData>(({ eto }) => ({
      title: `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`,
    })),
  )(WrappedComponent);
