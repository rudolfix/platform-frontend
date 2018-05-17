import { storiesOf } from "@storybook/react";
import * as React from "react";

import { KycStatusWidgetComponent } from "./KycStatusWidget";

const commonProps = {
  isUserEmailVerified: true,
  isLoading: false,
  error: undefined,
  step: 1,
  onGoToKycHome: () => {},
};

storiesOf("KycStatusWidget", module)
  .add("email-not-verified", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Draft" isUserEmailVerified={false} />)
  .add("draft", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Draft" />)
  .add("pending", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Pending" />)
  .add("rejected", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Rejected" />)
  .add("accepted", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Accepted" />)
  .add("outsourced-started", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      requestStatus="Outsourced"
      requestOutsourcedStatus="started"
    />
  ))
  .add("outsourced-aborted", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      requestStatus="Outsourced"
      requestOutsourcedStatus="aborted"
    />
  ))
  .add("outsourced-canceled", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      requestStatus="Outsourced"
      requestOutsourcedStatus="canceled"
    />
  ))
  .add("outsourced-other", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      requestStatus="Outsourced"
      requestOutsourcedStatus="other"
    />
  ))
  .add("outsourced-review_pending", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      requestStatus="Outsourced"
      requestOutsourcedStatus="review_pending"
    />
  ));
