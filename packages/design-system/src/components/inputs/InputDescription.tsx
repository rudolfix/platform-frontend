import * as React from "react";

import { TTranslatedString } from "../../types";

import styles from "./InputDescription.module.scss";

type TDescriptionProps = {
  children: TTranslatedString;
  name: string;
};

const InputDescription: React.FunctionComponent<TDescriptionProps> = ({ name, children }) => (
  <p className={styles.description} id={`${name}-description`}>
    {children}
  </p>
);

export { InputDescription };
