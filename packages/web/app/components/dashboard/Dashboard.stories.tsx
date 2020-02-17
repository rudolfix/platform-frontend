import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DashboardLayout } from "./Dashboard";
import { DashboardTitleLarge, DashboardTitleSmall } from "./DashboardTitle";

storiesOf("Dashboard", module).add("Dashboard", () => (
  <DashboardLayout shouldShowOnboarding={false} />
));

storiesOf("DashboardTitle", module)
  .add("DashboardTitle small", () => <DashboardTitleSmall firstName="Moe" />)
  .add("DashboardTitle large", () => <DashboardTitleLarge />);
