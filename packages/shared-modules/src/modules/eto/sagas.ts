import {
  all,
  call,
  fork,
  neuCall,
  neuTakeEvery,
  neuTakeLatest,
  neuTakeUntil,
  put,
  SagaGenerator,
  select,
  TActionFromCreator,
  takeEvery,
} from "@neufund/sagas";
import {
  convertFromUlps,
  divideBigNumbers,
  multiplyBigNumbers,
  nonNullable,
  Q18,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import { LOCATION_CHANGE } from "connected-react-router";
import { compose, keyBy, map, omit } from "lodash/fp";

import { createMessage } from "../../messages";
import { generateRandomEthereumAddress, neuGetBindings } from "../../utils";
import { authModuleAPI, EUserType } from "../auth/module";
import { bookbuildingModuleApi } from "../bookbuilding/module";
import { IEquityTokenAdapter } from "../contracts/lib/IEquityTokenAdapter";
import {
  contractsModuleApi,
  IERC20TokenAdapter,
  IETOCommitmentAdapter,
  IETOTermsAdapter,
  ITokenControllerAdapter,
} from "../contracts/module";
import { coreModuleApi } from "../core/module";
import { investorPortfolioModuleApi } from "../investor-portfolio/module";
import { kycApi } from "../kyc/module";
import { notificationUIModuleApi } from "../notification-ui/module";
import { routingModuleApi } from "../routing/module";
import { etoActions } from "./actions";
import { InvalidETOStateError } from "./errors";
import {
  EEtoState,
  TCompanyEtoData,
  TEtoDataWithCompany,
  TEtoSpecsData,
} from "./lib/http/eto-api/EtoApi.interfaces";
import { symbols } from "./lib/symbols";
import { EtoMessage } from "./messages";
import { TEtoContractData, TEtoModuleState } from "./module";
import { watchEtosSetActionSaga } from "./sagas/watchEtosSetActionSaga";
import {
  selectEtoOnChainStateById,
  selectEtoSubStateEtoEtoWithContract,
  selectFilteredEtosByRestrictedJurisdictions,
} from "./selectors";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
  TEtoWithCompanyAndContractReadonly,
  TEtoWithContract,
} from "./types";
import { convertToEtoTotalInvestment, convertToStateStartDate, isOnChain } from "./utils";
export * from "./sagas/watchEtosSetActionSaga";

type TGlobalDependencies = unknown;

function* loadEtoPreview(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof etoActions, typeof etoActions.loadEtoPreview>,
): any {
  const { logger, apiEtoService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiEtoService: symbols.etoApi,
  });
  const previewCode = action.payload.previewCode;

  try {
    const eto: TEtoSpecsData = yield apiEtoService.getEtoPreview(previewCode);
    yield neuCall(loadAdditionalEtoData, eto);
  } catch (e) {
    logger.error(e, "Could not load eto by preview code");

    if (action.payload.widgetView) {
      yield put(etoActions.setEtoWidgetError());
      return;
    }

    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW),
      ),
    );
    yield put(routingModuleApi.actions.goToDashboard());
  }
}

function* loadEto(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof etoActions, typeof etoActions.loadEto>,
): any {
  const { logger, apiEtoService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiEtoService: symbols.etoApi,
  });
  const etoId = action.payload.etoId;

  try {
    const eto: TEtoSpecsData = yield apiEtoService.getEto(etoId);
    yield neuCall(loadAdditionalEtoData, eto);
  } catch (e) {
    logger.error(e, "Could not load eto by id");

    if (action.payload.widgetView) {
      yield put(etoActions.setEtoWidgetError());

      return;
    }

    yield put(
      notificationUIModuleApi.actions.showError(createMessage(EtoMessage.COULD_NOT_LOAD_ETO)),
    );
    yield put(routingModuleApi.actions.goToDashboard());
  }
}

export function* loadAdditionalEtoData(
  //loads and stores data related to eto, e.g. company, contract, bookbuilding stats, pledge data
  _: TGlobalDependencies,
  eto: TEtoSpecsData,
): Generator<any, any, any> {
  const { apiEtoService } = yield* neuGetBindings({
    apiEtoService: symbols.etoApi,
  });

  const company: TCompanyEtoData = yield apiEtoService.getCompanyById(eto.companyId);

  // Load contract data if eto is already on blockchain
  if (eto.state === EEtoState.ON_CHAIN) {
    // load investor tickets
    const userType: EUserType | undefined = yield select((state: TEtoModuleState) =>
      authModuleAPI.selectors.selectUserType(state),
    );
    if (userType === EUserType.INVESTOR) {
      yield put(investorPortfolioModuleApi.actions.loadEtoInvestorTicket(eto));
    }

    const etoWithContract: TEtoWithCompanyAndContractReadonly = yield call(loadEtoContract, eto);

    if (
      etoWithContract.contract &&
      [EETOStateOnChain.Payout, EETOStateOnChain.Claim].includes(
        etoWithContract.contract.timedState,
      ) &&
      userType === EUserType.INVESTOR
    ) {
      yield call(loadToken, etoWithContract);
    }
  }

  // This needs to always be after loadingEtoContract step
  const onChainState: EETOStateOnChain | undefined = yield select((state: TEtoModuleState) =>
    selectEtoOnChainStateById(state, eto.etoId),
  );
  if (bookbuildingModuleApi.utils.shouldLoadBookbuildingStats(eto.state, onChainState)) {
    eto.isBookbuilding
      ? yield put(bookbuildingModuleApi.actions.bookBuildingStartWatch(eto.etoId))
      : yield put(bookbuildingModuleApi.actions.loadBookBuildingStats(eto.etoId));
  } else {
    yield put(bookbuildingModuleApi.actions.bookBuildingStopWatch(eto.etoId));
  }

  yield put(etoActions.setEto({ eto, company }));
}

export function* loadEtoWithCompanyAndContract(
  _: TGlobalDependencies,
  previewCode: string,
): Generator<any, any, any> {
  const { apiEtoService } = yield* neuGetBindings({
    apiEtoService: symbols.etoApi,
  });
  const eto: TEtoWithCompanyAndContract = yield apiEtoService.getEtoPreview(previewCode);
  eto.company = yield apiEtoService.getCompanyById(eto.companyId);

  if (eto.state === EEtoState.ON_CHAIN) {
    eto.contract = yield call(getEtoContract, eto.etoId, eto.state);
  }

  eto.subState = yield select(selectEtoSubStateEtoEtoWithContract, eto);
  return eto;
}

export function* loadEtoWithCompanyAndContractById(
  _: TGlobalDependencies,
  etoId: string,
): Generator<any, any, any> {
  const { apiEtoService } = yield* neuGetBindings({
    apiEtoService: symbols.etoApi,
  });
  const eto: TEtoWithCompanyAndContract = yield apiEtoService.getEto(etoId);
  eto.company = yield apiEtoService.getCompanyById(eto.companyId);

  if (eto.state === EEtoState.ON_CHAIN) {
    eto.contract = yield call(getEtoContract, eto.etoId, eto.state);
  }

  eto.subState = yield select(selectEtoSubStateEtoEtoWithContract, eto);
  return eto;
}

export function* getEtoContract(etoId: string, state: EEtoState): SagaGenerator<TEtoContractData> {
  const { logger, contractsService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    contractsService: contractsModuleApi.symbols.contractsService,
  });

  if (state !== EEtoState.ON_CHAIN) {
    throw new InvalidETOStateError(state, EEtoState.ON_CHAIN);
  }

  try {
    const etoContract = yield* call([contractsService, "getETOCommitmentContract"], etoId);

    const etherTokenContract: IERC20TokenAdapter = contractsService.etherToken;
    const euroTokenContract: IERC20TokenAdapter = contractsService.euroToken;

    // fetch eto contracts state with 'all' to improve performance
    const {
      etherTokenBalance,
      euroTokenBalance,
      timedStateRaw,
      totalInvestmentRaw,
      startOfStatesRaw,
      equityTokenAddress,
      etoTermsAddress,
    } = yield* all({
      etherTokenBalance: call([etherTokenContract, "balanceOf"], etoContract.address),
      euroTokenBalance: call([euroTokenContract, "balanceOf"], etoContract.address),
      timedStateRaw: call(() => etoContract.timedState),
      totalInvestmentRaw: call([etoContract, "totalInvestment"]),
      startOfStatesRaw: call(() => etoContract.startOfStates),
      equityTokenAddress: call(() => etoContract.equityToken),
      etoTermsAddress: call(() => etoContract.etoTerms),
    });

    return {
      equityTokenAddress,
      etoTermsAddress,
      timedState: timedStateRaw.toNumber(),
      totalInvestment: convertToEtoTotalInvestment(
        totalInvestmentRaw,
        euroTokenBalance,
        etherTokenBalance,
      ),
      startOfStates: convertToStateStartDate(startOfStatesRaw),
    };
  } catch (e) {
    logger.error(e, "ETO contract data could not be loaded", { etoId: etoId });

    // rethrow original error so it can be handled by caller saga
    throw e;
  }
}

export function* loadEtoContract(eto: TEtoSpecsData): SagaGenerator<TEtoWithContract> {
  const contract = yield* call(getEtoContract, eto.etoId, eto.state);

  yield put(etoActions.setEtoDataFromContract(eto.previewCode, contract));

  return { ...eto, contract };
}

export function* loadEtos(): SagaGenerator<void> {
  const { logger, apiEtoService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiEtoService: symbols.etoApi,
  });
  yield put(bookbuildingModuleApi.actions.loadAllPledges());
  try {
    const etos = yield* call([apiEtoService, "getEtos"]);

    const jurisdiction = yield* select(kycApi.selectors.selectClientJurisdiction);

    yield put(bookbuildingModuleApi.actions.loadBookBuildingListStats(etos.map(eto => eto.etoId)));

    const etosWithContract = yield* all(
      etos.filter(eto => eto.state === EEtoState.ON_CHAIN).map(eto => call(loadEtoContract, eto)),
    );

    const filteredEtosByJurisdictionRestrictions = yield* select((state: TEtoModuleState) =>
      selectFilteredEtosByRestrictedJurisdictions(state, etos, jurisdiction),
    );

    const order = filteredEtosByJurisdictionRestrictions.map(eto => eto.previewCode);

    const companies = compose(
      keyBy((eto: TCompanyEtoData) => eto.companyId),
      map((eto: TEtoDataWithCompany) => eto.company),
    )(filteredEtosByJurisdictionRestrictions);

    const etosByPreviewCode = compose(
      keyBy((eto: TEtoSpecsData) => eto.previewCode),
      // remove company prop from eto
      // it's saved separately for consistency with other endpoints
      map(omit("company")),
    )(filteredEtosByJurisdictionRestrictions);

    // load investor tickets
    const userType: EUserType | undefined = yield* select((state: TEtoModuleState) =>
      authModuleAPI.selectors.selectUserType(state),
    );

    if (userType === EUserType.INVESTOR) {
      yield put(investorPortfolioModuleApi.actions.loadInvestorTickets(etosByPreviewCode));

      const myAssets = etosWithContract.filter(
        eto =>
          eto.contract &&
          [EETOStateOnChain.Payout, EETOStateOnChain.Claim].includes(eto.contract.timedState),
      );

      yield* call(loadTokens, myAssets);
    }

    yield put(etoActions.setEtos({ etos: etosByPreviewCode, companies }));
    yield put(etoActions.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error(e, "ETOs could not be loaded");

    yield put(
      notificationUIModuleApi.actions.showError(createMessage(EtoMessage.COULD_NOT_LOAD_ETOS)),
    );

    // set empty display order to remove loading indicator
    yield put(etoActions.setEtosDisplayOrder([]));
    yield put(etoActions.setEtosError());
  }
}

function* loadToken(eto: TEtoWithContract): Generator<any, any, any> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: contractsModuleApi.symbols.contractsService,
  });

  const walletAddress: string = nonNullable(yield select(authModuleAPI.selectors.selectUserId));
  if (!isOnChain(eto)) {
    return;
  }

  const equityTokenAddress = eto.contract.equityTokenAddress;

  const equityToken: IEquityTokenAdapter = yield contractsService.getEquityToken(
    equityTokenAddress,
  );

  const { balanceUlps, balanceDecimals, tokensPerShare, tokenController } = yield all({
    balanceUlps: equityToken.balanceOf(walletAddress),
    balanceDecimals: equityToken.decimals,
    tokensPerShare: equityToken.tokensPerShare,
    tokenController: equityToken.tokenController,
  });

  const controllerGovernance = yield contractsService.getControllerGovernance(tokenController);
  const tokenControllerMe: ITokenControllerAdapter = yield contractsService.getTokenController(
    tokenController,
  );
  const canTransferToken = yield tokenControllerMe.onTransfer(
    walletAddress,
    walletAddress,
    generateRandomEthereumAddress(),
    new BigNumber("1"),
  );

  let [
    shareCapital,
    companyValuationEurUlps,
    ,
  ] = yield controllerGovernance.shareholderInformation();

  // backward compatibility with FF Token Controller - may be removed after controller migration
  if (Q18.gt(shareCapital)) {
    // convert shares to capital amount with nominal share value of 1 (Q18)
    shareCapital = shareCapital.mul(Q18);
  }

  // obtain nominal value of a share from IEquityToken
  let shareNominalValueUlps;
  try {
    shareNominalValueUlps = yield equityToken.shareNominalValueUlps;
  } catch (e) {
    // make it backward compatible with FF ETO, which is always and forever Q18 and does not provide method above
    shareNominalValueUlps = Q18;
  }

  // todo: use standard calcSharePrice util from calculator, after converting from wei scale
  const tokenPrice = divideBigNumbers(
    divideBigNumbers(
      multiplyBigNumbers([companyValuationEurUlps, shareNominalValueUlps]),
      shareCapital,
    ),
    tokensPerShare,
  );

  const tokenData = {
    balanceUlps: balanceUlps.toString(),
    balanceDecimals: balanceDecimals,
    tokensPerShare: tokensPerShare.toString(),
    totalCompanyShares: shareCapital.toString(),
    companyValuationEurUlps: companyValuationEurUlps.toString(),
    tokenPrice: convertFromUlps(tokenPrice.toString()).toString(),
    canTransferToken,
  };

  yield put(etoActions.setTokenData(eto.previewCode, tokenData));
}

function* loadTokens(etos: TEtoWithContract[]): Generator<any, any, any> {
  if (!etos) {
    return;
  }

  yield all(etos.map(eto => call(loadToken, eto)));

  yield put(etoActions.setTokensLoadingDone());
}

export function* issuerFlowLoadInvestmentAgreement(
  _: TGlobalDependencies,
  {
    payload: { etoId, previewCode },
  }: TActionFromCreator<typeof etoActions, typeof etoActions.loadSignedInvestmentAgreement>,
): Generator<any, any, any> {
  const url = yield neuCall(loadInvestmentAgreement, etoId);

  yield put(etoActions.setInvestmentAgreementHash(previewCode, url));
}

export function* loadInvestmentAgreement(
  _: TGlobalDependencies,
  etoId: string,
): Generator<any, any, any> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: contractsModuleApi.symbols.contractsService,
  });
  const contract: IETOCommitmentAdapter = yield contractsService.getETOCommitmentContract(etoId);
  const url: string = yield contract.signedInvestmentAgreementUrl;

  return url === "" ? undefined : url;
}

export function* loadCapitalIncrease(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof etoActions, typeof etoActions.loadCapitalIncrease>,
): Generator<any, any, any> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: contractsModuleApi.symbols.contractsService,
  });
  const contract: IETOCommitmentAdapter = yield contractsService.getETOCommitmentContract(
    payload.etoId,
  );

  const [, capitalIncrease]: [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
  ] = yield contract.contributionSummary();

  return capitalIncrease.toString();
}

export function* loadEtoGeneralTokenDiscounts(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof etoActions, typeof etoActions.loadTokenTerms>,
): Generator<any, any, any> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: contractsModuleApi.symbols.contractsService,
  });
  const { eto } = action.payload;

  if (!isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const etoTerms: IETOTermsAdapter = yield contractsService.getEtoTerms(
    eto.contract.etoTermsAddress,
  );

  const {
    whitelistDiscountFrac,
    publicDiscountFrac,
  }: { whitelistDiscountFrac: BigNumber; publicDiscountFrac: BigNumber } = yield all({
    whitelistDiscountFrac: yield etoTerms.WHITELIST_DISCOUNT_FRAC,
    publicDiscountFrac: yield etoTerms.PUBLIC_DISCOUNT_FRAC,
  });

  const {
    whitelistDiscountUlps,
    publicDiscountUlps,
  }: { whitelistDiscountUlps: BigNumber; publicDiscountUlps: BigNumber } = yield all({
    whitelistDiscountUlps: yield etoTerms.calculatePriceFraction(Q18.minus(whitelistDiscountFrac)),
    publicDiscountUlps: yield etoTerms.calculatePriceFraction(Q18.minus(publicDiscountFrac)),
  });

  yield put(
    etoActions.setTokenGeneralDiscounts(eto.etoId, {
      whitelistDiscount: convertFromUlps(whitelistDiscountFrac).toString(),
      discountedTokenPrice: convertFromUlps(whitelistDiscountUlps).toString(),
      publicDiscountFrac: convertFromUlps(publicDiscountFrac).toNumber(),
      publicDiscount: convertFromUlps(publicDiscountUlps).toString(),
    }),
  );
}

export function setupEtoSagas(): () => SagaGenerator<void> {
  return function* etoSagas(): Generator<any, any, any> {
    yield fork(neuTakeEvery, etoActions.loadEtoPreview, loadEtoPreview);
    yield fork(neuTakeEvery, etoActions.loadEto, loadEto);
    yield takeEvery(etoActions.loadEtos, loadEtos);
    yield fork(neuTakeLatest, etoActions.loadTokenTerms, loadEtoGeneralTokenDiscounts);

    yield fork(
      neuTakeLatest,
      etoActions.loadSignedInvestmentAgreement,
      issuerFlowLoadInvestmentAgreement,
    );

    yield fork(neuTakeUntil, etoActions.setEtos, LOCATION_CHANGE, watchEtosSetActionSaga);
  };
}
