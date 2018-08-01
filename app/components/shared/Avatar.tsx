import * as cn from "classnames";
import * as React from "react";
import Blockies from "react-blockies";

import { CommonHtmlProps } from "../../types";

import * as styles from "./Avatar.module.scss";

interface IProps {
  seed: string;
}

export const Avatar: React.SFC<IProps & CommonHtmlProps> = ({ seed, className, style }) => {
  return (
    <div className={cn(styles.avatar, className)} style={style}>
      <Blockies seed={seed} />
    </div>
  );
};
