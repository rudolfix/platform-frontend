import BigNumber from "bignumber.js";
import { expect } from "chai";
import * as sinon from "sinon";

import { Q18 } from "../../../config/constants";
import { IAppState } from "../../../store";
import * as publicEtoSelectors from "../../public-etos/selectors";
import * as investorTicketSelectors from "../selectors";

describe("investor-tickets > selectors", () => {
  describe("selectCalculatedEtoTicketSizesById", () => {
    beforeEach(() => {
      sinon.stub(publicEtoSelectors, "selectPublicEtoById").returns({
        minTicketEur: 10,
        maxTicketEur: 1000,
      });
      sinon.stub(investorTicketSelectors, "selectCalculatedContribution").returns({
        minTicketEurUlps: new BigNumber("20").mul(Q18),
        maxTicketEurUlps: new BigNumber("2000").mul(Q18),
      });
      sinon.stub(investorTicketSelectors, "selectInvestorTicket").returns(undefined);
    });

    afterEach(() => {
      (publicEtoSelectors.selectPublicEtoById as sinon.SinonStub).restore();
      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).restore();
      (investorTicketSelectors.selectCalculatedContribution as sinon.SinonStub).restore();
    });

    // tslint:disable-next-line:no-object-literal-type-assertion
    const state = {} as IAppState;
    const etoId = "";
    const selectCalculatedEtoTicketSizesUlpsById =
      investorTicketSelectors.selectCalculatedEtoTicketSizesUlpsById;

    it("returns undefined if not eto or calculatedContribution are found", () => {
      (publicEtoSelectors.selectPublicEtoById as sinon.SinonStub).returns(undefined);
      (investorTicketSelectors.selectCalculatedContribution as sinon.SinonStub).returns(undefined);
      // tslint:disable-next-line:no-unused-expression
      expect(selectCalculatedEtoTicketSizesUlpsById(etoId, state)).to.be.undefined;
    });

    it("returns eto ticket sizes if eto is defined", () => {
      (investorTicketSelectors.selectCalculatedContribution as sinon.SinonStub).returns(undefined);

      const result = selectCalculatedEtoTicketSizesUlpsById(etoId, state);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("10").mul(Q18),
        maxTicketEurUlps: new BigNumber("1000").mul(Q18),
      });
    });

    it("returns eto ticket sizes if calculatedContribution is defined", () => {
      const result = selectCalculatedEtoTicketSizesUlpsById(etoId, state);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("20").mul(Q18),
        maxTicketEurUlps: new BigNumber("2000").mul(Q18),
      });
    });

    it("returns eto ticket sizes if calculatedContribution is defined", () => {
      const result = selectCalculatedEtoTicketSizesUlpsById(etoId, state);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("20").mul(Q18),
        maxTicketEurUlps: new BigNumber("2000").mul(Q18),
      });
    });
  });
});
