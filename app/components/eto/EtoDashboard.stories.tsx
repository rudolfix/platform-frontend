import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Row } from "reactstrap";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { withStore } from "../../utils/storeDecorator";
import { EtoDashboardStateViewComponent } from "./EtoDashboard";

const state = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))
  .add("State OnChain", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...state} />
    </Row>
  ));
