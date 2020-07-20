// eslint-disable-next-line import/no-unassigned-import
import "./app/polyfills";

// eslint-disable-next-line import/no-unassigned-import
import "react-native-gesture-handler/jestSetup.js";

jest.mock("react-native-reanimated", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
  const Reanimated = require("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unsafe-member-access
  Reanimated.default.call = () => {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

// Provide a custom request animation frame that's pushing callback with some small delay
// see https://www.benjaminjohnson.me/blog/testing-animations-in-react-native/
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access
(global as any).requestAnimationFrame = (cb: () => void) => {
  setTimeout(cb, 1);
};
