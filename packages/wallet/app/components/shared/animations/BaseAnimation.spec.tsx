import { render } from "@testing-library/react-native";
import * as React from "react";
import { Text } from "react-native";
import { create } from "react-test-renderer";

import { setupTimeTravel, timeTravel } from "utils/testUtils.specUtils";

import { BaseAnimation } from "./BaseAnimation";

const SHOW_ANIMATION_DURATION = 300;
const HIDE_ANIMATION_DURATION = 200;

const durationProps = {
  showAnimationDuration: SHOW_ANIMATION_DURATION,
  hideAnimationDuration: HIDE_ANIMATION_DURATION,
};

describe("BaseAnimation", () => {
  beforeEach(setupTimeTravel);

  it("should not render content when it's not active", () => {
    const { queryByTestId } = render(
      <BaseAnimation
        isActive={false}
        render={() => <Text testID="content">Animation content</Text>}
        {...durationProps}
      />,
    );

    expect(queryByTestId("content")).toBeNull();
  });

  it("should render content when it's active", () => {
    const { queryByTestId } = render(
      <BaseAnimation
        isActive
        render={() => <Text testID="content">Animation content</Text>}
        {...durationProps}
      />,
    );

    expect(queryByTestId("content")).toBeDefined();
  });

  it("should hide content after animation is done", () => {
    const renderProp = () => <Text testID="content">Animation content</Text>;
    const { queryByTestId, rerender } = render(
      <BaseAnimation isActive render={renderProp} {...durationProps} />,
    );

    rerender(<BaseAnimation isActive={false} render={renderProp} {...durationProps} />);

    expect(queryByTestId("content")).toBeDefined();

    timeTravel(HIDE_ANIMATION_DURATION);

    expect(queryByTestId("content")).toBeNull();
  });

  it("should show content after hide animation is done and props changed to be visible again", () => {
    const renderProp = () => <Text testID="content">Animation content</Text>;

    const { queryByTestId, rerender } = render(
      <BaseAnimation isActive render={renderProp} {...durationProps} />,
    );

    rerender(<BaseAnimation isActive={false} render={renderProp} {...durationProps} />);

    // time travel but still make sure animation is not finished
    timeTravel(HIDE_ANIMATION_DURATION / 2);

    expect(queryByTestId("content")).toBeDefined();

    rerender(
      <BaseAnimation
        isActive
        render={() => <Text testID="new-content">Animation content</Text>}
        {...durationProps}
      />,
    );

    expect(queryByTestId("new-content")).toBeDefined();
  });

  it("should remove memoized children from state", () => {
    const renderProp = ({ memoizedChildren }: { memoizedChildren: React.ReactNode }) =>
      memoizedChildren;

    const testRenderer = create(
      <BaseAnimation isActive render={renderProp} key={"same"} {...durationProps}>
        <Text testID="children">Animation content</Text>
      </BaseAnimation>,
    );

    testRenderer.update(
      <BaseAnimation isActive={false} render={renderProp} key={"same"} {...durationProps}>
        <Text testID="children">Animation content</Text>
      </BaseAnimation>,
    );

    timeTravel(HIDE_ANIMATION_DURATION);

    const instance = testRenderer.getInstance();

    // this may look like testing component internals
    // but for the case when we memoize children
    // we need to make sure that it's properly cleared from memory
    // to avoid dangerous memory leaks
    expect(((instance as unknown) as BaseAnimation<{}>).state.memoizedChildren).toBeUndefined();
  });

  it("should memoize the latest active state children", () => {
    const renderProp = ({ memoizedChildren }: { memoizedChildren: React.ReactNode }) =>
      memoizedChildren;

    const { queryByTestId, rerender } = render(
      <BaseAnimation isActive render={renderProp} {...durationProps}>
        <Text testID="children">Animation content</Text>
      </BaseAnimation>,
    );

    rerender(
      <BaseAnimation isActive={false} render={renderProp} {...durationProps}>
        <Text testID="new-children">Animation content</Text>
      </BaseAnimation>,
    );

    // time travel but still make sure animation is not finished
    timeTravel(HIDE_ANIMATION_DURATION / 100);

    expect(queryByTestId("children")).toBeDefined();
    expect(queryByTestId("new-children")).toBeNull();
  });
});
