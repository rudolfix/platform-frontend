import { Middleware } from "redux";
import { spy } from "sinon";

export function createSpyMiddleware() {
  const dispatchSpy = spy();
  const middleware: Middleware = middlewareApi => {
    return next => (action: any) => {
      dispatchSpy(action);
      // pass every action
      return next(action);
    };
  };

  return {
    middleware,
    dispatchSpy,
  };
}
