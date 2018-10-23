import { expect } from "chai";

import { getInvestmentAmount, getSharePrice } from "./EtoUtils";

describe("EtoUtils", () => {
  describe("getSharePrice", () => {
    it("should return correct sharePrice", () => {
      expect(getSharePrice({ preMoneyValuationEur: 1000, existingCompanyShares: 100 })).to.equal(
        10,
      );
    });

    it("should return sharePrice as 0 when one of argument is undefined", () => {
      expect(
        getSharePrice({ preMoneyValuationEur: 100, existingCompanyShares: undefined }),
      ).to.equal(0);
      expect(
        getSharePrice({ preMoneyValuationEur: undefined, existingCompanyShares: 100 }),
      ).to.equal(0);
    });
  });

  describe("getInvestmentAmount", () => {
    it("should calculate correctly minInvestmentAmount", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 1000,
        existingCompanyShares: 10,
        minimumNewSharesToIssue: 100,
        newSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: 10,
        newSharesToIssueInWhitelist: 5,
        fixedSlotsMaximumDiscountFraction: 0.8,
        whitelistDiscountFraction: 0.5,
      });

      expect(minInvestmentAmount).to.equal(8950);
    });

    it("should return minInvestmentAmount as 0 when minimumNewSharesToIssue is 0", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 1000,
        existingCompanyShares: 10,
        minimumNewSharesToIssue: 0,
        newSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: 10,
        newSharesToIssueInWhitelist: 5,
        fixedSlotsMaximumDiscountFraction: 0.8,
        whitelistDiscountFraction: 0.5,
      });

      expect(minInvestmentAmount).to.equal(0);
    });

    it("should calculate correctly maxInvestmentAmount", () => {
      const { maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 1000,
        existingCompanyShares: 10,
        newSharesToIssue: 1000,
        minimumNewSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: 10,
        newSharesToIssueInWhitelist: 5,
        fixedSlotsMaximumDiscountFraction: 0.8,
        whitelistDiscountFraction: 0.5,
      });

      expect(maxInvestmentAmount).to.equal(98950);
    });

    it("should return maxInvestmentAmount as 0 when newSharesToIssue is 0", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: 1000,
        existingCompanyShares: 10,
        newSharesToIssue: 0,
        minimumNewSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: 10,
        newSharesToIssueInWhitelist: 5,
        fixedSlotsMaximumDiscountFraction: 0.8,
        whitelistDiscountFraction: 0.5,
      });

      expect(minInvestmentAmount).to.equal(0);
    });
  });
});
