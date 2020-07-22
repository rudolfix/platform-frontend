import { eventChannel } from "@neufund/sagas";
import { invariant, UnknownObject } from "@neufund/shared-utils";
import { EventEmitter2 } from "eventemitter2";

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

export { reduxify };
