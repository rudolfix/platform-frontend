import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { UploadProspectusWidgetComponent } from "./UploadProspectusWidget";

storiesOf("UploadProspectusWidget", module).add("default", () => (
  <UploadProspectusWidgetComponent intl={dummyIntl} />
));
