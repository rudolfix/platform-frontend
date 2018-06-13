import * as React from "react";

import { PanelWhite } from "../../shared/Panel";
import { IProgressStepper, ProgressStepper } from "../../shared/ProgressStepper";
import { EtoRegisterRouter } from "./Router";

export const EtoRegistrationPanel: React.SFC = () => (
  <div>
    <PanelWhite>
      <EtoRegisterRouter />
    </PanelWhite>
  </div>
);
