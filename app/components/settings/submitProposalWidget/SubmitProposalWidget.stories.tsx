import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { SubmitProposalWidgetComponent } from "./SubmitProposalWidget";

storiesOf("SubmitProposalWidget", module).add("default", () => (
  <SubmitProposalWidgetComponent submitProposal={() => {}} intl={dummyIntl} />
));
