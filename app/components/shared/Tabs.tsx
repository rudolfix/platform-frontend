import * as cn from "classnames";
import * as React from "react";
import { NavLink } from "react-router-dom";
import * as styles from "./Tabs.module.scss";

type TTheme = "dark" | "light";

interface ITab {
  path: string;
  text: string;
  handleClick?: () => void;
}

interface IProps {
  tabs: ITab[];
  theme?: TTheme;
  style?: any;
  className?: string;
}

export const Tabs: React.SFC<IProps> = ({ tabs, theme, className, ...props }) => (
  <div className={cn(styles.tabs, className)} {...props}>
    {tabs.map(({ path, text, handleClick }) => (
      <NavLink to={path} className={cn(styles.tab, theme)}>
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
