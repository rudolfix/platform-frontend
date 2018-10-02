import * as cn from "classnames";
import * as React from "react";

import * as styles from "./LoadingIndicator.module.scss";

type TLoadingIndicator = "pulse" | "blocks";

interface ILoadingIndicatorProps {
  className?: string;
  light?: boolean;
  type?: TLoadingIndicator;
}

const LoadingIndicator: React.SFC<ILoadingIndicatorProps> = ({
  className,
  light,
  type = "pulse",
}) => {
  switch (type) {
    case "pulse":
      return <div className={cn(className, styles.spinner, { [styles.light]: light })} />;
    case "blocks":
      return (
        <div className={cn(className, styles.blocks)}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      );
  }
};

export { LoadingIndicator };
