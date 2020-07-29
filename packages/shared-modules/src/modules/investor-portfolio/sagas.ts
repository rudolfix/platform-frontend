import {
  all,
  call,
  fork,
  neuCall,
  neuTakeEvery,
  neuTakeLatest,
  put,
  SagaGenerator,
  select,
  TActionFromCreator,
  takeEvery,
} from "@neufund/sagas";
import {
  addBigNumbers,
  convertFromUlps,
  convertToUlps,
  DataUnavailableError,
  ECurrency,
  EthereumAddress,
  nonNullable,
  Q18,
  toEthereumAddress,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import { filter, map } from "lodash/fp";

import { createMessage } from "../../messages";
import { neuGetBindings } from "../../utils";
import { authModuleAPI } from "../auth/module";
import { contractsModuleApi, IETOCommitmentAdapter, IETOTermsAdapter } from "../contracts/module";
import { coreModuleApi } from "../core/module";
import { InvalidETOStateError } from "../eto/errors";
import { EEtoState, etoModuleApi, TEtoSpecsData } from "../eto/module";
import { isOnChain } from "../eto/utils";
import { notificationUIModuleApi } from "../notification-ui/module";
import { tokenPriceModuleApi } from "../token-price/module";
import { investorPortfolioActions } from "./actions";
import { InvestorPortfolioMessage } from "./messages";
import { ITokenDisbursal } from "./types";
import {
  convertToCalculatedContribution,
  convertToInvestorTicket,
  convertToTokenDisbursal,
  convertToWhitelistTicket,
} from "./utils";

type TGlobalDependencies = unknown;

export function* loadInvestorTickets(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof investorPortfolioActions,
    typeof investorPortfolioActions.loadInvestorTickets
  >,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    yield all(
      map(
        (eto: TEtoSpecsData) => put(investorPortfolioActions.loadEtoInvestorTicket(eto)),
        filter(eto => eto.state === EEtoState.ON_CHAIN, action.payload.etos),
      ),
    );

    yield;
  } catch (e) {
    logger.error(e, "Could not load investor tickets");
  }
}

export function* loadInvestorTicket(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof investorPortfolioActions,
    typeof investorPortfolioActions.loadEtoInvestorTicket
  >,
): Generator<any, any, any> {
  const { contractsService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    contractsService: contractsModuleApi.symbols.contractsService,
  });
  if (action.payload.eto.state !== EEtoState.ON_CHAIN) {
    throw new Error("Should be called only when eto is on chain");
  }

  const etoId = action.payload.eto.etoId;
  const user = yield* select(authModuleAPI.selectors.selectUser);
  if (user === undefined) {
    throw new DataUnavailableError("user cannot be undefined at this moment!");
  }
  const etoContract: IETOCommitmentAdapter = yield contractsService.getETOCommitmentContract(etoId);

  const { investorTickerRaw, contribution } = yield all({
    investorTickerRaw: etoContract.investorTicket(user.userId),
    contribution: neuCall(loadComputedContributionFromContract, action.payload.eto),
  });

  yield put(
    investorPortfolioActions.setEtoInvestorTicket(
      etoId,
      convertToInvestorTicket(investorTickerRaw),
    ),
  );

  yield put(investorPortfolioActions.setInitialCalculatedContribution(etoId, contribution));
}

export function* loadComputedContributionFromContract(
  _: TGlobalDependencies,
  eto: TEtoSpecsData,
  amountEuroUlps?: string,
  isICBM = false,
): any {
  const { contractsService } = yield* neuGetBindings({
    contractsService: contractsModuleApi.symbols.contractsService,
  });
  if (eto.state !== EEtoState.ON_CHAIN) return;

  const etoContract: IETOCommitmentAdapter = yield contractsService.getETOCommitmentContract(
    eto.etoId,
  );

  const minTicketEur = (eto.minTicketEur && eto.minTicketEur.toString()) || "0";
  const newInvestorContributionEurUlps = amountEuroUlps || convertToUlps(minTicketEur);

  const investorId: string = yield select(authModuleAPI.selectors.selectUserId);

  const contributionRaw = yield etoContract.calculateContribution(
    investorId,
    isICBM,
    new BigNumber(newInvestorContributionEurUlps),
  );

  return convertToCalculatedContribution(contributionRaw);
}

export function* loadClaimables(): SagaGenerator<void> {
  const { logger, contractsService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    contractsService: contractsModuleApi.symbols.contractsService,
  });

  const user = nonNullable(yield* select(authModuleAPI.selectors.selectUser));

  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;
  const etherPrice = yield* select(tokenPriceModuleApi.selectors.selectEtherPriceEur);

  const tokens: [ECurrency, EthereumAddress][] = [
    [ECurrency.EUR_TOKEN, toEthereumAddress(euroToken.address)],
    [ECurrency.ETH, toEthereumAddress(etherToken.address)],
  ];

  try {
    const tokensDisbursalRaw = yield* call(
      [feeDisbursal, "claimableMutipleByToken"],
      tokens.map(([, address]) => address),
      neumark.address,
      user.userId,
    );

    const tokensDisbursal: ITokenDisbursal[] = tokens.map(([token], i) =>
      // claimableMultipeByToken preserves tokens order so it's safe to get exact response by index
      convertToTokenDisbursal(token, tokensDisbursalRaw[i], etherPrice),
    );

    yield put(investorPortfolioActions.setTokensDisbursal(tokensDisbursal));
  } catch (error) {
    yield put(investorPortfolioActions.setTokensDisbursalError());

    logger.error(error, "Failed to load claimables");

    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_CLAIMABLES),
      ),
    );
  }
}

export function* getIncomingPayouts(_: TGlobalDependencies): any {
  const { logger, contractsService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    contractsService: contractsModuleApi.symbols.contractsService,
  });
  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;

  try {
    const { euroTokenIncomingPayout, etherTokenIncomingPayout } = yield all({
      euroTokenIncomingPayout: feeDisbursal.getNonClaimableDisbursals(
        euroToken.address,
        neumark.address,
      ),
      etherTokenIncomingPayout: feeDisbursal.getNonClaimableDisbursals(
        etherToken.address,
        neumark.address,
      ),
    });
    // TODO: Recheck the code here
    const snapshotDate = contractsModuleApi.utils.calculateSnapshotDate(
      yield neumark.currentSnapshotId,
    );
    const euroTokenIncomingPayoutValue = addBigNumbers(
      euroTokenIncomingPayout.map((v: BigNumber[]) => v[1]),
    );
    const etherTokenIncomingPayoutValue = addBigNumbers(
      etherTokenIncomingPayout.map((v: BigNumber[]) => v[1]),
    );
    // TODO: Recheck the code here
    if (euroTokenIncomingPayoutValue || etherTokenIncomingPayoutValue) {
      yield put(
        investorPortfolioActions.setIncomingPayouts({
          euroTokenIncomingPayoutValue,
          etherTokenIncomingPayoutValue,
          snapshotDate,
        }),
      );
    } else {
      yield put(investorPortfolioActions.resetIncomingPayouts());
    }
  } catch (error) {
    logger.error(error, "Failed to load incoming payouts");
    yield put(investorPortfolioActions.setIncomingPayoutsError());
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_INCOMING_PAYOUTS),
      ),
    );
  }
}

export function* loadPersonalTokenDiscount(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof etoModuleApi.actions,
    typeof etoModuleApi.actions.loadTokenTerms
  >,
): Generator<any, any, any> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: contractsModuleApi.symbols.contractsService,
  });
  const { eto } = action.payload;

  if (!isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const userId: string = nonNullable(yield select(authModuleAPI.selectors.selectUserId));

  const etoTerms: IETOTermsAdapter = yield contractsService.getEtoTerms(
    eto.contract.etoTermsAddress,
  );

  const whitelistTicketRaw = yield etoTerms.whitelistTicket(userId);
  const whitelistTicket = convertToWhitelistTicket(whitelistTicketRaw);

  const whitelistDiscount = Q18.minus(whitelistTicket.fullTokenPriceFrac);

  let discountTokenPrice: BigNumber = new BigNumber("0");
  // only check for price when we have discount
  if (whitelistTicket.isWhitelisted) {
    discountTokenPrice = convertFromUlps(
      yield etoTerms.calculatePriceFraction(Q18.minus(whitelistDiscount)),
    );
  }

  yield put(
    investorPortfolioActions.setTokenPersonalDiscount(eto.etoId, {
      whitelistDiscountAmountEur: convertFromUlps(
        whitelistTicket.whitelistDiscountAmountEurUlps.toString(),
      ).toString(),
      whitelistDiscount: convertFromUlps(whitelistDiscount).toString(),
      discountedTokenPrice: discountTokenPrice.toString(),
    }),
  );
}

export function setupInvestorPortfolioSagas(): () => SagaGenerator<void> {
  return function* investorPortfolioTicketsSagas(): any {
    yield fork(neuTakeEvery, investorPortfolioActions.loadInvestorTickets, loadInvestorTickets);
    yield fork(neuTakeEvery, investorPortfolioActions.loadEtoInvestorTicket, loadInvestorTicket);
    yield fork(
      neuTakeLatest,
      investorPortfolioActions.loadTokenPersonalDiscount,
      loadPersonalTokenDiscount,
    );

    yield takeEvery(
      [
        investorPortfolioActions.loadClaimables,
        investorPortfolioActions.loadClaimablesInBackground,
      ],
      loadClaimables,
    );
    yield fork(
      neuTakeEvery,
      [
        investorPortfolioActions.getIncomingPayouts,
        investorPortfolioActions.getIncomingPayoutsInBackground,
      ],
      getIncomingPayouts,
    );
  };
}
