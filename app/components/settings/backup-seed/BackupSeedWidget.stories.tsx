import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BackupSeedWidgetComponent } from "./BackupSeedWidget";

storiesOf("BackupSeedWidget", module)
  .add("verified backup codes", () => <BackupSeedWidgetComponent step={1} backupCodesVerified />)
  .add("unverified backup codes", () => (
    <BackupSeedWidgetComponent step={1} backupCodesVerified={false} />
  ));
