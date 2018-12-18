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

interface IResponsiveImage {
  src?: string;
  srcSet: ISrcSet;
  alt: string;
  theme?: TTheme;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  preserveOriginalRatio?: boolean;
  forceBg?: string;
}

const ResponsiveImage: React.SFC<IResponsiveImage> = ({
  alt,
  className,
  src,
  srcSet,
  height,
  width,
  theme,
  onClick,
  preserveOriginalRatio,
  forceBg,
}) => {
  const computedSrcSet = `${srcSet["1x"]} 1x,
    ${srcSet["2x"] && srcSet["2x"] + " 2x"},
    ${srcSet["3x"] && srcSet["3x"] + " 3x"}`;

  return (
    <Proportion
      width={width}
      height={height}
      className={cn(styles.responsiveImage, className, theme)}
      onClick={onClick}
    >
      {srcSet["1x"] && (
        <img
          className={cn(styles.image, preserveOriginalRatio ? styles.preserveRatio : null)}
          src={src || srcSet["1x"]}
          srcSet={computedSrcSet}
          alt={alt}
          style={{ backgroundColor: forceBg }}
        />
      )}
    </Proportion>
  );
};

ResponsiveImage.defaultProps = {
  theme: "dark",
};

export { ResponsiveImage, IResponsiveImage };
