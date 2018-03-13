import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { tid } from "../../../../test/testUtils";
import { BackupSeedWidgetComponent } from "./BackupSeedWidget";

describe("<VerifyEmailWidgetComponent />", () => {
  it("should render verified section", () => {
    const MyNeuWidgetComponent = shallow(<BackupSeedWidgetComponent backupCodesVerified />);
    expect(MyNeuWidgetComponent.find(tid("unverified-section"))).to.have.length(0);
    expect(MyNeuWidgetComponent.find(tid("verified-section"))).to.have.length(1);
  });

  it("should render unverified section", () => {
    const MyNeuWidgetComponent = shallow(<BackupSeedWidgetComponent />);
    expect(MyNeuWidgetComponent.find(tid("unverified-section"))).to.have.length(1);
    expect(MyNeuWidgetComponent.find(tid("verified-section"))).to.have.length(0);
  });
});
