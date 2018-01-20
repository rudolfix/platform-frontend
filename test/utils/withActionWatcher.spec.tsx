import { expect } from "chai";
import * as React from "react";
import { Provider } from "react-redux";
import { spy } from "sinon";
import { withActionWatcher } from "../../app/utils/WatchAction";
import { createMount } from "../createMount";
import { createDummyStore } from "../fixtures";
import { globalFakeClock } from "../setupTestsHooks";

describe("withActionWatcher", () => {
  const SomeComponent = () => <h1>SOME COMPONENT</h1>;

  it("should render child component", () => {
    const WatchComponent = withActionWatcher({
      actionCreator: (dispatch: any) => dispatch({ type: "ACTION" }),
      interval: 1000,
    })(SomeComponent);

    const mountComponent = createMount(
      <Provider store={createDummyStore()}>
        <WatchComponent />
      </Provider>,
    );

    expect(mountComponent.contains(<SomeComponent />)).to.be.true;
  });

  it("should call action on initial render", () => {
    const actionCreator = spy((dispatch: any) => dispatch({ type: "ACTION" }));
    const WatchComponent = withActionWatcher({
      actionCreator,
      interval: 1000,
    })(SomeComponent);

    createMount(
      <Provider store={createDummyStore()}>
        <WatchComponent />
      </Provider>,
    );

    expect(actionCreator).to.be.calledOnce;
  });

  it("should call action again every interval", () => {
    const actionCreator = spy((dispatch: any) => dispatch({ type: "ACTION" }));
    const WatchComponent = withActionWatcher({
      actionCreator,
      interval: 1000,
    })(SomeComponent);

    createMount(
      <Provider store={createDummyStore()}>
        <WatchComponent />
      </Provider>,
    );

    expect(actionCreator).to.be.calledOnce;
    globalFakeClock.tick(1000);
    expect(actionCreator).to.be.calledTwice;
    globalFakeClock.tick(1000);
    expect(actionCreator).to.be.calledThrice;
  });

  it("should not call action when was unmounted", () => {
    const actionCreator = spy((dispatch: any) => dispatch({ type: "ACTION" }));
    const WatchComponent = withActionWatcher({
      actionCreator,
      interval: 1000,
    })(SomeComponent);

    const mountComponent = createMount(
      <Provider store={createDummyStore()}>
        <WatchComponent />
      </Provider>,
    );

    expect(actionCreator).to.be.calledOnce;
    mountComponent.unmount();
    globalFakeClock.tick(1000);
    expect(actionCreator).to.be.calledOnce;
  });
});
