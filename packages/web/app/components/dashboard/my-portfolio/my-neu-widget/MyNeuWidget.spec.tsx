import { walletApi } from "@neufund/shared-modules";
import { tid } from "@neufund/shared-utils/tests";
import { expect } from "chai";
import { createSandbox, SinonStub } from "sinon";

import { createMount } from "../../../../../test/createMount";
import { wrapWithBasicProviders } from "../../../../../test/integrationTestUtils.unsafe";
import * as investorPortfolio from "../../../../modules/investor-portfolio/selectors";
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

      selectIncomingPayoutError: stub(investorPortfolio, "selectIncomingPayoutError").returns(
        undefined,
      ),
      selectIncomingPayoutEurEquiv: stub(investorPortfolio, "selectIncomingPayoutEurEquiv").returns(
        "0",
      ),
      selectIsIncomingPayoutLoading: stub(
        investorPortfolio,
        "selectIsIncomingPayoutLoading",
      ).returns(undefined),
      selectIsIncomingPayoutNotInitialized: stub(
        investorPortfolio,
        "selectIsIncomingPayoutNotInitialized",
      ).returns(undefined),
      selectIsIncomingPayoutPending: stub(
        investorPortfolio,
        "selectIsIncomingPayoutPending",
      ).returns(undefined),
      selectPayoutAvailable: stub(investorPortfolio, "selectPayoutAvailable").returns(undefined),
      selectTokensDisbursalError: stub(investorPortfolio, "selectTokensDisbursalError").returns(
        undefined,
      ),
      selectTokensDisbursalEurEquivTotal: stub(
        investorPortfolio,
        "selectTokensDisbursalEurEquivTotal",
      ).returns(""),
      selectTokensDisbursalIsLoading: stub(
        investorPortfolio,
        "selectTokensDisbursalIsLoading",
      ).returns(undefined),
      selectTokensDisbursalNotInitialized: stub(
        investorPortfolio,
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
