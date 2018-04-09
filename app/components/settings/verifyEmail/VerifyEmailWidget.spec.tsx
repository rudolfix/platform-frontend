import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { tid } from "../../../../test/testUtils";
import { VerifyEmailWidgetComponent } from "./VerifyEmailWidget";

describe("<VerifyEmailWidgetComponent />", () => {
  it("should render verified section", () => {
    const MyNeuWidgetComponent = shallow(
      <VerifyEmailWidgetComponent isThereUnverifiedEmail={true} isUserEmailVarified={true} />,
    );
    expect(MyNeuWidgetComponent.find(tid("unverified-section"))).to.have.length(0);
    expect(MyNeuWidgetComponent.find(tid("verified-section"))).to.have.length(1);
  });

  it("should render unverified section", () => {
    const MyNeuWidgetComponent = shallow(
      <VerifyEmailWidgetComponent isThereUnverifiedEmail={false} isUserEmailVarified={false} />,
    );
    expect(MyNeuWidgetComponent.find(tid("unverified-section"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("verified-section"))).to.have.length(0);
  });

  it("should not render resend link button", () => {
    const MyNeuWidgetComponent = shallow(
      <VerifyEmailWidgetComponent isThereUnverifiedEmail={false} isUserEmailVarified={false} />,
    );
    expect(MyNeuWidgetComponent.find(tid("resend-link"))).to.have.length(0);
  });

  it("should render resend link button", () => {
    const MyNeuWidgetComponent = shallow(
      <VerifyEmailWidgetComponent isThereUnverifiedEmail={true} isUserEmailVarified={false} />,
    );
    expect(MyNeuWidgetComponent.find(tid("resend-link"))).to.have.length(1);
  });
});
