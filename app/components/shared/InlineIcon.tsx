import * as cn from "classnames";
import * as React from "react";
import * as styles from "./InlineIcon.module.scss";

interface IProps {
  svgIcon: string;
  onClick?: () => void;
}

export const InlineIcon: React.SFC<IProps> = ({ svgIcon, ...props }) => {
  return (
    <span
      className={cn("inline-icon", styles.inlineIcon)}
      {...props}
      dangerouslySetInnerHTML={{ __html: svgIcon }}
    />
  );
};
