import { expectSaga, matchers } from "@neufund/sagas/tests";
import { gasReducerMap, tokenPriceReducerMap, walletReducerMap } from "@neufund/shared-modules";
import { convertFromUlps, convertToUlps, ECurrency } from "@neufund/shared-utils";
import { BigNumber } from "bignumber.js";
import { combineReducers } from "redux";
import { stub } from "sinon";

import { actions } from "../actions";
import { txSenderReducer } from "./../tx/sender/reducer";
import { EInvestmentType, investmentFlowReducer } from "./reducer";
import {
  computeAndSetCurrencies,
  investEntireBalance,
  processCurrencyValue,
  recalculateCurrencies,
} from "./sagas";

describe("Investment-flow - Integration Test", () => {
  describe("recalculateCurrencies", async function(): Promise<void> {
    it("calculate currencies if ethValue is present", async () => {
      await expectSaga(recalculateCurrencies)
        .withReducer({ investmentFlow: investmentFlowReducer } as any, {
          investmentFlow: {
            ethValueUlps: "99",
            etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
            euroValue: "",
            investmentType: EInvestmentType.Eth,
            isValidatedInput: false,
            wallets: [],
          },
        })
        .provide([[matchers.call.fn(computeAndSetCurrencies), undefined]])
        .call(computeAndSetCurrencies, "99", ECurrency.ETH)
        .run();
    });

    it("calculate currencies if eurValue is present", async () => {
      await expectSaga(recalculateCurrencies)
        .withReducer({ investmentFlow: investmentFlowReducer } as any, {
          investmentFlow: {
            ethValueUlps: "",
            etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
            euroValue: "99",
            investmentType: EInvestmentType.NEur,
            isValidatedInput: false,
            wallets: [],
          },
        })
        .provide([[matchers.call.fn(computeAndSetCurrencies), undefined]])
        .call(computeAndSetCurrencies, convertToUlps("99").toString(), ECurrency.EUR_TOKEN)
        .run();
    });

    it("do nothing is ethValue and eurValue is empty", async () => {
      await expectSaga(recalculateCurrencies)
        .withReducer({ investmentFlow: investmentFlowReducer } as any, {
          investmentFlow: {
            ethValueUlps: "",
            etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
            euroValue: "",
            investmentType: EInvestmentType.NEur,
            isValidatedInput: false,
            wallets: [],
          },
        })
        .provide([[matchers.call.fn(computeAndSetCurrencies), undefined]])
        .not.call(computeAndSetCurrencies)
        .run();
    });

    it("throws if invest", async () => {
      stub(console, "error");
      await expectSaga(recalculateCurrencies)
        .withReducer({ investmentFlow: investmentFlowReducer } as any, {
          investmentFlow: {
            ethValueUlps: "",
            etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
            euroValue: "",
            investmentType: undefined,
            isValidatedInput: false,
            wallets: [],
          },
        })
        .throws(new Error("Investment Type can't undefined at this moment"))
        .run();
      (console.error as any).restore(); // tslint:disable-line
    });
  });

  describe("computeAndSetCurrencies", async function(): Promise<void> {
    it("should set values as empty when value is not given", async () => {
      await expectSaga(computeAndSetCurrencies, "", ECurrency.ETH)
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
          }),
          {
            investmentFlow: {
              ethValueUlps: "99",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "",
              investmentType: EInvestmentType.Eth,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: { tokenPriceData: { etherPriceEur: "0", neuPriceEur: "0" } as any } as any,
          },
        )
        .put(actions.investmentFlow.setEthValue(""))
        .put(actions.investmentFlow.setEurValue(""))
        .run();
    });
    it("should currencies when currency is ETH", async () => {
      await expectSaga(computeAndSetCurrencies, "1", ECurrency.ETH)
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
          }),
          {
            investmentFlow: {
              ethValueUlps: "99",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "",
              investmentType: EInvestmentType.Eth,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: {
              tokenPriceData: { etherPriceEur: "2", eurPriceEther: "2" } as any,
            } as any,
          },
        )
        .put(actions.investmentFlow.setEthValue("1"))
        .put(actions.investmentFlow.setEurValue(convertFromUlps("2").toString()))
        .run();
    });

    it("should currencies when currency is Euro", async () => {
      await expectSaga(computeAndSetCurrencies, "1", ECurrency.EUR_TOKEN)
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
          }),
          {
            investmentFlow: {
              ethValueUlps: "99",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "",
              investmentType: EInvestmentType.Eth,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: {
              tokenPriceData: { etherPriceEur: "2", eurPriceEther: "2" } as any,
            } as any,
          },
        )
        .put(actions.investmentFlow.setEthValue("2"))
        .put(actions.investmentFlow.setEurValue(convertFromUlps("1").toString()))
        .run();
    });
  });

  describe("processCurrencyValue", async function(): Promise<void> {
    it("should return when value is the same as the old value", async () => {
      await expectSaga(processCurrencyValue, {
        payload: { value: "1", currency: ECurrency.ETH },
        type: "INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE",
      })
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
          }),
          {
            investmentFlow: {
              ethValueUlps: "1000000000000000000",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "1000000000000000000",
              investmentType: EInvestmentType.Eth,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: { tokenPriceData: { etherPriceEur: "0", neuPriceEur: "0" } as any } as any,
          },
        )
        .not.put(actions.investmentFlow.setIsInputValidated(false))
        .run();
    });
    it("should set values as empty string when value is not given", async () => {
      await expectSaga(processCurrencyValue, {
        payload: { value: "2", currency: ECurrency.ETH },
        type: "INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE",
      })
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
          }),
          {
            investmentFlow: {
              ethValueUlps: "1000000000000000000",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "1000000000000000000",
              investmentType: EInvestmentType.Eth,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: { tokenPriceData: { etherPriceEur: "0", neuPriceEur: "0" } as any } as any,
          },
        )
        .put(actions.investmentFlow.setIsInputValidated(false))
        .call(computeAndSetCurrencies, "2000000000000000000", ECurrency.ETH)
        .put(actions.investmentFlow.validateInputs())
        .run();
    });
  });

  describe("investEntireBalance", async function(): Promise<void> {
    it("should invest entire balance for NEur", async () => {
      await expectSaga(investEntireBalance)
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
            wallet: walletReducerMap.wallet,
            gas: gasReducerMap.gas,
          }),
          {
            investmentFlow: {
              ethValueUlps: "99",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "",
              investmentType: EInvestmentType.NEur,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: { tokenPriceData: { etherPriceEur: "0", neuPriceEur: "0" } as any } as any,
            wallet: { data: { euroTokenBalance: "1" } as any } as any,
            gas: { gasPrice: { standard: "1" } as any } as any,
          },
        )
        .call(computeAndSetCurrencies, "1", ECurrency.EUR_TOKEN)
        .put(actions.investmentFlow.validateInputs())
        .run();
    });
    it("should invest entire balance for ICBM Ether", async () => {
      await expectSaga(investEntireBalance)
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
            wallet: walletReducerMap.wallet,
            gas: gasReducerMap.gas,
          }),
          {
            investmentFlow: {
              ethValueUlps: "99",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "",
              investmentType: EInvestmentType.ICBMEth,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: { tokenPriceData: { etherPriceEur: "0", neuPriceEur: "0" } as any } as any,
            wallet: { data: { etherTokenLockedWallet: { LockedBalance: "1" } } as any } as any,
            gas: { gasPrice: { standard: "1" } as any } as any,
          },
        )
        .call(computeAndSetCurrencies, "1", ECurrency.ETH)
        .put(actions.investmentFlow.validateInputs())
        .run();
    });
    it("should invest entire balance for ICBM Euro", async () => {
      await expectSaga(investEntireBalance)
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
            wallet: walletReducerMap.wallet,
            gas: gasReducerMap.gas,
          }),
          {
            investmentFlow: {
              ethValueUlps: "99",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "",
              investmentType: EInvestmentType.ICBMnEuro,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: { tokenPriceData: { etherPriceEur: "0", neuPriceEur: "0" } as any } as any,
            wallet: { data: { euroTokenLockedWallet: { LockedBalance: "1" } } as any } as any,
            gas: { gasPrice: { standard: "1" } as any } as any,
          },
        )
        .call(computeAndSetCurrencies, "1", ECurrency.EUR_TOKEN)
        .put(actions.investmentFlow.validateInputs())
        .run();
    });
    it("should invest entire balance for Ether", async () => {
      await expectSaga(investEntireBalance)
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
            wallet: walletReducerMap.wallet,
            gas: gasReducerMap.gas,
            txSender: txSenderReducer,
          }),
          {
            investmentFlow: {
              ethValueUlps: "99",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "",
              investmentType: EInvestmentType.Eth,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: { tokenPriceData: { etherPriceEur: "0", neuPriceEur: "0" } as any } as any,
            wallet: {
              data: { euroTokenBalance: "1", etherTokenBalance: "1", etherBalance: "1" } as any,
            } as any,
            gas: { gasPrice: { standard: "1" } as any } as any,
            txSender: { txDetails: { gasPrice: "1", gas: "1" } as any } as any,
          },
        )
        .call(computeAndSetCurrencies, "2", ECurrency.ETH)
        .put(actions.investmentFlow.validateInputs())
        .run();
    });
    it("should invest entire balance of Ether while subtracting gas costs", async () => {
      await expectSaga(investEntireBalance)
        .withReducer(
          combineReducers({
            investmentFlow: investmentFlowReducer,
            tokenPrice: tokenPriceReducerMap.tokenPrice,
            wallet: walletReducerMap.wallet,
            gas: gasReducerMap.gas,
            txSender: txSenderReducer,
          }),
          {
            investmentFlow: {
              ethValueUlps: "99",
              etoId: "0x2754523CE7C78FeD60F742b0Bc8A8F9fa323bB4C",
              euroValue: "",
              investmentType: EInvestmentType.Eth,
              isValidatedInput: false,
              wallets: [],
            },
            tokenPrice: { tokenPriceData: { etherPriceEur: "0", neuPriceEur: "0" } as any } as any,
            wallet: {
              data: {
                euroTokenBalance: "1",
                etherTokenBalance: "0",
                etherBalance: "100000000000",
              } as any,
            } as any,
            gas: { gasPrice: { standard: "1" } as any } as any,
            txSender: { txDetails: { gasPrice: "1", gas: "1" } as any } as any,
          },
        )
        .call(
          computeAndSetCurrencies,
          new BigNumber("100000000000").minus("600000").toString(),
          ECurrency.ETH,
        )
        .put(actions.investmentFlow.validateInputs())
        .run();
    });
  });
});
