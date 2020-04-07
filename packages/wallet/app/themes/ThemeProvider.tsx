import { Dictionary } from "@neufund/shared";
import React from "react";
import { createContext } from "react";

import { LightTheme } from "./light/Light";
import { ITheme } from "./types";

const themes: Dictionary<ITheme> = {
  light: LightTheme,
};

const ThemeContext = createContext(themes.light);

const ThemeProvider: React.FunctionComponent = ({ children }) => {
  return <ThemeContext.Provider value={themes.light}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
  return React.useContext(ThemeContext);
};

export { ThemeProvider, useTheme };