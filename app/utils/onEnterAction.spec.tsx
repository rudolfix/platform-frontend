import * as React from "react";

import { expect } from "chai";
import { Provider as ReduxProvider } from "react-redux";
import { spy } from "sinon";
import { createMount } from "../../test/createMount";
import { createDummyStore } from "../../test/fixtures";
import { onEnterAction } from "./OnEnterAction";

describe("onEnterAction", () => {
  const SomeComponent = () => <h1>SOME COMPONENT</h1>;

  it("should render child component", () => {
    const OnMountActionComponent = onEnterAction({ actionCreator: () => {} })(SomeComponent);

    const mountComponent = createMount(
      <ReduxProvider store={createDummyStore()}>
        <OnMountActionComponent />
      </ReduxProvider>,
    );

    expect(mountComponent.contains(<SomeComponent />)).to.be.true;
  });

  it("should call action creator when mount", () => {
    const actionCreator = spy();

    const OnMountActionComponent = onEnterAction({ actionCreator })(SomeComponent);
    const store = createDummyStore();

    createMount(
      <ReduxProvider store={store}>
        <OnMountActionComponent />
      </ReduxProvider>,
    );

    expect(actionCreator).to.be.calledWithExactly(store.dispatch);
  });
});
