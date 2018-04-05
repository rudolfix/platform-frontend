import * as cn from "classnames";
import * as React from "react";
import { NavLink } from "react-router-dom";
import * as styles from "./Tabs.module.scss";

type TTheme = "dark" | "light";

interface ITab {
  path: string;
  text: string;
  handleClick?: () => void;
  dataTestId?: string;
}

interface IProps {
  tabs: ITab[];
  theme?: TTheme;
  style?: any;
  className?: string;
}

export const Tabs: React.SFC<IProps> = ({ tabs, theme, className, ...props }) => (
  <div className={cn(styles.tabs, className)} {...props}>
    {tabs.map(({ path, text, handleClick, dataTestId }, index) => (
      <NavLink to={{pathname:path, search:window.location.search}} className={cn(styles.tab, theme)} data-test-id={dataTestId} key={index}>
        <div key={text} onClick={handleClick}>
          {text}
        </div>
      </NavLink>
    ))}
  </div>
);

Tabs.defaultProps = {
  theme: "dark",
};
