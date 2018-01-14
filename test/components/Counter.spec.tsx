import { expect } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import { Provider } from "react-redux";
import { applyMiddleware } from "redux";
import { createStore } from "redux";
import { spy } from "sinon";
import { Counter, CounterSFC } from "../../app/components/Counter";
import {
  customizerContainerWithMiddlewareApi,
  Delay,
  getContainer,
  NavigateTo,
} from "../../app/getContainer";
import { createInjectMiddleware } from "../../app/redux-injectify";
import { IAppState, reducers } from "../../app/store";
import { tid } from "../testUtils";

describe("<Counter />", () => {
  it("should render", () => {
    const props = {
      value: 5,
      countUp: spy(),
      countDown: spy(),
      countAsync: spy(),
    };

    const component = shallow(<CounterSFC {...props} />);

    expect(component.find("h2").text()).to.be.eq("5");
  });

  it("should issue action on + click", () => {
    const props = {
      value: 5,
      countUp: spy(),
      countDown: spy(),
      countAsync: spy(),
    };

    const component = shallow(<CounterSFC {...props} />);
    component.find(tid("btn-plus")).simulate("click");

    expect(props.countUp).to.be.calledOnce;
    expect(props.countDown).to.be.not.be.called;
    expect(props.countAsync).to.be.not.be.called;
  });

  describe("integration", () => {
    it("clicking buttons should change counter value and trigger navigation", async () => {
      // get default container
      const container = getContainer();

      //rebind dependencies that cause side effects (could me http client etc)
      container.rebind(Delay).toConstantValue(() => Promise.resolve());
      let navigateToSpy;

      // we use partial here since we are interested only in part of the state and this should make tests harder to break
      const initialState: Partial<IAppState> = {
        counterState: {
          value: 8,
        },
      };

      const middleware = applyMiddleware(
        createInjectMiddleware(container, (container, middlewareApi) => {
          customizerContainerWithMiddlewareApi(container, middlewareApi);
          navigateToSpy = spy(container.get(NavigateTo));
          container.rebind(NavigateTo).toConstantValue(navigateToSpy);
        }),
      );

      const store = createStore(reducers, initialState as any, middleware);
      const component = mount(
        <Provider store={store}>
          <Counter />
        </Provider>,
      );

      expect(component.find("h2").text()).to.be.eq("8");

      // click + button
      // we need to get first component matching tid because they are duplicated (bootstrap's Button and button has it)
      component
        .find(tid("btn-plus"))
        .first()
        .simulate("click");
      expect(component.find("h2").text()).to.be.eq("9");

      // click minus button
      component
        .find(tid("btn-minus"))
        .first()
        .simulate("click");
      expect(component.find("h2").text()).to.be.eq("8");

      // click async button
      component
        .find(tid("btn-async"))
        .first()
        .simulate("click");

      // we give control back to async action
      await Promise.resolve();

      expect(component.find("h2").text()).to.be.eq("10");
      expect(navigateToSpy).to.be.calledWithExactly("/success");
    });
  });
});
