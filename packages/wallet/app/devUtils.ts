/* eslint-disable no-console */
/**
 * A utils method useful for developer and debugging
 *
 * @important Only import in a development build
 */

import AsyncStorage from "@react-native-community/async-storage";
import { LogBox } from "react-native";

/**
 * Clears the AsyncStorage
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(global as any).clearStorage = () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  AsyncStorage.clear()
    .then(() => console.log("AsyncStorage cleared"))
    // catch the error and forward to warning to not break the app completely
    .catch(e => console.warn(e));
};

// List of annoying warnings that we're ignoring
LogBox.ignoreLogs([
  "Remote debugger is in a background tab which may cause apps to perform slowly. Fix this by foregrounding the tab (or opening it in a separate window).",
]);
