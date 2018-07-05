import * as cn from "classnames";
import * as React from "react";

import { NavLinkConnected } from "./connectedRouting";
import * as styles from "./Tabs.module.scss";

type TTheme = "dark" | "light";
type TSize = "large";

interface ITab {
  path?: string;
  text: string | React.ReactNode;
  handleClick?: () => void;
  dataTestId?: string;
  isActive?: boolean;
}

interface IProps {
  tabs: ITab[];
  theme?: TTheme;
  size?: TSize;
  style?: any;
  className?: string;
  hasDivider?: boolean;
}

export const Tabs: React.SFC<IProps> = ({ tabs, theme, size, className, hasDivider, ...props }) => (
  <div className={cn(styles.tabs, className)} {...props}>
    {tabs.map(
      ({ path, text, handleClick, dataTestId, isActive }, index) =>
        path ? (
          <NavLinkConnected
            to={{ pathname: path, search: window.location.search }} // we pass all query string arguments. It's needed to make redirection back to authorized route work
            className={cn(styles.tab, theme, size, hasDivider && "has-divider")}
            data-test-id={dataTestId}
            key={index}
          >
            <div>{text}</div>
          </NavLinkConnected>
        ) : (
          <div onClick={handleClick} className={cn(styles.tab, size, isActive && "active", hasDivider && "has-divider")} key={index}>
            {text}
          </div>
        ),
    )}
  </div>
);

Tabs.defaultProps = {
  theme: "dark",
  hasDivider: true,
};
