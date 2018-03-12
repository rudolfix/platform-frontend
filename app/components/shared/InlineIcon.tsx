import * as React from "react";
import * as styles from "./InlineIcon.module.scss";

interface IProps {
  svgIcon: string;
  onClick?: () => void;
}

export const InlineIcon: React.SFC<IProps> = ({ svgIcon, ...props }) => {
  return <span className={styles.inlineIcon} {...props} dangerouslySetInnerHTML={{ __html: svgIcon }} />;
};
