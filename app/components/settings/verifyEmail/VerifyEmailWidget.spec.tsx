import { expect } from "chai";
import { render, shallow } from "enzyme";
import * as React from "react";
import { wrapWithIntl } from "../../../../test/integrationTestUtils";
import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { VerifyEmailWidgetComponent } from "./VerifyEmailWidget";

describe("<VerifyEmailWidgetComponent />", () => {
  it("should render verified section", () => {
    const MyNeuWidgetComponent = shallow(
      <VerifyEmailWidgetComponent
        step={1}
        isThereUnverifiedEmail={true}
        isUserEmailVerified={true}
        doesEmailExist={true}
        resendEmail={() => {}}
        addNewEmail={() => {}}
        intl={dummyIntl}
      />,
    );
    expect(MyNeuWidgetComponent.find(tid("unverified-section"))).to.have.length(0);
    expect(MyNeuWidgetComponent.find(tid("verified-section"))).to.have.length(1);
  });

  it("should render unverified section", () => {
    const MyNeuWidgetComponent = shallow(
      <VerifyEmailWidgetComponent
        step={1}
        isThereUnverifiedEmail={true}
        isUserEmailVerified={false}
        doesEmailExist={true}
        resendEmail={() => {}}
        addNewEmail={() => {}}
        intl={dummyIntl}
      />,
    );
    expect(MyNeuWidgetComponent.find(tid("unverified-section"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("verified-section"))).to.have.length(0);
  });

  it("should not render resend link button", () => {
    const MyNeuWidgetComponent = shallow(
      <VerifyEmailWidgetComponent
        step={1}
        isThereUnverifiedEmail={false}
        isUserEmailVerified={false}
        doesEmailExist={false}
        resendEmail={() => {}}
        addNewEmail={() => {}}
        intl={dummyIntl}
      />,
    );
    expect(MyNeuWidgetComponent.find(tid("resend-link"))).to.have.length(0);
  });

  it("should render resend link button", () => {
    const MyNeuWidgetComponent = render(
      wrapWithIntl(
        <VerifyEmailWidgetComponent
          step={1}
          isThereUnverifiedEmail={true}
          isUserEmailVerified={false}
          doesEmailExist={true}
          resendEmail={() => {}}
          addNewEmail={() => {}}
          intl={dummyIntl}
        />,
      ),
    );
    expect(MyNeuWidgetComponent.find(tid("resend-link"))).to.have.length(1);
  });
});
