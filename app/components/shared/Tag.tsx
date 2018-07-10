import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";

import { TTranslatedString } from "../../types";

import { InlineIcon } from "./InlineIcon";

import * as styles from "./Tag.module.scss";

type TTheme = "dark" | "green" | "white" | "default";
type TLayout = "ghost" | "ghost-bold" | "bold";
type TSize = "small";

export interface ITag {
  text: TTranslatedString;
  to?: string;
  layout?: TLayout;
  size?: TSize;
  theme?: TTheme;
  className?: string;
  onClick?: (e: any) => void;
  svgIcon?: string;
  placeSvgInEnd?: boolean;
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
  placeSvgInEnd,
}) => {
  const classes = cn(styles.tag, layout, size, theme, className);

  return (
    <>
      {to ? (
        <Link to={to} className={classes}>
          {!placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
          {text}
          {placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2" />}
        </Link>
      ) : (
        <span onClick={onClick} className={classes}>
          {!placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} />}
          {text}
          {placeSvgInEnd && !!svgIcon && <InlineIcon svgIcon={svgIcon} className="ml-2" />}
        </span>
      )}
    </>
  );
};
