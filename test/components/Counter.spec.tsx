import * as React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";
import { CounterSFC, Counter } from "../../app/components/Counter";
import { spy } from "sinon";
import { tid } from "../testUtils";
import { Provider } from "react-redux";
import {
  getContainer,
  customizerContainerWithMiddlewareApi,
  Delay,
  NavigateTo,
} from "../../app/getContainer";
import { applyMiddleware } from "redux";
import { createInjectMiddleware } from "../../app/redux-injectify";
import { reducers, IAppState } from "../../app/store";
import { createStore } from "redux";

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
