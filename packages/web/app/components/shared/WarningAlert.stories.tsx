import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EWarningAlertSize, WarningAlert } from "./WarningAlert";

storiesOf("Atoms/WarningAlert", module)
  .add("default", () => <WarningAlert>Alert message</WarningAlert>)
  .add("multiline", () => (
    <div style={{ maxWidth: "20rem" }}>
      <WarningAlert>
        Bei der Zulassungsbehörde werden derzeit keine Zulassungsvorgänge eingelagert. Vielmehr
        verbleiben diese bis zur Bearbeitung bei dem beauftragten Zulassungsdienst! Die Bearbeitung
        erfolgt in der Regel von einem Werktag zum nächsten.
      </WarningAlert>
    </div>
  ))
  .add("big", () => <WarningAlert size={EWarningAlertSize.BIG}>Alert message</WarningAlert>);
