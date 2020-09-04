import { eventChannel, END } from "@neufund/sagas";
import { invariant, UnknownObject } from "@neufund/shared-utils";
import { EventEmitter2 } from "eventemitter2";
import noop from "lodash/noop";
import { Alert, AppState, AppStateStatus } from "react-native";

type TReduxifyAction = {
  type: string;
  payload?: UnknownObject;
  error?: Error;
  meta?: UnknownObject;
};

/**
 * Converts an events to a flux standard action format and expose them as redux-saga channel
 *
 * @param eventEmitter - A class that extends EventEmitter2
 */
const reduxify = <T extends TReduxifyAction>(eventEmitter: EventEmitter2) =>
  eventChannel<T>(emitter => {
    const listener = (
      type: string | string[],
      error?: Error,
      payload?: UnknownObject,
      meta?: UnknownObject,
    ) => {
      invariant(typeof type === "string", `Invalid event type. Event ${type.toString()}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return emitter({ type, payload, error, meta } as any);
    };

    eventEmitter.onAny(listener);

    return () => eventEmitter.offAny(listener);
  });

const appStateChannel = () =>
  eventChannel<{ nextState: AppStateStatus; currentState: AppStateStatus }>(emitter => {
    let currentState = AppState.currentState;

    const listener = (nextState: AppStateStatus) => {
      emitter({ currentState, nextState });
      currentState = nextState;
    };

    AppState.addEventListener("change", listener);

    return () => {
      AppState.removeEventListener("change", listener);
    };
  });

const createAlertChannel = (title: string, message: string) =>
  eventChannel<boolean>(emitter => {
    const emit = () => {
      emitter(true);
      // close the channel given only one even can be emitted from Alert
      emitter(END);
    };

    Alert.alert(title, message, [{ text: "OK", onPress: () => emit() }], {
      cancelable: true,
      onDismiss: () => emit(),
    });

    return noop;
  });

export { reduxify, createAlertChannel, appStateChannel };
