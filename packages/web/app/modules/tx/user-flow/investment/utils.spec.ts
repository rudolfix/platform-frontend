import { expect } from "chai";
import BigNumber from "bignumber.js";
import { Q18 } from "../../../../config/constants";
import { calculateTicketLimitsUlps } from "./utils";
import { testEto } from "../../../../../test/fixtures";
import { IInvestorTicket } from "../../../investor-portfolio/types";

const contribution = {
  isWhitelisted: false,
  isEligible: true,
  minTicketEurUlps: new BigNumber("20").mul(Q18).toString(),
  maxTicketEurUlps: new BigNumber("2000").mul(Q18).toString(),
  equityTokenInt: "5000",
  neuRewardUlps: "35",
  maxCapExceeded: false,
};

const investorTicket = {
  equivEurUlps: new BigNumber("25").mul(Q18).toString(),
} as IInvestorTicket;

describe("calculateTicketLimitsUlps", () => {
  it("returns eto ticket sizes", () => {
    const result = calculateTicketLimitsUlps({ contribution, eto: testEto, investorTicket: undefined });
    expect(result).to.deep.equal({
      minTicketEurUlps: new BigNumber("20").mul(Q18),
      maxTicketEurUlps: new BigNumber("2000").mul(Q18),
    });
  });

  it("returns reduces amount by investor ticket", () => {
    contribution.minTicketEurUlps = new BigNumber("50").mul(Q18).toString();
    contribution.maxTicketEurUlps = new BigNumber("2000").mul(Q18).toString();

    const result = calculateTicketLimitsUlps({ contribution, eto: testEto, investorTicket });
    expect(result).to.deep.equal({
      minTicketEurUlps: new BigNumber("25").mul(Q18),
      maxTicketEurUlps: new BigNumber("1975").mul(Q18),
    });
  });

  it("returns at least ticket size", () => {
    contribution.minTicketEurUlps = new BigNumber("20").mul(Q18).toString();
    contribution.maxTicketEurUlps = new BigNumber("2000").mul(Q18).toString();
    investorTicket.equivEurUlps = new BigNumber("30").mul(Q18).toString();
    let result = calculateTicketLimitsUlps({ contribution, eto: testEto, investorTicket });
    expect(result).to.deep.equal({
      minTicketEurUlps: new BigNumber("10").mul(Q18),
      maxTicketEurUlps: new BigNumber("1970").mul(Q18),
    });

    investorTicket.equivEurUlps = new BigNumber("3000").mul(Q18).toString();
    result = calculateTicketLimitsUlps({ contribution, eto: testEto, investorTicket });
    expect(result).to.deep.equal({
      minTicketEurUlps: new BigNumber("0").mul(Q18),
      maxTicketEurUlps: new BigNumber("0"),
    });
  });
});
