import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { VerifyEmailWidgetComponent } from "./VerifyEmailWidget";

storiesOf("VerifyEmailWidgetComponent", module)
  .add("verified email", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      isUserEmailVerified={true}
      isThereUnverifiedEmail={false}
      resendEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
      verifiedEmail="email@test.com"
    />
  ))
  .add("unverified and verified emails", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      isUserEmailVerified={true}
      isThereUnverifiedEmail={true}
      resendEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
      unverifiedEmail="email@test.com"
      verifiedEmail="verified_email@test.com"
    />
  ))
  .add("unverified email", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      isUserEmailVerified={false}
      isThereUnverifiedEmail={true}
      resendEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
      unverifiedEmail="email@test.com"
    />
  ))
  .add("no email", () => (
    <VerifyEmailWidgetComponent
      intl={dummyIntl}
      isUserEmailVerified={false}
      isThereUnverifiedEmail={false}
      resendEmail={() => {}}
      addNewEmail={() => {}}
      step={1}
    />
  ));
