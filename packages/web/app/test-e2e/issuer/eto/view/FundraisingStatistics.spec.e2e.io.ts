import { withParams } from "@neufund/shared";

import { externalRoutes } from "../../../../config/externalRoutes";
import { etoFixtureAddressByName, tid } from "../../../utils/index";
import { loginFixtureAccount } from "../../../utils/userHelpers";
import { goToEtoViewById } from "./EtoViewUtils";

const assertFundraisingStatisticsTab = (etoId: string) => {
  goToEtoViewById(etoId);

  cy.get(tid("eto.public-view.fundraising-statistics")).click();
  cy.get(tid("eto.public-view.fundraising-statistics.iframe"))
    .and("have.attr", "src")
    .and("include", withParams(externalRoutes.icoMonitorStats, { etoId }));
};

const assertNoFundraisingStatisticsTab = (etoId: string) => {
  goToEtoViewById(etoId);

  cy.get(tid("eto.public-view.fundraising-statistics")).should("not.exist");
};

describe("ETO Fundraising Statistics", () => {
  describe("ETO Investor view", () => {
    it("should show fundraising statistics for whitelisted investor @eto @p2", () => {
      const etoId = etoFixtureAddressByName("ETOInWhitelistState");

      loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should not show fundraising statistics for not whitelisted investor @eto @p3", () => {
      const etoId = etoFixtureAddressByName("ETOInWhitelistState");

      loginFixtureAccount("INV_EMPTY_HAS_KYC");

      assertNoFundraisingStatisticsTab(etoId);
    });
  });
  describe("ETO Public view", () => {
    it("should not show statistics for ETO in Setup state @eto @p3", () => {
      const etoId = etoFixtureAddressByName("ETOInSetupState");

      assertNoFundraisingStatisticsTab(etoId);
    });

    it("should not show statistics for ETO in Whitelist state @eto @p3", () => {
      const etoId = etoFixtureAddressByName("ETOInWhitelistState");

      assertNoFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Public state @eto @p2", () => {
      const etoId = etoFixtureAddressByName("ETOInPublicState");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Signing state @eto @p3", () => {
      const etoId = etoFixtureAddressByName("ETOInSigningState");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Claim state @eto @p3", () => {
      const etoId = etoFixtureAddressByName("ETOInClaimState");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Payout state @eto @p3", () => {
      const etoId = etoFixtureAddressByName("ETOInPayoutState");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Refund state @eto @p3", () => {
      const etoId = etoFixtureAddressByName("ETOInRefundState");

      assertFundraisingStatisticsTab(etoId);
    });
  });
});
