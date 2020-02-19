import "react-native-gesture-handler";
import Config from "react-native-config";
import { AppRegistry } from "react-native";
import { App } from "./app/App";
import { name as appName } from "./app.json";
import StorybookUIRoot from "./storybook";
const EntryPoint = Config.STORYBOOK_RUN === "1" ? StorybookUIRoot : App;

AppRegistry.registerComponent(appName, () => EntryPoint);
