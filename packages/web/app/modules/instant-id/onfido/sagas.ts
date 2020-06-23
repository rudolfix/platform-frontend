import { END, eventChannel, fork, put, take } from "@neufund/sagas";
import {
  coreModuleApi,
  kycApi,
  neuGetBindings,
  TKycOnfidoUploadRequest,
} from "@neufund/shared-modules";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { neuCall, neuTakeUntil } from "../../sagasUtils";
import { EOnfidoSDKEvents } from "../lib/onfido/OnfidoSDK";
import { symbols } from "../symbols";

type TChannelTypes = {
  type: EOnfidoSDKEvents;
};

function* initOnfidoSdk(_: TGlobalDependencies): Generator<any, any, any> {
  const { apiKycService, onfidoSDK } = yield* neuGetBindings({
    apiKycService: kycApi.symbols.kycApi,
    onfidoSDK: symbols.onfidoSDK,
  });

  try {
    yield put(actions.fullPageLoading.showFullPageLoading());

    const uploadRequest: TKycOnfidoUploadRequest = yield apiKycService.putOnfidoUploadRequest();

    // Update kyc status after starting onfido request
    yield neuCall(kycApi.sagas.loadKycStatus);

    yield onfidoSDK.init({
      token: uploadRequest.webtoken,
    });
  } catch (e) {
    onfidoSDK.tearDown();

    // it's important to rethrow here so we can catch and react inside onfido start saga
    throw e;
  } finally {
    yield put(actions.fullPageLoading.hideFullPageLoading());
  }
}

function* checkOnfidoRequest(_: TGlobalDependencies): Generator<any, any, any> {
  const { apiKycService } = yield* neuGetBindings({ apiKycService: kycApi.symbols.kycApi });

  try {
    yield put(actions.fullPageLoading.showFullPageLoading());

    yield apiKycService.putOnfidoCheckRequest();

    // Update kyc status after successful check request
    yield neuCall(kycApi.sagas.loadKycStatus);
  } finally {
    yield put(actions.fullPageLoading.hideFullPageLoading());
  }
}

function* handleOnfidoSdkEvents(_: TGlobalDependencies): Generator<any, any, any> {
  const { onfidoSDK } = yield* neuGetBindings({
    onfidoSDK: symbols.onfidoSDK,
  });
  const channel = eventChannel<TChannelTypes>(emit => {
    onfidoSDK.on(EOnfidoSDKEvents.DISCARDED, () => {
      emit({ type: EOnfidoSDKEvents.DISCARDED });
    });

    onfidoSDK.on(EOnfidoSDKEvents.COMPLETED, () => {
      emit({ type: EOnfidoSDKEvents.COMPLETED });
    });

    onfidoSDK.on(EOnfidoSDKEvents.FAILED, () => {
      emit({ type: EOnfidoSDKEvents.FAILED });
    });

    return () => {
      onfidoSDK.removeAllListeners();
    };
  });

  try {
    while (true) {
      const event: TChannelTypes | END = yield take(channel);

      switch (event.type) {
        case EOnfidoSDKEvents.DISCARDED:
          // in case onfido flow was discarded by the user just clean up
          return;
        case EOnfidoSDKEvents.COMPLETED:
          yield neuCall(checkOnfidoRequest);
          return;
        case EOnfidoSDKEvents.FAILED:
          throw new Error("Failed to process onfido event");
      }
    }
  } finally {
    channel.close();

    // clean up Onfido sdk
    onfidoSDK.tearDown();
  }
}

function* startOnfidoRequest(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({ logger: coreModuleApi.symbols.logger });

  try {
    yield neuCall(initOnfidoSdk);

    yield neuCall(handleOnfidoSdkEvents);
  } catch (e) {
    logger.error(e, "Failed to start onfido request");

    yield put(actions.instantId.startOnfidoRequestError(e));
  }
}

export function* onfidoSagas(): Generator<any, any, any> {
  yield fork(
    neuTakeUntil,
    actions.instantId.startOnfidoRequest,
    actions.instantId.stopOnfidoRequest,
    startOnfidoRequest,
  );
}
