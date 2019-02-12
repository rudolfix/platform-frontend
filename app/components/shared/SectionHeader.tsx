import * as cn from "classnames";
import { isString } from "lodash";
import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";
import { invariant } from "../../utils/invariant";

import * as styles from "./SectionHeader.module.scss";

export enum ESectionHeaderSize {
  SMALL = styles.small,
}

interface IProps {
  className?: string;
  description?: TTranslatedString;
  decorator?: boolean | string;
  size?: ESectionHeaderSize;
}

export const SectionHeader: React.FunctionComponent<IProps & TDataTestId> = ({
  children,
  className,
  decorator,
  description,
  size,
  "data-test-id": dataTestId,
}) => {
  invariant(
    !isString(decorator) || !description,
    "Svg icon and description at the same time are not supported",
  );

  return (
    <header
      data-test-id={dataTestId}
      className={cn(styles.sectionHeader, size, className, {
        [styles.hasDecorator]: decorator === true,
      })}
    >
      <h3 className={cn(styles.header, { [styles.hasIcon]: isString(decorator) })}>
        {isString(decorator) && <img className={styles.icon} src={decorator} alt="" />}
        {children}
      </h3>
      {description && <p className={cn(styles.description)}>{description}</p>}
    </header>
  );
};

SectionHeader.defaultProps = {
  decorator: true,
};
