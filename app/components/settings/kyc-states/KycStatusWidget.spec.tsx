import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { EUserType } from "../../../lib/api/users/interfaces";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { KycStatusWidgetComponent } from "./KycStatusWidget";

describe("<KycStatusWidgetComponent />", () => {
  it("should render verified section", () => {
    const component = shallow(
      <KycStatusWidgetComponent
        step={1}
        onGoToKycHome={() => {}}
        onGoToDashboard={() => {}}
        requestStatus="Accepted"
        isUserEmailVerified={true}
        backupCodesVerified={true}
        isLoading={false}
        userType={EUserType.INVESTOR}
      />,
    );

    expect(component.contains(<FormattedMessage id="settings.kyc-status-widget.status.accepted" />))
      .to.be.true;
  });

  it("should render unverified section", () => {
    const component = shallow(
      <KycStatusWidgetComponent
        step={1}
        onGoToKycHome={() => {}}
        onGoToDashboard={() => {}}
        requestStatus="Draft"
        isUserEmailVerified={true}
        backupCodesVerified={true}
        isLoading={false}
        userType={EUserType.INVESTOR}
      />,
    );

    expect(
      component.contains(
        <FormattedHTMLMessage
          tagName="span"
          id="settings.kyc-status-widget.status.draft"
          values={{ url: `${externalRoutes.neufundSupport}/home` }}
        />,
      ),
    ).to.be.true;
  });

  it("should render loading indicator", () => {
    const component = shallow(
      <KycStatusWidgetComponent
        step={1}
        onGoToKycHome={() => {}}
        onGoToDashboard={() => {}}
        isUserEmailVerified={true}
        backupCodesVerified={true}
        isLoading={true}
        userType={EUserType.INVESTOR}
      />,
    );
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });
});
