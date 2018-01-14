import { ActionPayload, ActionType, IAppAction } from "./store";

export function makeActionCreator<T extends IAppAction>(
  type: ActionType<T>,
): (p: ActionPayload<T>) => T {
  return payload =>
    ({
      type,
      payload,
    } as any);
}

export function makeParameterlessActionCreator<T extends IAppAction>(type: ActionType<T>): () => T {
  return () =>
    ({
      type,
    } as any);
}
