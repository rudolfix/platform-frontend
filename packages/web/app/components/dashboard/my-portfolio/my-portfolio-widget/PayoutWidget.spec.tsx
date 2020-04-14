import { createMount, tid } from "@neufund/shared/tests";
import { expect } from "chai";
import * as React from "react";
import { createSandbox, SinonStub } from "sinon";

const { stub, restore } = createSandbox();

import * as hoocs from "../../../../utils/react-connected-components/withActionWatcher.unsafe";
// Stub action watcher as it uses inverify container under the hood
// Given that it's used at the top level we should stub it before importing PayoutWidget
stub(hoocs, "withActionWatcher").callsFake(() => (Component: React.ComponentType) => Component);

// tslint:disable-next-line:ordered-imports
import { wrapWithBasicProviders } from "../../../../../test/integrationTestUtils.unsafe";
import * as investorPortfolio from "../../../../modules/investor-portfolio/selectors";
import * as buttonLink from "../../../shared/buttons/ButtonLink";
import { WarningAlert } from "../../../shared/WarningAlert";
import { IncomingPayoutPendingBase } from "./IncomingPayoutPending";
import { PayoutWidget } from "./PayoutWidget";

describe("PayoutWidget", () => {
  const stubs: Record<string, SinonStub> = {};

  beforeEach(() => {
    // Stub button link as it uses store under the hood
    stub(buttonLink, "ButtonLink").callsFake((props: any) => (
      <div data-test-id={props["data-test-id"]} />
    ));

    stubs.selectEtherTokenIncomingPayout = stub(
      investorPortfolio,
      "selectEtherTokenIncomingPayout",
    ).returns("0");
    stubs.selectEuroTokenIncomingPayout = stub(
      investorPortfolio,
      "selectEuroTokenIncomingPayout",
    ).returns("0");
    stubs.selectIncomingPayoutError = stub(investorPortfolio, "selectIncomingPayoutError").returns(
      undefined,
    );
    stubs.selectIncomingPayoutSnapshotDate = stub(
      investorPortfolio,
      "selectIncomingPayoutSnapshotDate",
    ).returns(undefined);
    stubs.selectIsIncomingPayoutLoading = stub(
      investorPortfolio,
      "selectIsIncomingPayoutLoading",
    ).returns(undefined);
    stubs.selectIsIncomingPayoutNotInitialized = stub(
      investorPortfolio,
      "selectIsIncomingPayoutNotInitialized",
    ).returns(undefined);
    stubs.selectIsIncomingPayoutPending = stub(
      investorPortfolio,
      "selectIsIncomingPayoutPending",
    ).returns(undefined);
    stubs.selectPayoutAvailable = stub(investorPortfolio, "selectPayoutAvailable").returns(
      undefined,
    );
    stubs.selectTokensDisbursal = stub(investorPortfolio, "selectTokensDisbursal").returns(
      undefined,
    );
    stubs.selectTokensDisbursalError = stub(
      investorPortfolio,
      "selectTokensDisbursalError",
    ).returns(undefined);
    stubs.selectTokensDisbursalIsLoading = stub(
      investorPortfolio,
      "selectTokensDisbursalIsLoading",
    ).returns(undefined);
    stubs.selectTokensDisbursalNotInitialized = stub(
      investorPortfolio,
      "selectTokensDisbursalNotInitialized",
    ).returns(undefined);
  });

  afterEach(() => {
    restore();
  });

  it("shows the loading indicator", () => {
    stubs.selectIsIncomingPayoutLoading.returns(true);

    const component = createMount(wrapWithBasicProviders(PayoutWidget));

    expect(component.find(tid("loading-indicator-pulse")).length).to.eq(1);
  });

  it("shows the error", async () => {
    stubs.selectIncomingPayoutError.returns("error");

    const component = createMount(wrapWithBasicProviders(PayoutWidget));

    expect(component.find(tid("my-portfolio-widget-error")).find(WarningAlert).length).to.eq(1);
  });

  it("shows the welcome component", async () => {
    stubs.selectIsIncomingPayoutPending.returns(false);
    stubs.selectPayoutAvailable.returns(false);

    const component = createMount(wrapWithBasicProviders(PayoutWidget));

    expect(component.find(tid("my-portfolio-widget-welcome")).length).to.eq(1);
  });

  it("shows the available payouts component", async () => {
    stubs.selectIsIncomingPayoutPending.returns(false);
    stubs.selectPayoutAvailable.returns(true);
    stubs.selectTokensDisbursal.returns([]);

    const component = createMount(wrapWithBasicProviders(PayoutWidget));

    expect(component.find(tid("my-portfolio-widget-incoming-payout-available")).length).to.eq(1);
  });

  it("shows the pending payouts component in waiting state if there are pending payouts but snapshot's date is different from system date", async () => {
    stubs.selectIsIncomingPayoutPending.returns(true);
    stubs.selectIncomingPayoutSnapshotDate.returns(undefined);

    const component = createMount(wrapWithBasicProviders(PayoutWidget));

    expect(
      component
        .find(tid("my-portfolio-widget-incoming-payout-waiting"))
        .find(IncomingPayoutPendingBase).length,
    ).to.eq(1);
  });

  it("shows the pending payouts component if there are pending payouts and snapshot's date is the same as system date", async () => {
    stubs.selectIsIncomingPayoutPending.returns(true);
    stubs.selectIncomingPayoutSnapshotDate.returns(Date.now() / 1000);

    const component = createMount(wrapWithBasicProviders(PayoutWidget));

    expect(
      component
        .find(tid("my-portfolio-widget-incoming-payout-pending"))
        .find(IncomingPayoutPendingBase).length,
    ).to.eq(1);
  });
});
