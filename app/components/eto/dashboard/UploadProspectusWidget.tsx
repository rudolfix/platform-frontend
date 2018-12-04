import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";
import { createErrorBoundary } from "../../shared/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../shared/ErrorBoundaryPanel";

export const UploadProspectusWidgetComponent: React.SFC<{}> = () => (
  <DashboardLinkWidget
    title={<FormattedMessage id={"settings.upload-prospectus.title"} />}
    text={<FormattedMessage id="settings.upload-prospectus-please-upload-prospectus" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-prospectus.title" />}
  />
);

export const UploadProspectusWidget = compose(createErrorBoundary(ErrorBoundaryPanel))(
  UploadProspectusWidgetComponent,
);
