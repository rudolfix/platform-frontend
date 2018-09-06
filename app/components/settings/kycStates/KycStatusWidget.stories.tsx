import { storiesOf } from "@storybook/react";
import * as React from "react";
import { TUserType } from "../../../lib/api/users/interfaces";

import { KycStatusWidgetComponent } from "./KycStatusWidget";

const commonProps = {
  isUserEmailVerified: true,
  isLoading: false,
  error: undefined,
  step: 1,
  userType: "investor" as TUserType,
  onGoToKycHome: () => {},
  onGoToWallet: () => {},
};

storiesOf("KYC/StatusWidget", module)
  .add("email-not-verified", () => (
    <KycStatusWidgetComponent {...commonProps} requestStatus="Draft" isUserEmailVerified={false} />
  ))
  .add("draft", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Draft" />)
  .add("pending", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Pending" />)
  .add("rejected", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Rejected" />)
  .add("accepted", () => <KycStatusWidgetComponent {...commonProps} requestStatus="Accepted" />)
  .add("outsourced-started", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType="investor"
      requestStatus="Outsourced"
      requestOutsourcedStatus="started"
    />
  ))
  .add("outsourced-aborted", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType="investor"
      requestStatus="Outsourced"
      requestOutsourcedStatus="aborted"
    />
  ))
  .add("outsourced-canceled", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType="investor"
      requestStatus="Outsourced"
      requestOutsourcedStatus="canceled"
    />
  ))
  .add("outsourced-other", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType="investor"
      requestStatus="Outsourced"
      requestOutsourcedStatus="other"
    />
  ))
  .add("outsourced-review_pending", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType="investor"
      requestStatus="Outsourced"
      requestOutsourcedStatus="review_pending"
    />
  ));
