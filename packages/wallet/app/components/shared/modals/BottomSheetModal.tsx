import { useBackHandler } from "@react-native-community/hooks";
import noop from "lodash/noop";
import * as React from "react";
import { View, Animated, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BaseAnimation } from "components/shared/animations/BaseAnimation";

import { baseWhite } from "styles/colors";
import { spacingStyles } from "styles/spacings";

const BOTTOM_SHEET_BACKDROP_COLOR = "rgba(0, 0, 0, 0.4)";
const SHOW_ANIMATION_DURATION = 300;
const HIDE_ANIMATION_DURATION = 200;

type TExternalProps = {
  isVisible: boolean;
  onDismiss?: () => void;
};

const BottomSheetModal: React.FunctionComponent<TExternalProps> = ({
  isVisible,
  onDismiss = noop,
  ...rest
}) => {
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  useBackHandler(() => {
    if (isVisible) {
      onDismiss();

      return true;
    }

    return false;
  });

  return (
    <BaseAnimation
      isActive={isVisible}
      showAnimationDuration={SHOW_ANIMATION_DURATION}
      hideAnimationDuration={HIDE_ANIMATION_DURATION}
      render={({ progress, memoizedChildren }) => {
        const minimumAnimationRange = 0.01;

        const backdrop = {
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, minimumAnimationRange],
                outputRange: [height, 0],
                extrapolate: "clamp",
              }),
            },
          ],
          opacity: progress.interpolate({
            inputRange: [0, 0.5],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
        };

        const slideUp = {
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -height],
              }),
            },
          ],
        };

        return (
          <Animated.View
            pointerEvents={isVisible ? "auto" : "none"}
            accessibilityViewIsModal
            accessibilityLiveRegion="polite"
            style={[styles.backdrop, backdrop]}
          >
            <Animated.View style={[styles.sheet, slideUp, { height }]}>
              <View style={[styles.content, { paddingBottom: bottom }]} pointerEvents="box-none">
                {memoizedChildren}
              </View>
            </Animated.View>
          </Animated.View>
        );
      }}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: BOTTOM_SHEET_BACKDROP_COLOR,
  },
  sheet: {
    ...spacingStyles.p1,

    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    justifyContent: "flex-end",
  },
  content: {
    ...spacingStyles.p4,
    backgroundColor: baseWhite,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});

export { BottomSheetModal };
