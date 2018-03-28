import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import * as styles from "./Tag.module.scss";

type TColor = "green";
type TLayout = "ghost";
type TSize = "small";

export interface ITag {
  text: string;
  to?: string;
  layout?: TLayout;
  size?: TSize;
  color?: TColor;
  className?: string;
}

export const Tag: React.SFC<ITag> = ({ text, to, layout, size, color, className }) => {
  const classes = cn(styles.tag, layout, size, color, className);

  return (
    <>
      {to ? (
        <Link to={to} className={classes}>
          {text}
        </Link>
      ) : (
        <span className={classes}>{text}</span>
      )}
    </>
  );
};
