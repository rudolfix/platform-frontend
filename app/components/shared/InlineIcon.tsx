import * as React from "react";
import * as styles from "./InlineIcon.module.scss";

interface IProps {
  svgIcon: string;
  width?: string;
  height?: string;
}

export const InlineIcon: React.SFC<IProps> = ({ svgIcon, width, height }) => {
  return (
    <span
      className={`inline-icon ${styles.inlineIcon}`}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgIcon }}
    />
  );
};
