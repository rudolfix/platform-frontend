import { createMount, tid } from "@neufund/shared/tests";
import { expect } from "chai";
import { mount } from "enzyme";
import noop from "lodash/noop";
import * as React from "react";

import { wrapWithBasicProviders } from "../../../../test/integrationTestUtils.unsafe";
import { MyWalletWidgetComponentLayout } from "./MyWalletWidget";

describe("<MyWalletWidget />", () => {
  let initialWalletWidgetEnabledState: any;
  let initialWalletWidgetInDashboardState: any;

  const commonProps = {
    isLoading: false,
    hasError: false,
    goToWallet: noop,
    goToPortfolio: noop,
  };

  it("should render all default components when icbm and locked wallets are connected", () => {
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED = "1";

    const props = {
      ...commonProps,

      data: {
        euroTokenAmount: "7.1827e+22",
        ethAmount: "5.9097167491542e+22",
        ethEuroAmount: "0",
        totalAmount: "7.1827e+22",
        isIcbmWalletConnected: false,
        isLockedWalletConnected: true,
      },
    };

    const component = mount(
      wrapWithBasicProviders(() => <MyWalletWidgetComponentLayout {...props} />),
    );

    expect(
      component.find(tid("my-wallet-widget-eur-token.value")).find(tid("value")),
    ).to.have.length(1);
    expect(
      component.find(tid("my-wallet-widget-eth-token.value")).find(tid("value")),
    ).to.have.length(1);
    expect(component.find(tid("my-wallet-widget-total")).find(tid("value"))).to.have.length(1);
    expect(component.find(tid("my-wallet-widget-icbm-help-text"))).to.have.length(0);
  });

  it("should render icbm help text when icbm and locked wallets are disconnected connected", () => {
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED = "1";
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_IN_DASHBOARD = "1";

    const props = {
      ...commonProps,
      data: {
        euroTokenAmount: "3.6e+22",
        ethAmount: "648200000000000000",
        ethEuroAmount: "1.2964e+23",
        totalAmount: "1.6564e+23",
        isIcbmWalletConnected: false,
        isLockedWalletConnected: false,
      },
    };

    const component = createMount(
      wrapWithBasicProviders(() => <MyWalletWidgetComponentLayout {...props} />),
    );

    expect(component.find(tid("my-wallet-widget-icbm-help-text"))).to.have.length(1);
  });

  it("should render numbers in correct format", () => {
    const props = {
      ...commonProps,
      data: {
        euroTokenAmount: "3.649e+22",
        ethAmount: "1648200000000000000",
        ethEuroAmount: "3.2964e+23",
        totalAmount: "3.6613e+23",
        isIcbmWalletConnected: false,
        isLockedWalletConnected: false,
      },
    };
    const component = createMount(
      wrapWithBasicProviders(() => <MyWalletWidgetComponentLayout {...props} />),
    );

    expect(
      component
        .find(tid("my-wallet-widget-eur-token.large-value"))
        .find(tid("value"))
        .text(),
    ).to.eq("36 490.00");
    expect(
      component
        .find(tid("my-wallet-widget-eur-token.value"))
        .find(tid("value"))
        .text(),
    ).to.eq("36 490.00");

    expect(
      component
        .find(tid("my-wallet-widget-eth-token.large-value"))
        .find(tid("value"))
        .text(),
    ).to.eq("1.6482");
    expect(
      component
        .find(tid("my-wallet-widget-eth-token.value"))
        .find(tid("value"))
        .text(),
    ).to.eq("329 640.00");

    expect(
      component
        .find(tid("my-wallet-widget-total"))
        .find(tid("value"))
        .text(),
    ).to.eq("366 130.00"); //329 640.00 + 36 490.00
    expect(
      component
        .find(tid("my-wallet-widget-total"))
        .find(tid("units"))
        .text(),
    ).to.eq(" EUR");
  });

  beforeEach(() => {
    initialWalletWidgetEnabledState = process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED;
    initialWalletWidgetInDashboardState = process.env.NF_CHECK_LOCKED_WALLET_WIDGET_IN_DASHBOARD;
  });

  afterEach(() => {
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED = initialWalletWidgetEnabledState;
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_IN_DASHBOARD = initialWalletWidgetInDashboardState;
  });
});
