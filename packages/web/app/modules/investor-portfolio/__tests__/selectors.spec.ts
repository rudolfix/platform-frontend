import { expect } from "chai";

import { IAppState } from "../../../store";
import { convertToUlps } from "../../../utils/NumberUtils";
import { IInvestorTicketsState } from "../reducer";
import * as investorTicketSelectors from "../selectors";
import { ITokenDisbursal } from "../types";

describe("investor-portfolio > selectors", () => {
  describe("selectIsIncomingPayoutPending", () => {
    it("should show if amount equals 1 ETH", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: "0",
              etherTokenIncomingPayoutValue: convertToUlps("1"),
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutPending(state)).to.be.true;
    });

    it("should show if amount is more than 1 ETH", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: "0",
              etherTokenIncomingPayoutValue: convertToUlps("123"),
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutPending(state)).to.be.true;
    });

    it("should show if amount equals 100 nEUR", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: convertToUlps("100"),
              etherTokenIncomingPayoutValue: "0",
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutPending(state)).to.be.true;
    });

    it("should show if amount is more than 100 nEUR", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: convertToUlps("12452"),
              etherTokenIncomingPayoutValue: "0",
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutPending(state)).to.be.true;
    });

    it("should not show if amount is less than 100 nEUR and 1 ETH", () => {
      const state = {
        investorTickets: {
          incomingPayouts: {
            data: {
              euroTokenIncomingPayoutValue: convertToUlps("50"),
              etherTokenIncomingPayoutValue: convertToUlps("0.4"),
            },
          },
        },
      } as IAppState;

      expect(investorTicketSelectors.selectIsIncomingPayoutPending(state)).to.be.false;
    });
  });

  describe("selectTokensDisbursal", () => {
    const euroTokendDisbursal = {
      token: "eur_t",
      amountToBeClaimed: "499807466992079716049",
      totalDisbursedAmount: convertToUlps("97154.607"),
      timeToFirstDisbursalRecycle: 1680747704000,
    };

    const ethDisbursal = {
      token: "eth",
      amountToBeClaimed: "187494227249274600",
      totalDisbursedAmount: "364458900000000000",
      timeToFirstDisbursalRecycle: 1680747704000,
    };

    it("should render both nEUR and ETH to be claimed", () => {
      const state = {
        investorTickets: {
          tokensDisbursal: { data: [euroTokendDisbursal, ethDisbursal] as ITokenDisbursal[] },
        } as IInvestorTicketsState,
      } as IAppState;

      const data = investorTicketSelectors.selectTokensDisbursal(state);

      expect(data).to.be.lengthOf(2);
      expect(data).to.contain(ethDisbursal);
      expect(data).to.contain(euroTokendDisbursal);
    });

    it("should return only ETH to be claimed", () => {
      // amount of 0.90 nEUR
      const state = {
        investorTickets: {
          tokensDisbursal: {
            data: [
              { ...euroTokendDisbursal, amountToBeClaimed: convertToUlps("0.90") },
              ethDisbursal,
            ] as ITokenDisbursal[],
          },
        } as IInvestorTicketsState,
      } as IAppState;

      const data = investorTicketSelectors.selectTokensDisbursal(state);

      expect(data).to.be.lengthOf(1);
      expect(data).to.contain(ethDisbursal);
    });

    it("should return only nEUR to be claimed", () => {
      // amount of 0.00023 ETH
      const state = {
        investorTickets: {
          tokensDisbursal: {
            data: [
              euroTokendDisbursal,
              { ...ethDisbursal, amountToBeClaimed: convertToUlps("0.00023") },
            ] as ITokenDisbursal[],
          },
        } as IInvestorTicketsState,
      } as IAppState;

      const data = investorTicketSelectors.selectTokensDisbursal(state);

      expect(data).to.be.lengthOf(1);
      expect(data).to.contain(euroTokendDisbursal);
    });
  });
});
