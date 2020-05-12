import React from "react";
import { WebView } from "react-native-webview";

const CustomWebView = ({ route }) => <WebView source={{ uri: route.params.uri }} />;

export { CustomWebView as WebView };
