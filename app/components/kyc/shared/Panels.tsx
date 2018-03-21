import * as React from "react";
import * as styles from "./Panels.module.scss";

export enum PanelTheme {
  black = "t-black",
  grey = "t-grey",
  blue = "t-blue",
}

export interface IKycPanel {
  theme: PanelTheme;
  content: React.ReactNode;
  id: number;
}

interface IProps {
  panels: IKycPanel[];
}

export const Panels: React.SFC<IProps> = ({ panels }) => (
  <div className={styles.panels}>
    {panels.map(({ content, theme, id }) => (
      <div key={id} className={`${styles.panel} ${theme}`}>
        {content}
      </div>
    ))}
  </div>
);
