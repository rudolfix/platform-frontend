import * as React from "react";

import { Panel } from "../../shared/Panel";
import { EtoRegisterRouter } from "./Router";

export const EtoRegistrationPanel: React.SFC = () => (
  <div>
    <Panel>
      <EtoRegisterRouter />
    </Panel>
  </div>
);
