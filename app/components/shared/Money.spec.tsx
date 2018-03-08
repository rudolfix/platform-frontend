import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { MoneyComponent } from "./Money";

describe("Money", () => {
  it("should format money", () => {
    const component = shallow(<MoneyComponent value="1234567" decimals={2} currency="eth" />);

    expect(component.text()).to.be.eq("12 345.6700 ETH");
  });

  it("should not add thousand separator format money", () => {
    const component = shallow(
      <MoneyComponent value="1234567" decimals={2} currency="eth" doNotSeparateThousands />,
    );

    expect(component.text()).to.be.eq("12345.6700 ETH");
  });
});
