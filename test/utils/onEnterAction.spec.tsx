import * as React from "react";

import { expect } from "chai";
import { Provider } from "react-redux";
import { spy } from "sinon";
import { onEnterAction } from "../../app/utils/OnEnterAction";
import { createMount } from "../createMount";
import { createDummyStore } from "../fixtures";

describe("onEnterAction", () => {
  const SomeComponent = () => <h1>SOME COMPONENT</h1>;

  it("should render child component", () => {
    const OnMountActionComponent = onEnterAction({ actionCreator: () => {} })(SomeComponent);

    const mountComponent = createMount(
      <Provider store={createDummyStore()}>
        <OnMountActionComponent />
      </Provider>,
    );

    expect(mountComponent.contains(<SomeComponent />)).to.be.true;
  });

  it("should call action creator when mount", () => {
    const actionCreator = spy();

    const OnMountActionComponent = onEnterAction({ actionCreator })(SomeComponent);
    const store = createDummyStore();

    createMount(
      <Provider store={store}>
        <OnMountActionComponent />
      </Provider>,
    );

    expect(actionCreator).to.be.calledWithExactly(store.dispatch);
  });
});
