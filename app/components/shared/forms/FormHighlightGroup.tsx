import * as React from "react";

import * as styles from "./FormHighlightGroup.module.scss";
import {ReactNode} from "react";
import {TTranslatedString} from "../../../types";

interface IProps {
  children: ReactNode
  title?: TTranslatedString | string
}

export const FormHighlightGroup = ({ children, title }:IProps) => {
  return <div className={styles.formHighlightGroup}>
    {title && (
      <div className="mb-4 text-uppercase">{title}</div>
    )}
    {children}
    </div>;
};
