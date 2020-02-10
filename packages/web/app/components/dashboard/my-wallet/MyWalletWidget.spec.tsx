import { convertToUlps } from "@neufund/shared";
import { expect } from "chai";
import { mount } from "enzyme";
import { createMemoryHistory } from "history";
import { createStore } from "redux";

import { wrapWithProviders } from "../../../../test/integrationTestUtils.unsafe";
import { tid } from "../../../../test/testUtils";
import { generateRootReducer, IAppState } from "../../../store";
import { MyWalletWidget } from "./MyWalletWidget";

describe("<MyWalletWidget />", () => {
  let initialWalletWidgetEnabledState: any;
  let initialWalletWidgetInDashboardState: any;

  const history = createMemoryHistory();

  const rootReducer = generateRootReducer(history);

  it("should render all default components when icbm and locked wallets are connected", () => {
    process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED = "1";

    const store = createStore(rootReducer, ({
      wallet: {
        loading: false,
        error: undefined,

        data: {
          euroTokenICBMLockedWallet: {
            LockedBalance: "0",
            neumarksDue: "0",
            unlockDate: "0",
          },
          etherTokenICBMLockedWallet: {
            LockedBalance: "0",
            neumarksDue: "0",
            unlockDate: "0",
          },
          euroTokenLockedWallet: {
            LockedBalance: "7.1827e+22",
            neumarksDue: "2.28726785814664953782577e+23",
            unlockDate: "1627528891",
          },
          etherTokenLockedWallet: {
            LockedBalance: "218128979800000000000",
            neumarksDue: "2.01496624735285327461934e+23",
            unlockDate: "1627528891",
          },
          etherTokenUpgradeTarget: "0x3d7eb0c4fe62ee3197d2ff9bf92a48c4f5ff22be",
          euroTokenUpgradeTarget: "0x6eee3fa1b6abbf4abad8ebcc90a2a96a3b2548d7",
          neumarkAddress: "0x027a7a3991c4dd1dcb9db3f9a4dda8bab4d58f2f",
          etherTokenBalance: "0",
          euroTokenBalance: "0",
          etherBalance: "5.8879038511742e+22",
          neuBalance: "4.30223410549950281244511e+23",
        },
      },
    } as unknown) as IAppState);

    const component = mount(wrapWithProviders(MyWalletWidget, { store }));

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

    const store = createStore(rootReducer, ({
      tokenPrice: {
        loading: false,
        tokenPriceData: {
          etherPriceEur: "200000",
        },
      },
      wallet: {
        loading: false,
        error: undefined,

        data: {
          euroTokenICBMLockedWallet: {
            LockedBalance: "0",
            neumarksDue: "0",
            unlockDate: "0",
          },
          etherTokenICBMLockedWallet: {
            LockedBalance: "0",
            neumarksDue: "0",
            unlockDate: "0",
          },
          euroTokenLockedWallet: {
            LockedBalance: "0",
            unlockDate: "0",
          },
          etherTokenLockedWallet: {
            LockedBalance: "0",
            unlockDate: "0",
          },
          etherTokenBalance: "0",
          euroTokenBalance: convertToUlps("36000"),
          etherBalance: convertToUlps("0.6482"),
          neuBalance: convertToUlps("36000"),
        },
      },
    } as unknown) as IAppState);

    const component = mount(wrapWithProviders(MyWalletWidget, { store }));

    expect(component.find(tid("my-wallet-widget-icbm-help-text"))).to.have.length(1);
  });
  it("should render numbers in correct format", () => {
    const store = createStore(rootReducer, ({
      tokenPrice: {
        loading: false,
        tokenPriceData: {
          etherPriceEur: "200000",
        },
      },
      wallet: {
        loading: false,
        error: undefined,

        data: {
          euroTokenICBMLockedWallet: {
            LockedBalance: "0",
          },
          etherTokenICBMLockedWallet: {
            LockedBalance: "0",
          },
          euroTokenLockedWallet: {
            LockedBalance: convertToUlps("490"),
          },
          etherTokenLockedWallet: {
            LockedBalance: convertToUlps("1"),
          },
          etherTokenBalance: "0",
          euroTokenBalance: convertToUlps("36000"),
          etherBalance: convertToUlps("0.6482"),
          neuBalance: convertToUlps("36000"),
        },
      },
    } as unknown) as IAppState);

    const component = mount(wrapWithProviders(MyWalletWidget, { store }));

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
