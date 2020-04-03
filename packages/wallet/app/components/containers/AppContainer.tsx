import React from "react";

import { ThemeProvider } from "../../themes/ThemeProvider";

const AppContainer: React.FunctionComponent = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

export { AppContainer };
