import * as React from "react";
import { Animated, Easing, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { grayLighter4, silverLighter1 } from "styles/colors";

type TExternalProps = {
  style?: ViewStyle;
} & ViewStyle;

const GRADIENT_WIDTH = 100;

/**
 * Skeleton animation is kept in global scope to sync progress with all skeletons
 */
const GLOBAL_SKELETON_ANIMATED_VALUE = new Animated.Value(0);

const ANIMATION = Animated.loop(
  Animated.timing(GLOBAL_SKELETON_ANIMATED_VALUE, {
    toValue: 1,
    duration: 800,
    easing: Easing.ease,
    useNativeDriver: true,
  }),
);

const Skeleton: React.FunctionComponent<TExternalProps> = ({
  children: _children,
  style,
  ...props
}) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0, height: 0, width: 0 });

  const { width: windowWidth } = useWindowDimensions();

  const viewRef = React.useRef<View>(null);

  const measurePosition = React.useCallback(() => {
    if (viewRef.current) {
      viewRef.current.measure((_fx, _fy, width, height, px, py) => {
        setPosition({ width, height, x: px, y: py });
      });
    }
  }, []);

  React.useEffect(() => {
    GLOBAL_SKELETON_ANIMATED_VALUE.setValue(0);

    ANIMATION.start();
  }, []);

  const leftPosition = GLOBAL_SKELETON_ANIMATED_VALUE.interpolate({
    inputRange: [0, 1],
    outputRange: [-GRADIENT_WIDTH, windowWidth + GRADIENT_WIDTH],
  });

  return (
    <View
      style={[
        style,
        props,
        styles.skeleton,
        { borderRadius: (position.width + position.height) / 2 },
      ]}
      ref={viewRef}
      onLayout={measurePosition}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX: Animated.subtract(leftPosition, position.x) }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            styles.skeleton.backgroundColor,
            silverLighter1,
            styles.skeleton.backgroundColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: grayLighter4,

    overflow: "hidden",
    position: "relative",
  },
  gradient: {
    flex: 1,
    width: 100,
  },
});

export { Skeleton };
