import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { MyWalletWidget } from "./MyWalletWidget";

import { tid } from "../../../../test/testUtils";

describe("<MyWalletWidget />", () => {
  let props: any;

  beforeEach(() => {
    props = {
      euroTokenAmount: "36490" + "0".repeat(18),
      euroTokenEuroAmount: "36490" + "0".repeat(18),
      ethAmount: "66482" + "0".repeat(14),
      ethEuroAmount: "6004904646" + "0".repeat(16),
      percentage: "-3.67",
      totalAmount: "637238" + "0".repeat(18),
    };

    it("should render all important components", () => {
      const MyWalletWidgetComponent = shallow(<MyWalletWidget {...props} />);

      expect(MyWalletWidgetComponent.find(tid("euro-widget"))).to.have.length(1);
      expect(MyWalletWidgetComponent.find(tid("eth-widget"))).to.have.length(1);
      expect(MyWalletWidgetComponent.find(tid("total-widget"))).to.have.length(1);
    });
  });
});
