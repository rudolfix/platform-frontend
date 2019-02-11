import { storiesOf } from "@storybook/react";
import * as React from "react";

import { mockedStore } from '../../../test/fixtures/mockedStore';
import { withStore } from "../../utils/storeDecorator";
import { Settings } from "./Settings";

storiesOf("SettingsWidgets", module)
  .addDecorator(
    withStore(mockedStore),
  )
  .add("Dashboard", () => <Settings />);
