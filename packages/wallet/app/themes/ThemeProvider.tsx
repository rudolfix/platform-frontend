import { Dictionary } from "@neufund/shared-utils";
import React, { createContext } from "react";

import { LightTheme } from "./light/Light";
import { ITheme } from "./types";

const themes: Dictionary<ITheme> = {
  light: LightTheme,
};

const ThemeContext = createContext(themes.light);

const ThemeProvider: React.FunctionComponent = ({ children }) => (
  <ThemeContext.Provider value={themes.light}>{children}</ThemeContext.Provider>
);

const useTheme = () => React.useContext(ThemeContext);

export { ThemeProvider, useTheme };
