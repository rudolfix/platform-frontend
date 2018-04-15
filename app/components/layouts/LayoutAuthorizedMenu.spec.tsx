import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { tid } from "../../../test/testUtils";
import { LayoutAuthorizedMenuComponent } from "./LayoutAuthorizedMenu";

describe("<LayoutAuthorizedMenuComponent />", () => {
  it("should render investor menu", () => {
    const MyNeuWidgetComponent = shallow(<LayoutAuthorizedMenuComponent userType="investor" />);

    expect(MyNeuWidgetComponent.find(tid("issuer-menu"))).to.have.length(0);
    expect(MyNeuWidgetComponent.find(tid("investor-menu"))).to.have.length(1);
  });

  it("should render issuer menu", () => {
    const MyNeuWidgetComponent = shallow(<LayoutAuthorizedMenuComponent userType="issuer" />);

    expect(MyNeuWidgetComponent.find(tid("issuer-menu"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("investor-menu"))).to.have.length(0);
  });

  it("should throw when userType is not defined", () => {
    expect(() => {
      shallow(<LayoutAuthorizedMenuComponent />);
    }).to.throw();
  });
});
