import { all, put, select } from "@neufund/sagas";
import { ITokenDisbursal } from "@neufund/shared-modules";
import {
  addBigNumbers,
  compareBigNumbers,
  convertFromUlps,
  ECurrency,
  invariant,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { MINIMAL_PAYOUT_WITHOUT_WARNING } from "../../../../../config/constants";
import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { ETxType, ITxData } from "../../../../../lib/web3/types";
import { actions } from "../../../../actions";
import { selectIsVerifiedInvestor } from "../../../../auth/selectors";
import { neuCall } from "../../../../sagasUtils";
import { getTokenAddress } from "../../../../shared/sagas";
import { selectEtherPriceEur } from "../../../../shared/tokenPrice/selectors";
import { selectEthereumAddress } from "../../../../web3/selectors";
import {
  selectStandardGasPriceWithOverHead,
  selectTxGasCostEthUlps,
} from "../../../sender/selectors";

// Use highest possible solidity uint256 to accept all disbursals for token
// see https://github.com/Neufund/platform-contracts/blob/59e88f6881bf5adbced8462f1925496467ea4c18/contracts/FeeDisbursal/FeeDisbursal.sol#L164
const ACCEPT_ALL_DISBURSALS = new BigNumber("2").pow(256).minus("1");

function* generatePayoutAcceptTransactionData(
  { contractsService: { feeDisbursal } }: TGlobalDependencies,
  tokensDisbursals: ReadonlyArray<ITokenDisbursal>,
): Generator<any, string, any> {
  if (tokensDisbursals.length === 1) {
    return feeDisbursal
      .acceptTx(
        yield neuCall(getTokenAddress, tokensDisbursals[0].token),
        yield neuCall(getTokenAddress, ECurrency.NEU),
        ACCEPT_ALL_DISBURSALS,
      )
      .getData();
  } else {
    return feeDisbursal
      .acceptMultipleByTokenTx(
        yield all(tokensDisbursals.map(disbursal => neuCall(getTokenAddress, disbursal.token))),
        yield neuCall(getTokenAddress, ECurrency.NEU),
      )
      .getData();
  }
}

function* generatePayoutAcceptTokenTransaction(
  { contractsService: { feeDisbursal }, web3Manager }: TGlobalDependencies,
  tokensDisbursals: ReadonlyArray<ITokenDisbursal>,
): any {
  const isInvestorVerified = yield* select(selectIsVerifiedInvestor);

  invariant(
    isInvestorVerified,
    "Generating payout accept transactions is not allowed for unverified investor",
  );
  const userAddress = yield* select(selectEthereumAddress);
  const gasPriceWithOverhead = yield* select(selectStandardGasPriceWithOverHead);

  const txInput = yield* neuCall(generatePayoutAcceptTransactionData, tokensDisbursals);

  const txInitialDetails = {
    to: feeDisbursal.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead: string = yield web3Manager.estimateGasWithOverhead(
    txInitialDetails,
  );
  return {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };
}

export function* startInvestorPayoutAcceptGenerator(
  _: TGlobalDependencies,
  tokensDisbursals: ReadonlyArray<ITokenDisbursal>,
): any {
  const generatedTxDetails: ITxData = yield neuCall(
    generatePayoutAcceptTokenTransaction,
    tokensDisbursals,
  );

  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  const etherPriceEur: string = yield select(selectEtherPriceEur);
  const gasCostEth: string = yield select(selectTxGasCostEthUlps);
  const gasCostEuro = convertFromUlps(multiplyBigNumbers([gasCostEth, etherPriceEur])).toString();
  const totalDisbursalEuro = addBigNumbers(
    tokensDisbursals.map(disbursal => disbursal.amountEquivEur),
  );
  const totalPayoutEuro = subtractBigNumbers([totalDisbursalEuro, gasCostEuro]);
  const payoutLowerThanMinimum =
    compareBigNumbers(totalPayoutEuro, MINIMAL_PAYOUT_WITHOUT_WARNING) < 0;
  yield put(
    actions.txSender.txSenderContinueToSummary<ETxType.INVESTOR_ACCEPT_PAYOUT>({
      tokensDisbursals,
      gasCostEth,
      gasCostEuro,
      totalPayoutEuro,
      payoutLowerThanMinimum,
    }),
  );
}
