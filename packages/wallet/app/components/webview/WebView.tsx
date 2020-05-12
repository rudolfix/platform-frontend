import { RouteProp } from "@react-navigation/native";
import React from "react";
import { WebView } from "react-native-webview";
import { RootStackParamList } from "../../routeUtils";

type TCustomWebViewProps = {
  route: RouteProp<RootStackParamList, "WebView">;
};

const CustomWebView: React.FunctionComponent<TCustomWebViewProps> = ({ route }) => (
  <WebView source={{ uri: route.params.uri }} />
);

export { CustomWebView as WebView };
