import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { wrapWithIntl } from "../../../../test/integrationTestUtils";
import { tid } from "../../../../test/testUtils";
import { dummyIntl } from "../../../utils/injectIntlHelpers.fixtures";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { KycStatusWidgetComponent } from "./KycStatusWidget";

describe("<KycStatusWidgetComponent />", () => {
  it("should render verified section", () => {
    const MyNeuWidgetComponent = shallow(
      wrapWithIntl(
        <KycStatusWidgetComponent
          step={1}
          onGoToKycHome={() => {}}
          requestStatus="Accepted"
          intl={dummyIntl}
          isUserEmailVerified={true}
          isLoading={false}
        />,
      ),
    );
    expect(MyNeuWidgetComponent.find(tid("unverified-section"))).to.have.length(0);
    expect(MyNeuWidgetComponent.find(tid("verified-section"))).to.have.length(1);
  });

  it("should render unverified section", () => {
    const MyNeuWidgetComponent = shallow(
      wrapWithIntl(
        <KycStatusWidgetComponent
          step={1}
          onGoToKycHome={() => {}}
          requestStatus="Draft"
          intl={dummyIntl}
          isUserEmailVerified={true}
          isLoading={false}
        />,
      ),
    );
    expect(MyNeuWidgetComponent.find(tid("unverified-section"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("verified-section"))).to.have.length(0);
  });

  it("should render loading indicator", () => {
    const MyNeuWidgetComponent = shallow(
      wrapWithIntl(
        <KycStatusWidgetComponent
          step={1}
          intl={dummyIntl}
          onGoToKycHome={() => {}}
          isUserEmailVerified={true}
          isLoading={true}
        />,
      ),
    );
    expect(MyNeuWidgetComponent.find(LoadingIndicator)).to.have.length(1);
  });
});
