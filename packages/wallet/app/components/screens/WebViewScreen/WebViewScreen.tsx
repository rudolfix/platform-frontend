import { RouteProp } from "@react-navigation/native";
import React from "react";
import { WebView } from "react-native-webview";

import { EAppRoutes } from "router/appRoutes";
import { RootStackParamList } from "router/routeUtils";

type TCustomWebViewProps = {
  route: RouteProp<RootStackParamList, EAppRoutes.webView>;
};

/**
 * @note Basic auth support is coming
 * see https://github.com/react-native-community/react-native-webview/pull/1467
 */
const CustomWebView: React.FunctionComponent<TCustomWebViewProps> = ({ route }) => (
  <WebView source={{ uri: route.params.uri }} />
);

export { CustomWebView as WebView };
