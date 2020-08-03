import { render } from "@testing-library/react-native";
import { EventEmitter } from "events";
import * as React from "react";
import { Text } from "react-native";

import { MockReduxProvider } from "test-utils/MockReduxProvider";

import { onLifecycle } from "./onLifecycle";

const mockEmitter = new EventEmitter();

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (effect: () => () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {};
    let blurCallback = noop;

    mockEmitter.on("focus", () => {
      blurCallback();
      blurCallback = effect();
    });

    mockEmitter.on("blur", () => {
      blurCallback();
      blurCallback = noop;
    });
  },
}));

describe("onLifecycle", () => {
  const Child = () => <Text testID="child-component">Child</Text>;

  it("should render child component", () => {
    const OnLifecycleActionComponent = onLifecycle({})(Child);

    const { queryByTestId } = render(
      <MockReduxProvider>
        <OnLifecycleActionComponent />
      </MockReduxProvider>,
    );

    expect(queryByTestId("content")).toBeDefined();
  });

  it("should call `onMount/onUnmount` when mounted/unmounted", () => {
    const onMount = jest.fn();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const onUnmount = jest.fn();

    const OnLifecycleActionComponent = onLifecycle({ onMount, onFocus, onBlur, onUnmount })(Child);

    const { unmount } = render(
      <MockReduxProvider>
        <OnLifecycleActionComponent />
      </MockReduxProvider>,
    );

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).toHaveBeenCalledTimes(0);

    unmount();

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledTimes(0);
    expect(onBlur).toHaveBeenCalledTimes(0);
  });

  it("should call `onFocus/onBlur` when focused/blurred", () => {
    const onMount = jest.fn();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const onUnmount = jest.fn();

    const OnLifecycleActionComponent = onLifecycle({ onMount, onFocus, onBlur, onUnmount })(Child);

    render(
      <MockReduxProvider>
        <OnLifecycleActionComponent />
      </MockReduxProvider>,
    );

    expect(onMount).toHaveBeenCalledTimes(1);

    mockEmitter.emit("focus");

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(0);

    mockEmitter.emit("blur");

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onUnmount).toHaveBeenCalledTimes(0);
  });
});
