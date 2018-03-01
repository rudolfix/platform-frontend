import { expect } from "chai";
import { actions } from "../actions";
import { initInitialState, initReducer } from "./reducer";

describe("init > reducer", () => {
  it("should act on INIT_DONE", () => {
    const action = actions.init.done();
    const previousState = initInitialState;

    const newState = initReducer(previousState, action);

    expect(newState).to.be.deep.eq({
      error: false,
      errorMsg: undefined,
      done: true,
    });
  });

  it("should act on INIT_ERROR", () => {
    const expectedError = "SOME ERROR";
    const action = actions.init.error(expectedError);
    const previousState = initInitialState;

    const newState = initReducer(previousState, action);

    expect(newState).to.be.deep.eq({
      done: false,
      error: true,
      errorMsg: expectedError,
    });
  });
});
