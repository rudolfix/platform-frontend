import { AssertEqual, assertType, toDeepPartialMock } from "@neufund/shared-utils/tests";
import { expect } from "chai";

import { testEto } from "../../tests/fixtures";
import { EJurisdiction } from "../kyc/module";
import { EEtoState } from "./lib/http/eto-api/EtoApi.interfaces";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoContractData,
  TEtoWithCompanyAndContract,
} from "./types";
import {
  amendEtoToCompatibleFormat,
  getEtoCurrentState,
  getEtoEurMaxTarget,
  getEtoEurMinTarget,
  getEtoNextStateStartDate,
  getInvestmentCalculatedPercentage,
  isOnChain,
  isSuccessful,
} from "./utils";

const mockEto = (
  state: EEtoState | undefined,
  totalTokensInt: string | undefined,
  equityTokensPerShare: number | undefined,
  minimumNewSharesToIssue: number | undefined,
  newSharesToIssue: number | undefined,
  totalEquivEur: string | undefined,
) =>
  ({
    ...testEto,
    contract: {
      ...testEto.contract,
      totalInvestment: {
        ...testEto.contract!.totalInvestment,
        totalTokensInt: totalTokensInt
          ? totalTokensInt
          : testEto.contract!.totalInvestment.totalTokensInt,
        totalEquivEur: totalEquivEur
          ? totalEquivEur
          : testEto.contract!.totalInvestment.totalEquivEur,
      },
    },
    equityTokensPerShare: equityTokensPerShare
      ? equityTokensPerShare
      : testEto.equityTokensPerShare,
    minimumNewSharesToIssue: minimumNewSharesToIssue
      ? minimumNewSharesToIssue
      : testEto.minimumNewSharesToIssue,
    newSharesToIssue: newSharesToIssue ? newSharesToIssue : testEto.newSharesToIssue,
    state: state ? state : testEto.state,
  } as any);

describe("eto-utils", () => {
  describe("amendEtoToCompatibleFormat", () => {
    it("should uppercase jurisdiction", () => {
      const amendedEto = amendEtoToCompatibleFormat(testEto);
      expect(testEto.product.jurisdiction).to.equal(EJurisdiction.GERMANY.toLowerCase());
      expect(amendedEto.product!.jurisdiction).to.equal(EJurisdiction.GERMANY);
    });
  });

  describe("getEtoNextStateStartDate", () => {
    it("should return next state start date", () => {
      const date = getEtoNextStateStartDate(testEto)!;
      expect(date.toString()).to.eq(new Date("2018-12-21T05:03:56.000Z").toString());
    });
  });

  describe("getInvestmentCalculatedPercentage", () => {
    it("should return correct value", () => {
      expect(
        getInvestmentCalculatedPercentage(
          mockEto(EEtoState.LISTED, undefined, undefined, undefined, undefined, undefined),
        ),
      ).to.eq(undefined);
      expect(
        getInvestmentCalculatedPercentage(
          mockEto(EEtoState.ON_CHAIN, "500", 10, 100, undefined, undefined),
        ),
      ).to.eq("50");
      expect(
        getInvestmentCalculatedPercentage(
          mockEto(EEtoState.ON_CHAIN, "250", 10, 100, undefined, undefined),
        ),
      ).to.eq("25");
      expect(
        getInvestmentCalculatedPercentage(
          mockEto(EEtoState.ON_CHAIN, "480", 24, 200, undefined, undefined),
        ),
      ).to.eq("10");
      expect(
        getInvestmentCalculatedPercentage(
          mockEto(EEtoState.ON_CHAIN, "1000", 10, 100, undefined, undefined),
        ),
      ).to.eq("100");
    });
  });

  describe("getEtoEurMinTarget", () => {
    it("should return correct values", () => {
      // 7% of min shares
      expect(
        getEtoEurMinTarget(mockEto(EEtoState.ON_CHAIN, "70", 10, 100, undefined, "700")),
      ).to.eq("10000");
      // 20% of min shares
      expect(
        getEtoEurMinTarget(mockEto(EEtoState.ON_CHAIN, "200", 10, 100, undefined, "12345")),
      ).to.eq("61725");
      // 50% of min shares
      expect(
        getEtoEurMinTarget(mockEto(EEtoState.ON_CHAIN, "500", 10, 100, undefined, "5200")),
      ).to.eq("10400");
      // 100% of min shares
      expect(
        getEtoEurMinTarget(mockEto(EEtoState.ON_CHAIN, "1000", 10, 100, undefined, "5200")),
      ).to.eq("5200");
    });
  });

  describe("getEtoEurMaxTarget", () => {
    it("should return correct values", () => {
      // 7% of min shares
      expect(
        getEtoEurMaxTarget(mockEto(EEtoState.ON_CHAIN, "70", 10, undefined, 100, "700")),
      ).to.eq("10000");
      // 20% of min shares
      expect(
        getEtoEurMaxTarget(mockEto(EEtoState.ON_CHAIN, "200", 10, undefined, 100, "12345")),
      ).to.eq("61725");
      // 50% of min shares
      expect(
        getEtoEurMaxTarget(mockEto(EEtoState.ON_CHAIN, "500", 10, undefined, 100, "5200")),
      ).to.eq("10400");
      // 100% of min shares
      expect(
        getEtoEurMaxTarget(mockEto(EEtoState.ON_CHAIN, "1000", 10, undefined, 100, "5200")),
      ).to.eq("5200");
    });
  });

  describe("getState", () => {
    const subState = EEtoSubState.WHITELISTING;
    const timedState = EETOStateOnChain.Refund;
    const state = EEtoState.PROSPECTUS_APPROVED;

    const eto = toDeepPartialMock<TEtoWithCompanyAndContract>({
      state,
      subState,
      contract: {
        timedState,
      },
    });

    it("should return eto calculated subState when set", () => {
      expect(getEtoCurrentState(eto)).to.eq(subState);
    });

    it("should return eto on chain state when subState is not set", () => {
      expect(getEtoCurrentState({ ...eto, state: EEtoState.ON_CHAIN, subState: undefined })).to.eq(
        timedState,
      );
    });

    it("should return eto state when subState and onChain state is not yet set", () => {
      expect(getEtoCurrentState({ ...eto, subState: undefined, contract: undefined })).to.eq(state);
    });
  });

  describe("isOnChain", () => {
    it("should mark eto as ON_CHAIN and guard a type", () => {
      const onChainEto = toDeepPartialMock<TEtoWithCompanyAndContract>({
        state: EEtoState.ON_CHAIN,
        contract: {},
      });
      const onChainEtoWithoutContracts = toDeepPartialMock<TEtoWithCompanyAndContract>({
        state: EEtoState.ON_CHAIN,
        contract: undefined,
      });
      const offChainEto = toDeepPartialMock<TEtoWithCompanyAndContract>({
        state: EEtoState.PROSPECTUS_APPROVED,
      });

      if (isOnChain(onChainEto)) {
        assertType<
          AssertEqual<
            typeof onChainEto,
            // `contract` should not be `undefined` anymore
            TEtoWithCompanyAndContract & { contract: TEtoContractData }
          >
        >(true);
      }

      expect(isOnChain(onChainEto)).to.be.true;
      expect(isOnChain(onChainEtoWithoutContracts)).to.be.false;
      expect(isOnChain(offChainEto)).to.be.false;
    });
  });

  describe("isSuccessful", () => {
    it("should mark eto as ON_CHAIN and guard a type", () => {
      const inClaimEto = toDeepPartialMock<TEtoWithCompanyAndContract>({
        state: EEtoState.ON_CHAIN,
        contract: {
          timedState: EETOStateOnChain.Claim,
        },
      });
      const inPayoutEto = toDeepPartialMock<TEtoWithCompanyAndContract>({
        state: EEtoState.ON_CHAIN,
        contract: {
          timedState: EETOStateOnChain.Payout,
        },
      });
      const inRefundEto = toDeepPartialMock<TEtoWithCompanyAndContract>({
        state: EEtoState.ON_CHAIN,
        contract: {
          timedState: EETOStateOnChain.Refund,
        },
      });
      const offChainEto = toDeepPartialMock<TEtoWithCompanyAndContract>({
        state: EEtoState.PROSPECTUS_APPROVED,
      });

      expect(isSuccessful(inClaimEto)).to.be.true;
      expect(isSuccessful(inPayoutEto)).to.be.true;
      expect(isSuccessful(inRefundEto)).to.be.false;
      expect(isSuccessful(offChainEto)).to.be.false;
    });
  });
});
