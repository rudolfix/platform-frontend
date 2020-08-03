import { useAppState } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import { render, cleanup } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";
import { mocked } from "ts-jest/utils";

import { RNProtectScreen } from "native-modules/RNProtectScreen";

import { withProtectSensitive } from "./withProtectSensitive";

jest.mock("@react-navigation/native");
jest.mock("@react-native-community/hooks");
jest.mock("native-modules/RNProtectScreen", () => ({
  RNProtectScreen: { enable: jest.fn(), disable: jest.fn() },
}));

const Component: React.FunctionComponent = () => <View testID="component"></View>;
const ProtectedComponent = withProtectSensitive(Component);

describe("withProtectSensitive", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render child when app state is active and view is focused", () => {
    mocked(useIsFocused).mockReturnValue(true);
    mocked(useAppState).mockReturnValue("active");

    const { queryByTestId } = render(<ProtectedComponent>foo</ProtectedComponent>);

    expect(queryByTestId("component")).not.toBeNull();
  });

  it("should call enable on protect screen native module when mounted and disable when unmounted", () => {
    mocked(useIsFocused).mockReturnValue(true);
    mocked(useAppState).mockReturnValue("active");

    const { unmount } = render(<ProtectedComponent />);

    expect(RNProtectScreen.enable).toHaveBeenCalled();

    unmount();

    expect(RNProtectScreen.disable).toHaveBeenCalled();
  });

  // It's important for IOS to not unmount during "inactive" state given it's
  // given it's triggered when there is a pending permissions check
  it("should not unmount when state is 'inactive'", () => {
    mocked(useIsFocused).mockReturnValue(true);
    mocked(useAppState).mockReturnValue("inactive");

    const { queryByTestId } = render(<ProtectedComponent />);

    expect(queryByTestId("component")).not.toBeNull();
  });

  it("should unmount when state is 'background'", () => {
    mocked(useIsFocused).mockReturnValue(true);
    mocked(useAppState).mockReturnValue("background");

    const { queryByTestId } = render(<ProtectedComponent />);

    expect(queryByTestId("component")).toBeNull();
  });

  it("should unmount when screen is not focused", () => {
    mocked(useIsFocused).mockReturnValue(false);
    mocked(useAppState).mockReturnValue("active");

    const { queryByTestId } = render(<ProtectedComponent />);

    expect(queryByTestId("component")).toBeNull();
  });

  it("should unmount when screen is not focused and state is 'background'", () => {
    mocked(useIsFocused).mockReturnValue(false);
    mocked(useAppState).mockReturnValue("active");

    const { queryByTestId } = render(<ProtectedComponent />);

    expect(queryByTestId("component")).toBeNull();
  });
});
