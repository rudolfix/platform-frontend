import * as React from "react";

import { Proportion } from "./Proportion";
import * as styles from "./ResponsiveImage.module.scss";

interface IProps {
  src: string;
  srcSet: {
    "1x": string;
    "2x": string;
    "3x": string;
  };
  alt: string;
  width: number;
  height: number;
}

export const ResponsiveImage: React.SFC<IProps> = ({ alt, src, srcSet, height, width }) => {
  return (
    <Proportion width={width} height={height} className={styles.responsiveImage}>
      <img
        className={styles.image}
        src={src}
        srcSet={`${srcSet["1x"]} 1x, ${srcSet["2x"]} 2x, ${srcSet["3x"]} 3x`}
        alt={alt}
      />
    </Proportion>
  );
};
