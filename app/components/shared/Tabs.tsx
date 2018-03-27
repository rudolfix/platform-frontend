import * as React from "react";
import * as styles from "./Tabs.module.scss";

type TTheme = "t-dark" | "t-light";

interface ITab {
  text: string;
  isSelected: boolean;
}

interface IProps {
  tabs: ITab[];
  theme?: TTheme;
  style?: any;
  className?: string;
}

export const Tabs: React.SFC<IProps> = ({ tabs, theme, className, ...props }) => (
  <div className={`${styles.tabs} ${className}`} {...props}>
    {tabs.map(({ text, isSelected }) => (
      <div key={text} className={`${styles.tab} ${theme} ${isSelected ? "is-selected" : ""}`}>
        {text}
      </div>
    ))}
  </div>
);

Tabs.defaultProps = {
  theme: "t-dark",
};
