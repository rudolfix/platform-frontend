import * as React from "react";
import * as styles from "./InlineIcon.module.scss";

interface IProps {
  svgIcon: string;
}

export const InlineIcon: React.SFC<IProps> = ({ svgIcon }) => {
  return (
    <span
      className={`inline-icon ${styles.inlineIcon}`}
      dangerouslySetInnerHTML={{ __html: svgIcon }}
    />
  );
};
