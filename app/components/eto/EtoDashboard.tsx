import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/SettingsWidgets";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { DashboardSection } from "./shared/DashboardSection";

export const EtoDashboard: React.SFC = () => (
  <LayoutAuthorized>
    <DashboardSection step={1} title="VERIFICATION" data-test-id="eto-dashboard-verification">
      <SettingsWidgets />
    </DashboardSection>
    <DashboardSection step={2} title="ETO APPLICATION" data-test-id="eto-dashboard-application">
      <ETOFormsProgressSection />
    </DashboardSection>
  </LayoutAuthorized>
);
