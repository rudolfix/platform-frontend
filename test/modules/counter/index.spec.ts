import {
  ICounterState,
  counterIncrementAction,
  counterReducer,
  counterDecrementAction,
  explicitCounterAsyncAction,
} from "../../../app/modules/counter/index";
import { expect } from "chai";
import { IAppState, AppDispatch } from "../../../app/store";
import { TDelay, TGetState, TNavigateTo } from "../../../app/getContainer";
import { spy } from "sinon";

describe("counter module", () => {
  describe("reducer", () => {
    it("should act on increase action", () => {
      const prevState: ICounterState = {
        value: 1,
      };
      const action = counterIncrementAction({ by: 5 });

      const newState = counterReducer(prevState, action);

      expect(newState).to.be.deep.eq({
        value: 6,
      });
    });

    it("should act on decrement action", () => {
      const prevState: ICounterState = {
        value: 1,
      };
      const action = counterDecrementAction();

      const newState = counterReducer(prevState, action);

      expect(newState).to.be.deep.eq({
        value: 0,
      });
    });
  });

  describe("counter async action", () => {
    it("should not navigate if counter value is below 10", async () => {
      const appState: Partial<IAppState> = {
        counterState: {
          value: 5,
        },
      };

      const delayMock: TDelay = spy(() => Promise.resolve());
      const dispatchMock: AppDispatch = spy(() => {});
      const getStateMock: TGetState = spy(() => appState);
      const navigateToMock: TNavigateTo = spy(() => {});

      await explicitCounterAsyncAction(delayMock, dispatchMock, getStateMock, navigateToMock);

      expect(delayMock).to.be.calledWithExactly(1000);
      expect(dispatchMock).to.be.calledWithExactly(counterIncrementAction({ by: 2 }));
      expect(getStateMock).to.be.calledWithExactly();
      expect(navigateToMock).to.be.not.be.called;
    });

    it("should navigate if counter value is 10", async () => {
      const appState: Partial<IAppState> = {
        counterState: {
          value: 10,
        },
      };

      const delayMock: TDelay = spy(() => Promise.resolve());
      const dispatchMock: AppDispatch = spy(() => {});
      const getStateMock: TGetState = spy(() => appState);
      const navigateToMock: TNavigateTo = spy(() => {});

      await explicitCounterAsyncAction(delayMock, dispatchMock, getStateMock, navigateToMock);

      expect(delayMock).to.be.calledWithExactly(1000);
      expect(dispatchMock).to.be.calledWithExactly(counterIncrementAction({ by: 2 }));
      expect(getStateMock).to.be.calledWithExactly();
      expect(navigateToMock).to.be.calledWithExactly("/success");
    });
  });
});
