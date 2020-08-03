import { investorPortfolioModuleApi, walletApi } from "@neufund/shared-modules";
import { tid } from "@neufund/shared-utils/tests";
import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";

import { createMount } from "../../../../../test/createMount";
import { wrapWithBasicProviders } from "../../../../../test/integrationTestUtils.unsafe";
import * as walletSelectors from "../../../../modules/wallet-selector/selectors";
import { WarningAlert } from "../../../shared/WarningAlert";
import { MyNeuWidget } from "./MyNeuWidget";

const { stub, restore } = createSandbox();

describe("MyNeuWidget", () => {
  let stubs: Record<string, SinonStub>;

  beforeEach(() => {
    stubs = {
      selectIsLoading: stub(walletApi.selectors, "selectIsLoading").returns(undefined),
      selectNeuBalance: stub(walletApi.selectors, "selectNeuBalance").returns(undefined),
      selectNeuBalanceEuroAmount: stub(walletApi.selectors, "selectNeuBalanceEuroAmount").returns(
        undefined,
      ),
      selectWalletError: stub(walletApi.selectors, "selectWalletError").returns(undefined),

      selectIncomingPayoutError: stub(
        investorPortfolioModuleApi.selectors,
        "selectIncomingPayoutError",
      ).returns(undefined),
      selectIncomingPayoutEurEquiv: stub(
        investorPortfolioModuleApi.selectors,
        "selectIncomingPayoutEurEquiv",
      ).returns("0"),
      selectIsIncomingPayoutLoading: stub(
        investorPortfolioModuleApi.selectors,
        "selectIsIncomingPayoutLoading",
      ).returns(undefined),
      selectIsIncomingPayoutNotInitialized: stub(
        investorPortfolioModuleApi.selectors,
        "selectIsIncomingPayoutNotInitialized",
      ).returns(undefined),
      selectIsIncomingPayoutPending: stub(
        investorPortfolioModuleApi.selectors,
        "selectIsIncomingPayoutPending",
      ).returns(undefined),
      selectPayoutAvailable: stub(
        investorPortfolioModuleApi.selectors,
        "selectPayoutAvailable",
      ).returns(undefined),
      selectTokensDisbursalError: stub(
        investorPortfolioModuleApi.selectors,
        "selectTokensDisbursalError",
      ).returns(undefined),
      selectTokensDisbursalEurEquivTotal: stub(
        investorPortfolioModuleApi.selectors,
        "selectTokensDisbursalEurEquivTotal",
      ).returns(""),
      selectTokensDisbursalIsLoading: stub(
        investorPortfolioModuleApi.selectors,
        "selectTokensDisbursalIsLoading",
      ).returns(undefined),
      selectTokensDisbursalNotInitialized: stub(
        investorPortfolioModuleApi.selectors,
        "selectTokensDisbursalNotInitialized",
      ).returns(undefined),
      selectRouterState: stub(walletSelectors, "selectRouterState").returns({
        location: { pathname: "/" },
      }),
    };
  });

  afterEach(() => {
    restore();
  });

  it("shows the loading indicator", () => {
    stubs.selectIsLoading.returns(true);

    const component = createMount(wrapWithBasicProviders(MyNeuWidget));

    expect(component.find(tid("loading-indicator-pulse")).length).to.eq(1);
  });

  it("shows the error", () => {
    stubs.selectWalletError.returns("error");

    const component = createMount(wrapWithBasicProviders(MyNeuWidget));

    expect(component.find(tid("my-neu-widget-error")).find(WarningAlert).length).to.eq(1);
  });

  it("shows the help button", () => {
    stubs.selectIsIncomingPayoutPending.returns(false);
    stubs.selectPayoutAvailable.returns(false);

    const component = createMount(wrapWithBasicProviders(MyNeuWidget));
    expect(component.find("ButtonLink" + tid("my-neu-widget-support-link")).length).to.eq(1);
  });

  it("shows the available payouts component", () => {
    stubs.selectIsIncomingPayoutPending.returns(true);
    stubs.selectPayoutAvailable.returns(false);

    const component = createMount(wrapWithBasicProviders(MyNeuWidget));

    expect(component.find(tid("my-neu-widget-payout-pending")).length).to.eq(1);
  });
});
