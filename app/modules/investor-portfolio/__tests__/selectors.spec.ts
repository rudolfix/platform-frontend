import BigNumber from "bignumber.js";
import { expect } from "chai";
import * as sinon from "sinon";

import { Q18 } from "../../../config/constants";
import * as etoUtils from "../../../lib/api/eto/EtoUtils";
import { IAppState } from "../../../store";
import * as publicEtoSelectors from "../../public-etos/selectors";
import * as investorTicketSelectors from "../selectors";

describe("investor-portfolio > selectors", () => {
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
      sinon.stub(etoUtils, "getShareAndTokenPrice").returns({ tokenPrice: 1.5 });
    });

    afterEach(() => {
      (publicEtoSelectors.selectPublicEtoById as sinon.SinonStub).restore();
      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).restore();
      (investorTicketSelectors.selectCalculatedContribution as sinon.SinonStub).restore();
      (etoUtils.getShareAndTokenPrice as sinon.SinonStub).restore();
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
      expect(selectCalculatedEtoTicketSizesUlpsById(state, etoId)).to.be.undefined;
    });

    it("returns eto ticket sizes if eto is defined", () => {
      (investorTicketSelectors.selectCalculatedContribution as sinon.SinonStub).returns(undefined);

      const result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("10").mul(Q18),
        maxTicketEurUlps: new BigNumber("1000").mul(Q18),
      });
    });

    it("returns eto ticket sizes if calculatedContribution is defined", () => {
      const result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("20").mul(Q18),
        maxTicketEurUlps: new BigNumber("2000").mul(Q18),
      });
    });

    it("returns reduces amount by investor ticket", () => {
      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).returns({
        equivEurUlps: new BigNumber(18).mul(Q18),
      });
      const result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("2").mul(Q18),
        maxTicketEurUlps: new BigNumber("1982").mul(Q18),
      });
    });

    it("returns at least ticket size", () => {
      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).returns({
        equivEurUlps: new BigNumber(30).mul(Q18),
      });
      let result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("1.5").mul(Q18),
        maxTicketEurUlps: new BigNumber("1970").mul(Q18),
      });

      (investorTicketSelectors.selectInvestorTicket as sinon.SinonStub).returns({
        equivEurUlps: new BigNumber(3000).mul(Q18),
      });
      result = selectCalculatedEtoTicketSizesUlpsById(state, etoId);
      expect(result).to.deep.equal({
        minTicketEurUlps: new BigNumber("1.5").mul(Q18),
        maxTicketEurUlps: new BigNumber("0"),
      });
    });
  });
});
