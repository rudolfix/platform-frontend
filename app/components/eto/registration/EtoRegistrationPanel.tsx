import * as React from "react";

import { PanelWhite } from "../../shared/PanelWhite";
import { IProgressStepper, ProgressStepper } from "../../shared/ProgressStepper";
import { EtoProgressBar } from "./EtoProgressBar";
import { EtoRegisterRouter } from "./Router";

export const EtoRegistrationPanel: React.SFC = () => (
  <div>
    <PanelWhite>
      <EtoProgressBar className="my-5" />

      <div className="pb-3">
        <EtoRegisterRouter />
      </div>
    </PanelWhite>
  </div>
);
