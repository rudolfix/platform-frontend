import * as cn from "classnames";
import * as React from "react";
import * as styles from "./InlineIcon.module.scss";

interface IProps {
  svgIcon: string;
  width?: string;
  height?: string;
  className?: string;
  onClick?: () => void;
}

export const InlineIcon: React.SFC<IProps> = ({
  svgIcon,
  width,
  height,
  className = cn("inline-icon", styles.inlineIcon),
  ...props
}) => {
  return (
    <span
      className={className}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgIcon }}
      {...props}
    />
  );
};
