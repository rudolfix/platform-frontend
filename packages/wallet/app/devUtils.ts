/**
 * A utils method useful for developer and debugging
 *
 * @important Only import in a development build
 */

import AsyncStorage from "@react-native-community/async-storage";

/**
 * Clears the AsyncStorage
 */
(global as any).clearStorage = () => {
  AsyncStorage.clear()
    .then(() => console.log("Cleared"))
    // catch the error and forward to warning to not break the app completely
    .catch(e => console.warn(e));
};
