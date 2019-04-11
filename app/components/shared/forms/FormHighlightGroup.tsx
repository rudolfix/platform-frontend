import * as React from "react";

import { TTranslatedString } from "../../../types";

import * as styles from "./FormHighlightGroup.module.scss";

interface IProps {
  title?: TTranslatedString | string;
}

// TODO: Refactor to fieldset with legend as a title
export const FormHighlightGroup: React.FunctionComponent<IProps> = ({ title, children }) => (
  <div className={styles.formHighlightGroup}>
    {title && <p>{title}</p>}
    {children}
  </div>
);
