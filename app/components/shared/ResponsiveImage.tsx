import * as cn from "classnames";
import * as React from "react";

import { Proportion } from "./Proportion";

import * as styles from "./ResponsiveImage.module.scss";

export interface ISrcSet {
  "1x": string;
  "2x"?: string;
  "3x"?: string;
}

type TTheme = "light" | "dark" | "transparent";

export interface IResponsiveImage {
  src?: string;
  srcSet: ISrcSet;
  alt: string;
  theme?: TTheme;
  width?: number;
  height?: number;
  className?: string;
}

export const ResponsiveImage: React.SFC<IResponsiveImage> = ({
  alt,
  className,
  src,
  srcSet,
  height,
  width,
  theme,
}) => {
  const computedSrcSet = `${srcSet["1x"]} 1x,
    ${srcSet["2x"] && (srcSet["2x"] as string) + " 2x"},
    ${srcSet["3x"] && (srcSet["3x"] as string) + " 3x"}`;

  return (
    <Proportion
      width={width}
      height={height}
      className={cn(styles.responsiveImage, className, theme)}
    >
      <img className={styles.image} src={src || srcSet["1x"]} srcSet={computedSrcSet} alt={alt} />
    </Proportion>
  );
};

ResponsiveImage.defaultProps = {
  theme: "dark",
};
