import { expect } from "chai";
import { render, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";
import { createMount } from "../../../../test/createMount";
import { waitUntilDoesntThrow, wrapWithIntl } from "../../../../test/integrationTestUtils";
import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { VerifyEmailWidgetComponent } from "./VerifyEmailWidget";

describe("<VerifyEmailWidgetComponent />", () => {
  it("should render verified section", () => {
    const MyNeuWidgetComponent = shallow(
      <VerifyEmailWidgetComponent
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

  it("should render resend link button", () => {
    const MyNeuWidgetComponent = render(
      wrapWithIntl(
        <VerifyEmailWidgetComponent
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

  describe("email form", () => {
    it("initially submit button should be disabled", () => {
      const VerifyEmailWidget = createMount(
        wrapWithIntl(
          <VerifyEmailWidgetComponent
            isThereUnverifiedEmail={false}
            isUserEmailVerified={false}
            doesEmailExist={false}
            resendEmail={() => {}}
            addNewEmail={() => {}}
            intl={dummyIntl}
          />,
        ),
      );

      expect(
        VerifyEmailWidget.find(tid("verify-email-widget-form-submit"))
          .first()
          .prop("disabled"),
      ).to.be.true;
    });

    it("should be possible to submit with valid email", async () => {
      const addNewEmailSpy = spy();
      const verifyEmailWidget = createMount(
        wrapWithIntl(
          <VerifyEmailWidgetComponent
            isThereUnverifiedEmail={false}
            isUserEmailVerified={false}
            doesEmailExist={false}
            resendEmail={() => {}}
            addNewEmail={addNewEmailSpy}
            intl={dummyIntl}
          />,
        ),
      );

      verifyEmailWidget
        .find(tid("verify-email-widget-form-email-input"))
        .last()
        .simulate("change", {
          target: {
            name: "email",
            value: "valid@email.com",
          },
        });

      expect(
        verifyEmailWidget
          .find(tid("verify-email-widget-form-submit"))
          .first()
          .prop("disabled"),
      ).to.be.false;

      verifyEmailWidget.find("form").simulate("submit");

      await waitUntilDoesntThrow(() => {
        expect(addNewEmailSpy).to.be.calledOnce;
      }, "Form callback should be called");
    });

    it("should not be possible to submit with invalid email", async () => {
      const verifyEmailWidget = createMount(
        wrapWithIntl(
          <VerifyEmailWidgetComponent
            isThereUnverifiedEmail={false}
            isUserEmailVerified={false}
            doesEmailExist={false}
            resendEmail={() => {}}
            addNewEmail={() => {}}
            intl={dummyIntl}
          />,
        ),
      );

      verifyEmailWidget
        .find(tid("verify-email-widget-form-email-input"))
        .last()
        .simulate("change", {
          target: {
            name: "email",
            value: "not-valid",
          },
        });

      await waitUntilDoesntThrow(() => {
        verifyEmailWidget.update();
        expect(
          verifyEmailWidget
            .find(tid("verify-email-widget-form-submit"))
            .first()
            .prop("disabled"),
        ).to.be.true;
      }, "Form submit should be disabled!");
    });
  });
});
