import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { MoneyWithLessThan } from "./MoneyWithLessThan";
import { ECurrency, ENumberFormat, ENumberInputFormat, ENumberOutputFormat } from "./utils";

describe("MoneyWithLessThan", () => {
  it("should format money as ETH with full decimals according to `Neufund Language` style guide", () => {
    const component = shallow(
      <MoneyWithLessThan
        value={"1234567" + "0".repeat(16)}
        valueType={ECurrency.ETH}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
      />,
    );

    expect(component.render().text()).to.be.eq("12 345.6700 ETH");
  });

  it("should format money as ETH with 0 if value is zero", () => {
    const component = shallow(
      <MoneyWithLessThan
        value="0"
        valueType={ECurrency.ETH}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
      />,
    );

    expect(component.render().text()).to.be.eq("0.0000 ETH");
  });

  it("should format money as ETH with < 0.001 if the value is too small to show", () => {
    const component = shallow(
      <MoneyWithLessThan
        value={"111"}
        valueType={ECurrency.ETH}
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
      />,
    );

    expect(component.render().text()).to.be.eq("< 0.0001 ETH");
  });

  it("should format percentage with full decimals according to `Neufund Language` style guide", () => {
    const component = shallow(
      <MoneyWithLessThan
        value={"0.015"}
        valueType={ENumberFormat.PERCENTAGE}
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={ENumberOutputFormat.FULL}
      />,
    );

    expect(component.render().text()).to.be.eq("0.01 %");
  });

  it("should format percentage with < 0.01 if the value is too small to show", () => {
    const component = shallow(
      <MoneyWithLessThan
        value="0.0099"
        valueType={ENumberFormat.PERCENTAGE}
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={ENumberOutputFormat.FULL}
      />,
    );

    expect(component.render().text()).to.be.eq("< 0.01 %");
  });
});
