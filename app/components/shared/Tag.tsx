import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import { InlineIcon } from "./InlineIcon";
import * as styles from "./Tag.module.scss";

type TTheme = "dark" | "green";
type TLayout = "ghost";
type TSize = "small";

export interface ITag {
  text: string;
  to?: string;
  layout?: TLayout;
  size?: TSize;
  theme?: TTheme;
  className?: string;
  onClick?: (e: any) => void;
  svgIcon?: string;
}

export const Tag: React.SFC<ITag> = ({
  text,
  to,
  layout,
  size,
  theme,
  className,
  onClick,
  svgIcon,
}) => {
  const classes = cn(styles.tag, layout, size, theme, className);

  return (
    <>
      {to ? (
        <Link to={to} className={classes}>
          {!!svgIcon && <InlineIcon svgIcon={svgIcon} />}
          {text}
        </Link>
      ) : (
        <span onClick={onClick} className={classes}>
          {!!svgIcon && <InlineIcon svgIcon={svgIcon} />}
          {text}
        </span>
      )}
    </>
  );
};
